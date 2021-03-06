import { BeaconMessage } from '..';
import { PermissionEntity } from '../types/PermissionEntity';
/**
 * @internalapi
 *
 * The PermissionValidator is used to check if permissions for a certain message type have been given
 */
export declare class PermissionValidator {
    /**
     * Check if permissions were given for a certain message type.
     *
     * PermissionRequest and BroadcastRequest will always return true.
     *
     * @param message Beacon Message
     */
    static hasPermission(message: BeaconMessage, getOne: (id: string) => Promise<PermissionEntity | undefined>, getAll: () => Promise<PermissionEntity[]>): Promise<boolean>;
}
