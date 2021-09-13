import * as sodium from 'libsodium-wrappers'

import axios from 'axios'
import {
  getHexHash,
  toHex,
  recipientString,
  openCryptobox,
  encryptCryptoboxPayload,
  decryptCryptoboxPayload
} from '../../utils/crypto'
import { MatrixClient } from '../../matrix-client/MatrixClient'
import {
  MatrixClientEvent,
  MatrixClientEventType,
  MatrixClientEventMessageContent
} from '../../matrix-client/models/MatrixClientEvent'
import { MatrixMessageType } from '../../matrix-client/models/MatrixMessage'
import { MatrixRoom } from '../../matrix-client/models/MatrixRoom'
import { Storage } from '../../storage/Storage'
import { P2PPairingRequest, PeerManager, StorageKey } from '../..'
import { BEACON_VERSION } from '../../constants'
import { generateGUID } from '../../utils/generate-uuid'
import { ExtendedP2PPairingResponse, P2PPairingResponse } from '../../types/P2PPairingResponse'
import { getSenderId } from '../../utils/get-sender-id'
import { Logger } from '../../utils/Logger'
import { CommunicationClient } from './CommunicationClient'
import { ExposedPromise } from '../../utils/exposed-promise'

const logger = new Logger('P2PCommunicationClient')

const KNOWN_RELAY_SERVERS = [
  'beacon-node-1.sky.papers.tech',
  'beacon-node-0.papers.tech:8448',
  'beacon-node-2.sky.papers.tech'
]

const publicKeyToNumber = (arr: Uint8Array, mod: number) => {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i] + i
  }
  return Math.floor(sum % mod)
}

/**
 * @internalapi
 *
 *
 */
export class P2PCommunicationClient extends CommunicationClient {
  private client: ExposedPromise<MatrixClient> = new ExposedPromise()

  private initialEvent: MatrixClientEvent<MatrixClientEventType.MESSAGE> | undefined
  private initialListener:
    | ((event: MatrixClientEvent<MatrixClientEventType.MESSAGE>) => void)
    | undefined

  private readonly KNOWN_RELAY_SERVERS: string[]
  public relayServer: ExposedPromise<string> | undefined

  private readonly activeListeners: Map<string, (event: MatrixClientEvent<any>) => void> = new Map()

  private readonly ignoredRooms: string[] = []
  private loginCounter: number = 0

  constructor(
    private readonly name: string,
    keyPair: sodium.KeyPair,
    public readonly replicationCount: number,
    private readonly storage: Storage,
    matrixNodes: string[],
    private readonly iconUrl?: string,
    private readonly appUrl?: string
  ) {
    super(keyPair)

    logger.log('constructor', 'P2PCommunicationClient created')
    this.KNOWN_RELAY_SERVERS = matrixNodes.length > 0 ? matrixNodes : KNOWN_RELAY_SERVERS
  }

  public async getPairingRequestInfo(): Promise<P2PPairingRequest> {
    const info: P2PPairingRequest = {
      id: await generateGUID(),
      type: 'p2p-pairing-request',
      name: this.name,
      version: BEACON_VERSION,
      publicKey: await this.getPublicKey(),
      relayServer: await this.getRelayServer()
    }

    if (this.iconUrl) {
      info.icon = this.iconUrl
    }
    if (this.appUrl) {
      info.appUrl = this.appUrl
    }

    return info
  }

  public async getPairingResponseInfo(request: P2PPairingRequest): Promise<P2PPairingResponse> {
    const info: P2PPairingResponse = {
      id: request.id,
      type: 'p2p-pairing-response',
      name: this.name,
      version: BEACON_VERSION,
      publicKey: await this.getPublicKey(),
      relayServer: await this.getRelayServer()
    }

    if (this.iconUrl) {
      info.icon = this.iconUrl
    }
    if (this.appUrl) {
      info.appUrl = this.appUrl
    }

    return info
  }

