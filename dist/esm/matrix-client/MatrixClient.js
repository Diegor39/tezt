var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Logger } from '../utils/Logger';
import { ExposedPromise } from '../utils/exposed-promise';
import { MatrixClientStore } from './MatrixClientStore';
import { MatrixHttpClient } from './MatrixHttpClient';
import { MatrixRoom, MatrixRoomStatus } from './models/MatrixRoom';
import { MatrixRoomService } from './services/MatrixRoomService';
import { MatrixUserService } from './services/MatrixUserService';
import { MatrixEventService } from './services/MatrixEventService';
import { MatrixClientEventEmitter } from './MatrixClientEventEmitter';
const logger = new Logger('MatrixClient');
const IMMEDIATE_POLLING_RETRIES = 3;
const RETRY_INTERVAL = 5000;
/**
 * The matrix client used to connect to the matrix network
 */
export class MatrixClient {
    constructor(store, eventEmitter, userService, roomService, eventService, httpClient) {
        this.store = store;
        this.eventEmitter = eventEmitter;
        this.userService = userService;
        this.roomService = roomService;
        this.eventService = eventService;
        this.httpClient = httpClient;
        this.isActive = true;
        this._isReady = new ExposedPromise();
        this.store.onStateChanged((oldState, newState, stateChange) => {
            this.eventEmitter.onStateChanged(oldState, newState, stateChange);
        }, 'rooms');
    }
    /**
     * Create a matrix client based on the options provided
     *
     * @param config
     */
    static create(config) {
        const store = new MatrixClientStore(config.storage);
        const eventEmitter = new MatrixClientEventEmitter();
        const httpClient = new MatrixHttpClient(config.baseUrl);
        const accountService = new MatrixUserService(httpClient);
        const roomService = new MatrixRoomService(httpClient);
        const eventService = new MatrixEventService(httpClient);
        return new MatrixClient(store, eventEmitter, accountService, roomService, eventService, httpClient);
    }
    /**
     * Return all the rooms we are currently part of
     */
    get joinedRooms() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.isConnected();
            resolve(Object.values(this.store.get('rooms')).filter((room) => room.status === MatrixRoomStatus.JOINED));
        }));
    }
    /**
     * Return all the rooms to which we have received invitations
     */
    get invitedRooms() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.isConnected();
            resolve(Object.values(this.store.get('rooms')).filter((room) => room.status === MatrixRoomStatus.INVITED));
        }));
    }
    /**
     * Return all the rooms that we left
     */
    get leftRooms() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.isConnected();
            resolve(Object.values(this.store.get('rooms')).filter((room) => room.status === MatrixRoomStatus.LEFT));
        }));
    }
    /**
     * Initiate the connection to the matrix node and log in
     *
     * @param user
     */
    start(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.userService.login(user.id, user.password, user.deviceId);
            yield this.store.update({
                accessToken: response.access_token
            });
            const initialPollingResult = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield this.poll(0, (pollingResponse) => __awaiter(this, void 0, void 0, function* () {
                    if (!this.store.get('isRunning')) {
                        resolve();
                    }
                    yield this.store.update({
                        isRunning: true,
                        syncToken: pollingResponse.next_batch,
                        pollingTimeout: 30000,
                        pollingRetries: 0,
                        rooms: MatrixRoom.fromSync(pollingResponse.rooms)
                    });
                }), (error) => __awaiter(this, void 0, void 0, function* () {
                    if (!this.store.get('isRunning')) {
                        reject(error);
                    }
                    yield this.store.update({
                        isRunning: false,
                        pollingRetries: this.store.get('pollingRetries') + 1
                    });
                }));
            }));
            initialPollingResult
                .then(() => {
                this._isReady.resolve();
            })
                .catch(console.error);
            return initialPollingResult;
        });
    }
    isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._isReady.promise;
        });
    }
    /**
     * Stop all running requests
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log(`MATRIX CLIENT STOPPED`);
            this.isActive = false;
            this._isReady = new ExposedPromise();
            return this.httpClient.cancelAllRequests();
        });
    }
    /**
     * Subscribe to new matrix events
     *
     * @param event
     * @param listener
     */
    subscribe(event, listener) {
        this.eventEmitter.on(event, listener);
    }
    /**
     * Unsubscribe from matrix events
     *
     * @param event
     * @param listener
     */
    unsubscribe(event, listener) {
        if (listener) {
            this.eventEmitter.removeListener(event, listener);
        }
    }
    /**
     * Unsubscribe from all matrix events of this type
     *
     * @param event
     * @param listener
     */
    unsubscribeAll(event) {
        this.eventEmitter.removeAllListeners(event);
    }
    getRoomById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isConnected();
            return this.store.getRoom(id);
        });
    }
    /**
     * Create a private room with the supplied members
     *
     * @param members Members that will be in the room
     */
    createTrustedPrivateRoom(...members) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isConnected();
            return this.requiresAuthorization('createRoom', (accessToken) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.roomService.createRoom(accessToken, {
                    room_version: '5',
                    invite: members,
                    preset: 'public_chat',
                    is_direct: true
                });
                return response.room_id;
            }));
        });
    }
    /**
     * Invite user to rooms
     *
     * @param user The user to be invited
     * @param roomsOrIds The rooms the user will be invited to
     */
    inviteToRooms(user, ...roomsOrIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isConnected();
            yield this.requiresAuthorization('invite', (accessToken) => Promise.all(roomsOrIds.map((roomOrId) => {
                const room = this.store.getRoom(roomOrId);
                this.roomService
                    .inviteToRoom(accessToken, user, room)
                    .catch((error) => logger.warn('inviteToRooms', error));
            })));
        });
    }
    /**
     * Join rooms
     *
     * @param roomsOrIds
     */
    joinRooms(...roomsOrIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isConnected();
            yield this.requiresAuthorization('join', (accessToken) => Promise.all(roomsOrIds.map((roomOrId) => {
                const room = this.store.getRoom(roomOrId);
                return this.roomService.joinRoom(accessToken, room);
            })));
        });
    }
    /**
     * Send a text message
     *
     * @param roomOrId
     * @param message
     */
    sendTextMessage(roomId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isConnected();
            yield this.requiresAuthorization('send', (accessToken) => __awaiter(this, void 0, void 0, function* () {
                const txnId = yield this.createTxnId();
                return this.eventService.sendMessage(accessToken, roomId, {
                    msgtype: 'm.text',
                    body: message
                }, txnId);
            }));
        });
    }
    /**
     * Poll the server to get the latest data and get notified of changes
     *
     * @param interval
     * @param onSyncSuccess
     * @param onSyncError
     */
    poll(interval, onSyncSuccess, onSyncError) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = this.store;
            const sync = this.sync.bind(this);
            const pollSync = (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let syncingRetries = 0;
                try {
                    const response = yield sync();
                    onSyncSuccess(response);
                }
                catch (error) {
                    onSyncError(error);
                    syncingRetries = store.get('pollingRetries');
                    // console.warn('Could not sync:', error)
                    if (this.isActive) {
                        logger.log(`Retry syncing... ${syncingRetries} retries so far`);
                    }
                }
                finally {
                    if (this.isActive) {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield pollSync(resolve, reject);
                        }), syncingRetries > IMMEDIATE_POLLING_RETRIES ? RETRY_INTERVAL + interval : interval);
                    }
                    else {
                        reject(new Error(`Syncing stopped manually.`));
                    }
                }
            });
            return new Promise(pollSync);
        });
    }
    /**
     * Get state from server
     */
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requiresAuthorization('sync', (accessToken) => __awaiter(this, void 0, void 0, function* () {
                return this.eventService.sync(accessToken, {
                    pollingTimeout: this.store.get('pollingTimeout'),
                    syncToken: this.store.get('syncToken')
                });
            }));
        });
    }
    /**
     * A helper method that makes sure an access token is provided
     *
     * @param name
     * @param action
     */
    requiresAuthorization(name, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedToken = this.store.get('accessToken');
            if (!storedToken) {
                return Promise.reject(`${name} requires authorization but no access token has been provided.`);
            }
            return action(storedToken);
        });
    }
    /**
     * Create a transaction ID
     */
    createTxnId() {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = new Date().getTime();
            const counter = this.store.get('txnNo');
            yield this.store.update({
                txnNo: counter + 1
            });
            return `m${timestamp}.${counter}`;
        });
    }
}
//# sourceMappingURL=MatrixClient.js.map