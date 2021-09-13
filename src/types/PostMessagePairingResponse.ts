import { PeerInfo } from './PeerInfo'

/**
 * @internalapi
 */
export interface PostMessagePairingResponse extends PeerInfo {
  id: string
  type: 'postmessage-pairing-response'
  name: string
  publicKey: string
  icon?: string // TODO: Should this be a URL or base64 image?
  appUrl?: string
}

/**
 * @internalapi
 */
export type ExtendedPostMessagePairingResponse = PostMessagePairingResponse & {
  senderId: string
  extensionId: string
}
// TODO: Rename to "WalletPeerInfo"?