  public async getRelayServer(): Promise<string> {
    if (this.relayServer) {
      return this.relayServer.promise
    } else {
      this.relayServer = new ExposedPromise()
    }

    // MIGRATION: If a relay server is set, it's all good and we don't have to do any migration
    const node = await this.storage.get(StorageKey.MATRIX_SELECTED_NODE)
    if (node && node.length > 0) {
      this.relayServer.resolve(node)
      return node
    } else if (KNOWN_RELAY_SERVERS === this.KNOWN_RELAY_SERVERS) {
      // Migration start
      // Only if the array of nodes is the default we do the migration, otherwise we leave it.
      // If NO relay server is set, we have 3 possibilities:

      const hasDoneMigration = await this.storage.get(StorageKey.MULTI_NODE_SETUP_DONE)
      if (!hasDoneMigration) {
        // If this migration has run before, we can skip it.
        const preservedState = await this.storage.get(StorageKey.MATRIX_PRESERVED_STATE)
        console.log('PRESERVED STATE', preservedState)
        if (preservedState.syncToken || preservedState.rooms) {
          // If migration has NOT run and we have a sync state, we know have been previously connected. So we set the old default relayServer as our current node.
          const node = 'matrix.papers.tech' // 2.2.7 Migration: This will default to the old default to avoid peers from losing their relayServer.
          this.storage
            .set(StorageKey.MATRIX_SELECTED_NODE, node)
            .catch((error) => logger.log(error))
          this.relayServer.resolve(node)
          return node
        }

        this.storage.set(StorageKey.MULTI_NODE_SETUP_DONE, true).catch((error) => logger.log(error))
        // Migration end
      }
    }

    console.log('GET RELAY SERVER')

    const startIndex = publicKeyToNumber(this.keyPair.publicKey, this.KNOWN_RELAY_SERVERS.length)
    let offset = 0

    while (offset < this.KNOWN_RELAY_SERVERS.length) {
      const serverIndex = (startIndex + offset) % this.KNOWN_RELAY_SERVERS.length
      const server = this.KNOWN_RELAY_SERVERS[serverIndex]

      try {
        await axios.get(`https://${server}/_matrix/client/versions`)
        this.storage
          .set(StorageKey.MATRIX_SELECTED_NODE, server)
          .catch((error) => logger.log(error))

        this.relayServer.resolve(server)
        return server
      } catch (relayError) {
        logger.log(`Ignoring server "${server}", trying another one...`)
        offset++
      }
    }

    this.relayServer.reject(`No matrix server reachable!`)
    throw new Error(`No matrix server reachable!`)
  }

  public async tryJoinRooms(roomId: string, retry: number = 1): Promise<void> {
    try {
      await (await this.client.promise).joinRooms(roomId)
    } catch (error) {
      if (retry <= 10 && error.errcode === 'M_FORBIDDEN') {
        // If we join the room too fast after receiving the invite, the server can accidentally reject our join. This seems to be a problem only when using a federated multi-node setup. Usually waiting for a couple milliseconds solves the issue, but to handle lag, we will keep retrying for 2 seconds.
        logger.log(`Retrying to join...`, error)
        setTimeout(async () => {
          await this.tryJoinRooms(roomId, retry + 1)
        }, 200)
      } else {
        logger.log(`Failed to join after ${retry} tries.`, error)
      }
    }
  }

