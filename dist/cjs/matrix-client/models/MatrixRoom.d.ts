import { MatrixSyncRooms } from './api/MatrixSync';
import { MatrixMessage } from './MatrixMessage';
export declare enum MatrixRoomStatus {
    UNKNOWN = 0,
    JOINED = 1,
    INVITED = 2,
    LEFT = 3
}
export declare class MatrixRoom {
    readonly id: string;
    readonly status: MatrixRoomStatus;
    readonly members: string[];
    messages: MatrixMessage<any>[];
    /**
     * Reconstruct rooms from a sync response
     *
     * @param roomSync
     */
    static fromSync(roomSync: MatrixSyncRooms): MatrixRoom[];
    /**
     * Reconstruct a room from an ID or object
     *
     * @param roomOrId
     * @param status
     */
    static from(roomOrId: string | MatrixRoom, status?: MatrixRoomStatus): MatrixRoom;
    /**
     * Merge new and old state and remove duplicates
     *
     * @param newState
     * @param previousState
     */
    static merge(newState: MatrixRoom, previousState?: MatrixRoom): MatrixRoom;
    /**
     * Create a room from a join
     *
     * @param id
     * @param joined
     */
    private static fromJoined;
    /**
     * Create a room from an invite
     *
     * @param id
     * @param invited
     */
    private static fromInvited;
    /**
     * Create a room from a leave
     *
     * @param id
     * @param left
     */
    private static fromLeft;
    /**
     * Extract members from an event
     *
     * @param events
     */
    private static getMembersFromEvents;
    /**
     * Extract messages from an event
     *
     * @param events
     */
    private static getMessagesFromEvents;
    /**
     * Get unique events and remove duplicates
     *
     * @param events
     */
    private static getUniqueEvents;
    private constructor();
}
