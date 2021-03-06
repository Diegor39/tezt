import { MatrixRoom } from './models/MatrixRoom';
import { Storage } from '../storage/Storage';
declare type OnStateChangedListener = (oldState: MatrixStateStore, newState: MatrixStateStore, stateChange: Partial<MatrixStateUpdate>) => void;
export interface MatrixState {
    isRunning: boolean;
    userId: string | undefined;
    deviceId: string | undefined;
    txnNo: number;
    accessToken: string | undefined;
    syncToken: string | undefined;
    pollingTimeout: number | undefined;
    pollingRetries: number;
    rooms: MatrixRoom[] | Record<string, MatrixRoom>;
}
export interface MatrixStateStore extends MatrixState {
    rooms: Record<string, MatrixRoom>;
}
export interface MatrixStateUpdate extends MatrixState {
    rooms: MatrixRoom[];
}
/**
 * The class managing the local state of matrix
 */
export declare class MatrixClientStore {
    private readonly storage;
    /**
     * The state of the matrix client
     */
    private state;
    /**
     * Listeners that will be called when the state changes
     */
    private readonly onStateChangedListeners;
    /**
     * A promise that resolves once the client is ready
     */
    private waitReadyPromise;
    constructor(storage: Storage);
    /**
     * Get an item from the state
     *
     * @param key
     */
    get<T extends keyof MatrixStateStore>(key: T): MatrixStateStore[T];
    /**
     * Get the room from an ID or room instance
     *
     * @param roomOrId
     */
    getRoom(roomOrId: string | MatrixRoom): MatrixRoom;
    /**
     * Update the state with a partial state
     *
     * @param stateUpdate
     */
    update(stateUpdate: Partial<MatrixStateUpdate>): Promise<void>;
    /**
     * Register listeners that are called once the state has changed
     *
     * @param listener
     * @param subscribed
     */
    onStateChanged(listener: OnStateChangedListener, ...subscribed: (keyof MatrixState)[]): void;
    /**
     * A promise that resolves once the client is ready
     */
    private waitReady;
    /**
     * Read state from storage
     */
    private initFromStorage;
    /**
     * Prepare data before persisting it in storage
     *
     * @param toStore
     */
    private prepareData;
    /**
     * Persist state in storage
     *
     * @param stateUpdate
     */
    private updateStorage;
    /**
     * Set the state
     *
     * @param partialState
     */
    private setState;
    /**
     * Merge room records and eliminate duplicates
     *
     * @param oldRooms
     * @param _newRooms
     */
    private mergeRooms;
    /**
     * Notify listeners of state changes
     *
     * @param oldState
     * @param newState
     * @param stateChange
     */
    private notifyListeners;
}
export {};