  public async start(): Promise<void> {
    logger.log('start', 'starting client')

    await sodium.ready

    const loginRawDigest = sodium.crypto_generichash(
      32,
      sodium.from_string(`login:${Math.floor(Date.now() / 1000 / (5 * 60))}`)
    )
    const rawSignature = sodium.crypto_sign_detached(loginRawDigest, this.keyPair.privateKey)

    logger.log('start', `connecting to server`)

    const relayServer = await this.getRelayServer()

    const client = MatrixClient.create({
      baseUrl: `https://${relayServer}`,
      storage: this.storage
    })

    this.initialListener = async (
      event: MatrixClientEvent<MatrixClientEventType.MESSAGE>
    ): Promise<void> => {
      if (this.initialEvent && this.initialEvent.timestamp && event && event.timestamp) {
        if (this.initialEvent.timestamp < event.timestamp) {
          this.initialEvent = event
        }
      } else {
        this.initialEvent = event
      }
    }
    client.subscribe(MatrixClientEventType.MESSAGE, this.initialListener)

    client.subscribe(MatrixClientEventType.INVITE, async (event) => {
      let member
      if (event.content.members.length === 1) {
        // If there is only one member we know it's a new room
        // TODO: Use the "sender" of the event instead
        member = event.content.members[0]
      }

      await this.tryJoinRooms(event.content.roomId)

      if (member) {
        await this.updateRelayServer(member)
        await this.updatePeerRoom(member, event.content.roomId)
      }
    })

    logger.log('start', 'login', await this.getPublicKeyHash(), 'on', relayServer)

    try {
      await client.start({
        id: await this.getPublicKeyHash(),
        password: `ed:${toHex(rawSignature)}:${await this.getPublicKey()}`,
        deviceId: toHex(this.keyPair.publicKey)
      })
    } catch (error) {
      console.log('ERROR, RETRYING')
      await this.reset() // If we can't log in, let's reset
      console.log('TRYING AGAIN')
      if (this.loginCounter <= this.KNOWN_RELAY_SERVERS.length) {
        this.loginCounter++
        this.start()
        return
      } else {
        throw new Error('Too many login attempts. Try again later.')
      }
    }

    console.log('client is ready')
    this.client.resolve(client)
  }

  public async stop(): Promise<void> {
    if (this.client.isResolved()) {
      await (await this.client.promise).stop().catch((error) => logger.error(error))
    }
    await this.reset()
  }

  public async reset(): Promise<void> {
    await this.storage.delete(StorageKey.MATRIX_PEER_ROOM_IDS).catch((error) => logger.log(error))
    await this.storage.delete(StorageKey.MATRIX_PRESERVED_STATE).catch((error) => logger.log(error))
    await this.storage.delete(StorageKey.MATRIX_SELECTED_NODE).catch((error) => logger.log(error))
    // Instead of resetting everything, maybe we should make sure a new instance is created?
    this.relayServer = undefined
    this.client = new ExposedPromise()
    this.initialEvent = undefined
    this.initialListener = undefined
  }

  public async listenForEncryptedMessage(
    senderPublicKey: string,
    messageCallback: (message: string) => void
  ): Promise<void> {
    if (this.activeListeners.has(senderPublicKey)) {
      return
    }

    const { sharedRx } = await this.createCryptoBoxServer(senderPublicKey, this.keyPair.privateKey)

    const callbackFunction = async (
      event: MatrixClientEvent<MatrixClientEventType.MESSAGE>
    ): Promise<void> => {
      if (this.isTextMessage(event.content) && (await this.isSender(event, senderPublicKey))) {
        let payload

        await this.updateRelayServer(event.content.message.sender)
        await this.updatePeerRoom(event.content.message.sender, event.content.roomId)

        try {
          payload = Buffer.from(event.content.message.content, 'hex')
          // content can be non-hex if it's a connection open request
        } catch {
          /* */
        }
        if (
          payload &&
          payload.length >= sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
        ) {
          try {
            const decryptedMessage = await decryptCryptoboxPayload(payload, sharedRx)

            // logger.log(
            //   'listenForEncryptedMessage',
            //   'encrypted message received',
            //   decryptedMessage,
            //   await new Serializer().deserialize(decryptedMessage)
            // )
            // console.log('calculated sender ID', await getSenderId(senderPublicKey))
            // TODO: Add check for correct decryption key / sender ID

            messageCallback(decryptedMessage)
          } catch (decryptionError) {
            /* NO-OP. We try to decode every message, but some might not be addressed to us. */
          }
        }
      }
    }

    this.activeListeners.set(senderPublicKey, callbackFunction)
    ;(await this.client.promise).subscribe(MatrixClientEventType.MESSAGE, callbackFunction)

    const lastEvent = this.initialEvent
    if (
      lastEvent &&
      lastEvent.timestamp &&
      new Date().getTime() - lastEvent.timestamp < 5 * 60 * 1000
    ) {
      logger.log('listenForEncryptedMessage', 'Handling previous event')
      await callbackFunction(lastEvent)
    } else {
      logger.log('listenForEncryptedMessage', 'No previous event found')
    }

    const initialListener = this.initialListener
    if (initialListener) {
      ;(await this.client.promise).unsubscribe(MatrixClientEventType.MESSAGE, initialListener)
    }
    this.initialListener = undefined
    this.initialEvent = undefined
  }

