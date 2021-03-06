import { PermissionScope, AccountIdentifier, Origin, Network } from '..';
export interface AccountInfoOld {
    accountIdentifier: AccountIdentifier;
    beaconId: string;
    origin: {
        type: Origin;
        id: string;
    };
    address: string;
    pubkey: string;
    network: Network;
    scopes: PermissionScope[];
    connectedAt: Date;
}
export interface P2PPairingRequestOld {
    name: string;
    pubKey: string;
    relayServer: string;
}
export declare const migrate_0_7_0: (storage: Storage) => Promise<void>;
