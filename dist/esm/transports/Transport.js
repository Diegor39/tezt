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
import { TransportType, TransportStatus } from '..';
const logger = new Logger('Transport');
/**
 * @internalapi
 *
 *
 */
export class Transport {
    constructor(name, client, peerManager) {
        /**
         * The type of the transport
         */
        this.type = TransportType.POST_MESSAGE;
        /**
         * The status of the transport
         */
        this._isConnected = TransportStatus.NOT_CONNECTED;
        /**
         * The listeners that will be notified when new messages are coming in
         */
        this.listeners = [];
        this.name = name;
        this.client = client;
        this.peerManager = peerManager;
    }
    /**
     * Return the status of the connection
     */
    get connectionStatus() {
        return this._isConnected;
    }
    /**
     * Returns a promise that resolves to true if the transport is available, false if it is not
     */
    static isAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(false);
        });
    }
    /**
     * Connect the transport
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('connect');
            this._isConnected = TransportStatus.CONNECTED;
            return;
        });
    }
    /**
     * Disconnect the transport
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('disconnect');
            this._isConnected = TransportStatus.NOT_CONNECTED;
            return;
        });
    }
    /**
     * Send a message through the transport
     *
     * @param message The message to send
     * @param recipient The recipient of the message
     */
    send(message, peer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (peer) {
                return this.client.sendMessage(message, peer);
            }
            else {
                const knownPeers = yield this.getPeers();
                // A broadcast request has to be sent everywhere.
                const promises = knownPeers.map((peerEl) => this.client.sendMessage(message, peerEl));
                return (yield Promise.all(promises))[0];
            }
        });
    }
    /**
     * Add a listener to be called when a new message is received
     *
     * @param listener The listener that will be registered
     */
    addListener(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug('addListener', listener);
            this.listeners.push(listener);
            return;
        });
    }
    /**
     * Remove a listener
     *
     * @param listener
     */
    removeListener(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('removeListener');
            this.listeners = this.listeners.filter((element) => element !== listener);
            return;
        });
    }
    getPeers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.peerManager.getPeers(); // TODO: Fix type
        });
    }
    addPeer(newPeer, _sendPairingResponse = true) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('addPeer', 'adding peer', newPeer);
            yield this.peerManager.addPeer(newPeer); // TODO: Fix type
            yield this.listen(newPeer.publicKey);
        });
    }
    removePeer(peerToBeRemoved) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('removePeer', 'removing peer', peerToBeRemoved);
            yield this.peerManager.removePeer(peerToBeRemoved.publicKey);
            if (this.client) {
                yield this.client.unsubscribeFromEncryptedMessage(peerToBeRemoved.publicKey);
            }
        });
    }
    removeAllPeers() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('removeAllPeers');
            yield this.peerManager.removeAllPeers();
            if (this.client) {
                yield this.client.unsubscribeFromEncryptedMessages();
            }
        });
    }
    /**
     * Notify the listeners when a new message comes in
     *
     * @param message Message
     * @param connectionInfo Context info about the connection
     */
    notifyListeners(message, connectionInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.listeners.length === 0) {
                logger.warn('notifyListeners', '0 listeners notified!', this);
            }
            else {
                logger.log('notifyListeners', `Notifying ${this.listeners.length} listeners`, this);
            }
            this.listeners.forEach((listener) => {
                listener(message, connectionInfo);
            });
            return;
        });
    }
}
//# sourceMappingURL=Transport.js.map