  public async unsubscribeFromEncryptedMessage(senderPublicKey: string): Promise<void> {
    const listener = this.activeListeners.get(senderPublicKey)
    if (!listener) {
      return
    }

    ;(await this.client.promise).unsubscribe(MatrixClientEventType.MESSAGE, listener)

    this.activeListeners.delete(senderPublicKey)
  }

  public async unsubscribeFromEncryptedMessages(): Promise<void> {
    ;(await this.client.promise).unsubscribeAll(MatrixClientEventType.MESSAGE)

    this.activeListeners.clear()
  }

  public async sendMessage(
    message: string,
    peer: P2PPairingRequest | ExtendedP2PPairingResponse
  ): Promise<void> {
    const { sharedTx } = await this.createCryptoBoxClient(peer.publicKey, this.keyPair.privateKey)

    const recipientHash: string = await getHexHash(Buffer.from(peer.publicKey, 'hex'))
    const recipient = recipientString(recipientHash, peer.relayServer)

    const roomId = await this.getRelevantRoom(recipient)

    // Before we send the message, we have to wait for the join to be accepted.
    await this.waitForJoin(roomId) // TODO: This can probably be removed because we are now waiting inside the get room method

    const encryptedMessage = await encryptCryptoboxPayload(message, sharedTx)

    // logger.log(
    //   'sendMessage',
    //   'sending encrypted message',
    //   peer.publicKey,
    //   roomId,
    //   message,
    //   await new Serializer().deserialize(message)
    // )

    ;(await this.client.promise).sendTextMessage(roomId, encryptedMessage).catch(async (error) => {
      if (error.errcode === 'M_FORBIDDEN') {
        // Room doesn't exist
        logger.log(`sendMessage`, `M_FORBIDDEN`, error)
        await this.deleteRoomIdFromRooms(roomId)
        const newRoomId = await this.getRelevantRoom(recipient)

        ;(await this.client.promise)
          .sendTextMessage(newRoomId, encryptedMessage)
          .catch(async (error2) => {
            logger.log(`sendMessage`, `inner error`, error2)
          })
      } else {
        logger.log(`sendMessage`, `not forbidden`, error)
      }
    })
  }

  public async updatePeerRoom(sender: string, roomId: string): Promise<void> {
    // Sender is in the format "@pubkeyhash:relayserver.tld"
    const split = sender.split(':')
    if (split.length < 2 || !split[0].startsWith('@')) {
      throw new Error('Invalid sender')
    }

    const roomIds = await this.storage.get(StorageKey.MATRIX_PEER_ROOM_IDS)

    const room = roomIds[sender]

    if (room && room[1]) {
      // If we have a room already, let's ignore it. We need to do this, otherwise it will be loaded from the matrix cache.
      this.ignoredRooms.push(room[1])
    }

    roomIds[sender] = roomId

    await this.storage.set(StorageKey.MATRIX_PEER_ROOM_IDS, roomIds)

    // TODO: We also need to delete the room from the sync state
    // If we need to delete a room, we can assume the local state is not up to date anymore, so we can reset the state
  }

  public async deleteRoomIdFromRooms(roomId: string): Promise<void> {
    const roomIds = await this.storage.get(StorageKey.MATRIX_PEER_ROOM_IDS)
    const newRoomIds = Object.entries(roomIds)
      .filter((entry) => entry[1] !== roomId)
      .reduce(
        (pv, cv) => ({ ...pv, [cv[0]]: cv[1] }),
        {} as {
          [key: string]: string | undefined
        }
      )
    await this.storage.set(StorageKey.MATRIX_PEER_ROOM_IDS, newRoomIds)

    // TODO: We also need to delete the room from the sync state
    // If we need to delete a room, we can assume the local state is not up to date anymore, so we can reset the state

    this.ignoredRooms.push(roomId)
  }

