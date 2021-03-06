import { BeaconMessage, Storage } from '..';
import { PermissionInfo } from '../types/PermissionInfo';
/**
 * @internalapi
 *
 * The PermissionManager provides CRUD functionality for permission entities and persists them to the provided storage.
 */
export declare class PermissionManager {
    private readonly storageManager;
    constructor(storage: Storage);
    getPermissions(): Promise<PermissionInfo[]>;
    getPermission(accountIdentifier: string): Promise<PermissionInfo | undefined>;
    addPermission(permissionInfo: PermissionInfo): Promise<void>;
    removePermission(accountIdentifier: string): Promise<void>;
    removePermissions(accountIdentifiers: string[]): Promise<void>;
    removeAllPermissions(): Promise<void>;
    hasPermission(message: BeaconMessage): Promise<boolean>;
}
