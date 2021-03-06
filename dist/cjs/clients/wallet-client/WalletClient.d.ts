import { Client, WalletClientOptions, TransportType, BeaconRequestOutputMessage, BeaconResponseInputMessage, AppMetadata, PermissionInfo } from '../..';
import { ConnectionContext } from '../../types/ConnectionContext';
import { ExtendedP2PPairingResponse } from '../../types/P2PPairingResponse';
import { ExposedPromise } from '../../utils/exposed-promise';
import { PeerInfo } from '../../types/PeerInfo';
/**
 * @publicapi
 *
 * The WalletClient has to be used in the wallet. It handles all the logic related to connecting to beacon-compatible
 * dapps and handling/responding to requests.
 *
 * @category Wallet
 */
export declare class WalletClient extends Client {
    /**
     * Returns whether or not the transport is connected
     */
    protected readonly _isConnected: ExposedPromise<boolean>;
    get isConnected(): Promise<boolean>;
    private readonly permissionManager;
    private readonly appMetadataManager;
    /**
     * This array stores pending requests, meaning requests we received and have not yet handled / sent a response.
     */
    private pendingRequests;
    constructor(config: WalletClientOptions);
    init(): Promise<TransportType>;
    /**
     * This method initiates a connection to the P2P network and registers a callback that will be called
     * whenever a message is received.
     *
     * @param newMessageCallback The callback that will be invoked for every message the transport receives.
     */
    connect(newMessageCallback: (message: BeaconRequestOutputMessage, connectionContext: ConnectionContext) => void): Promise<void>;
    /**
     * The method will attempt to initiate a connection using the active transport.
     */
    _connect(): Promise<void>;
    /**
     * This method sends a response for a specific request back to the DApp
     *
     * @param message The BeaconResponseMessage that will be sent back to the DApp
     */
    respond(message: BeaconResponseInputMessage): Promise<void>;
    getAppMetadataList(): Promise<AppMetadata[]>;
    getAppMetadata(senderId: string): Promise<AppMetadata | undefined>;
    removeAppMetadata(senderId: string): Promise<void>;
    removeAllAppMetadata(): Promise<void>;
    getPermissions(): Promise<PermissionInfo[]>;
    getPermission(accountIdentifier: string): Promise<PermissionInfo | undefined>;
    removePermission(accountIdentifier: string): Promise<void>;
    removeAllPermissions(): Promise<void>;
    /**
     * Add a new peer to the known peers
     * @param peer The new peer to add
     */
    addPeer(peer: PeerInfo, sendPairingResponse?: boolean): Promise<void>;
    removePeer(peer: ExtendedP2PPairingResponse, sendDisconnectToPeer?: boolean): Promise<void>;
    removeAllPeers(sendDisconnectToPeers?: boolean): Promise<void>;
    private removePermissionsForPeers;
    /**
     * Send an acknowledge message back to the sender
     *
     * @param message The message that was received
     */
    private sendAcknowledgeResponse;
    /**
     * An internal method to send a BeaconMessage to the DApp
     *
     * @param response Send a message back to the DApp
     */
    private respondToMessage;
}