  public async listenForChannelOpening(
    messageCallback: (pairingResponse: ExtendedP2PPairingResponse) => void
  ): Promise<void> {
    ;(await this.client.promise).subscribe(MatrixClientEventType.MESSAGE, async (event) => {
      if (this.isTextMessage(event.content) && (await this.isChannelOpenMessage(event.content))) {
        logger.log(`listenForChannelOpening`, `channel opening`, JSON.stringify(event))

        await this.updateRelayServer(event.content.message.sender)
        await this.updatePeerRoom(event.content.message.sender, event.content.roomId)

        const splits = event.content.message.content.split(':')
        const payload = Buffer.from(splits[splits.length - 1], 'hex')

        if (
          payload.length >=
          sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
        ) {
          try {
            const pairingResponse: P2PPairingResponse = JSON.parse(
              await openCryptobox(payload, this.keyPair.publicKey, this.keyPair.privateKey)
            )

            messageCallback({
              ...pairingResponse,
              senderId: await getSenderId(pairingResponse.publicKey)
            })
          } catch (decryptionError) {
            /* NO-OP. We try to decode every message, but some might not be addressed to us. */
          }
        }
      }
    })
  }

  public async waitForJoin(roomId: string, retry: number = 0): Promise<void> {
    // Rooms are updated as new events come in. `client.getRoomById` only accesses memory, it does not do any network requests.
    // TODO: Improve to listen to "JOIN" event
    const room = await (await this.client.promise).getRoomById(roomId)
    logger.log(`waitForJoin`, `Currently ${room.members.length} members, we need at least 2`)
    if (room.members.length >= 2 || room.members.length === 0) {
      // 0 means it's an unknown room, we don't need to wait
      return
    } else {
      if (retry <= 200) {
        // On mobile, due to app switching, we potentially have to wait for a long time
        logger.log(`Waiting for join... Try: ${retry}`)

        return new Promise((resolve) => {
          setTimeout(async () => {
            resolve(this.waitForJoin(roomId, retry + 1))
          }, 100 * (retry > 50 ? 10 : 1)) // After the initial 5 seconds, retry only once per second
        })
      } else {
        throw new Error(`No one joined after ${retry} tries.`)
      }
    }
  }

  public async sendPairingResponse(pairingRequest: P2PPairingRequest): Promise<void> {
    logger.log(`sendPairingResponse`)
    const recipientHash = await getHexHash(Buffer.from(pairingRequest.publicKey, 'hex'))
    const recipient = recipientString(recipientHash, pairingRequest.relayServer)

    // We force room creation here because if we "re-pair", we need to make sure that we don't send it to an old room.
    const roomId = await (await this.client.promise).createTrustedPrivateRoom(recipient)

    await this.updatePeerRoom(recipient, roomId)

    // Before we send the message, we have to wait for the join to be accepted.
    await this.waitForJoin(roomId) // TODO: This can probably be removed because we are now waiting inside the get room method

    // TODO: remove v1 backwards-compatibility
    const message: string =
      typeof pairingRequest.version === 'undefined'
        ? await this.getPublicKey() // v1
        : JSON.stringify(await this.getPairingResponseInfo(pairingRequest)) // v2

    const encryptedMessage: string = await this.encryptMessageAsymmetric(
      pairingRequest.publicKey,
      message
    )

    const msg = ['@channel-open', recipient, encryptedMessage].join(':')
    ;(await this.client.promise).sendTextMessage(roomId, msg).catch(async (error) => {
      if (error.errcode === 'M_FORBIDDEN') {
        // Room doesn't exist
        logger.log(`sendMessage`, `M_FORBIDDEN`, error)
        await this.deleteRoomIdFromRooms(roomId)
        const newRoomId = await this.getRelevantRoom(recipient)

        ;(await this.client.promise).sendTextMessage(newRoomId, msg).catch(async (error2) => {
          logger.log(`sendMessage`, `inner error`, error2)
        })
      } else {
        logger.log(`sendMessage`, `not forbidden`, error)
      }
    })
  }

