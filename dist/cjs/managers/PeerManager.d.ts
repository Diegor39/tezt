import { Storage, StorageKey, StorageKeyReturnType } from '..';
import { ArrayElem } from './StorageManager';
/**
 * @internalapi
 *
 * The PeerManager provides CRUD functionality for peer entities and persists them to the provided storage.
 */
export declare class PeerManager<T extends StorageKey.TRANSPORT_P2P_PEERS_DAPP | StorageKey.TRANSPORT_P2P_PEERS_WALLET | StorageKey.TRANSPORT_POSTMESSAGE_PEERS_DAPP | StorageKey.TRANSPORT_POSTMESSAGE_PEERS_WALLET> {
    private readonly storageManager;
    constructor(storage: Storage, key: T);
    hasPeer(publicKey: string): Promise<boolean>;
    getPeers(): Promise<StorageKeyReturnType[T]>;
    getPeer(publicKey: string): Promise<ArrayElem<StorageKeyReturnType[T]> | undefined>;
    addPeer(peerInfo: ArrayElem<StorageKeyReturnType[T]>): Promise<void>;
    removePeer(publicKey: string): Promise<void>;
    removePeers(publicKeys: string[]): Promise<void>;
    removeAllPeers(): Promise<void>;
}