  public isTextMessage(
    content: MatrixClientEventMessageContent<any>
  ): content is MatrixClientEventMessageContent<string> {
    return content.message.type === MatrixMessageType.TEXT
  }

  public async updateRelayServer(sender: string) {
    // Sender is in the format "@pubkeyhash:relayserver.tld"
    const split = sender.split(':')
    if (split.length < 2 || !split[0].startsWith('@')) {
      throw new Error('Invalid sender')
    }
    const senderHash = split.shift()
    const relayServer = split.join(':')
    const manager = localStorage.getItem('beacon:communication-peers-dapp')
      ? new PeerManager(this.storage, StorageKey.TRANSPORT_P2P_PEERS_DAPP)
      : new PeerManager(this.storage, StorageKey.TRANSPORT_P2P_PEERS_WALLET)
    const peers = await manager.getPeers()
    const promiseArray = (peers as any).map(
      async (peer: P2PPairingRequest | ExtendedP2PPairingResponse) => {
        const hash = `@${await getHexHash(Buffer.from(peer.publicKey, 'hex'))}`
        if (hash === senderHash) {
          if (peer.relayServer !== relayServer) {
            peer.relayServer = relayServer
            await manager.addPeer(peer as any)
          }
        }
      }
    )
    await Promise.all(promiseArray)
  }

  public async isChannelOpenMessage(
    content: MatrixClientEventMessageContent<string>
  ): Promise<boolean> {
    return content.message.content.startsWith(
      `@channel-open:@${await getHexHash(Buffer.from(await this.getPublicKey(), 'hex'))}`
    )
  }

  public async isSender(
    event: MatrixClientEvent<MatrixClientEventType.MESSAGE>,
    senderPublicKey: string
  ): Promise<boolean> {
    return event.content.message.sender.startsWith(
      `@${await getHexHash(Buffer.from(senderPublicKey, 'hex'))}`
    )
  }

  private async getRelevantRoom(recipient: string): Promise<string> {
    const roomIds = await this.storage.get(StorageKey.MATRIX_PEER_ROOM_IDS)
    let roomId = roomIds[recipient]

    if (!roomId) {
      logger.log(`getRelevantRoom`, `No room found for peer ${recipient}, checking joined ones.`)
      const room = await this.getRelevantJoinedRoom(recipient)
      roomId = room.id
      roomIds[recipient] = room.id
      await this.storage.set(StorageKey.MATRIX_PEER_ROOM_IDS, roomIds)
    }

    logger.log(`getRelevantRoom`, `Using room ${roomId}`)

    return roomId
  }

  private async getRelevantJoinedRoom(recipient: string): Promise<MatrixRoom> {
    const joinedRooms = await (await this.client.promise).joinedRooms
    logger.log('checking joined rooms', joinedRooms, recipient)
    const relevantRooms = joinedRooms
      .filter((roomElement: MatrixRoom) => !this.ignoredRooms.some((id) => roomElement.id === id))
      .filter((roomElement: MatrixRoom) =>
        roomElement.members.some((member: string) => member === recipient)
      )

    let room: MatrixRoom
    // We always create a new room if one has been ignored. This is because if we ignore one, we know the server state changed.
    // So we cannot trust the current sync state. This can be removed once we have a method to properly clear and refresh the sync state.
    if (relevantRooms.length === 0 || this.ignoredRooms.length > 0) {
      logger.log(`getRelevantJoinedRoom`, `no relevant rooms found, creating new one`)

      const roomId = await (await this.client.promise).createTrustedPrivateRoom(recipient)
      room = await (await this.client.promise).getRoomById(roomId)
      logger.log(`getRelevantJoinedRoom`, `waiting for other party to join room: ${room.id}`)
      await this.waitForJoin(roomId)
      logger.log(`getRelevantJoinedRoom`, `new room created and peer invited: ${room.id}`)
    } else {
      room = relevantRooms[0]
      logger.log(`getRelevantJoinedRoom`, `channel already open, reusing room ${room.id}`)
    }

    return room
  }
}
