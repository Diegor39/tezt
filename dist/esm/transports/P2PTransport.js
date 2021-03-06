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
import { TransportStatus, Transport, TransportType, P2PCommunicationClient, Origin } from '..';
import { PeerManager } from '../managers/PeerManager';
const logger = new Logger('P2PTransport');
/**
 * @internalapi
 *
 *
 */
export class P2PTransport extends Transport {
    constructor(name, keyPair, storage, matrixNodes, storageKey, iconUrl, appUrl) {
        super(name, new P2PCommunicationClient(name, keyPair, 1, storage, matrixNodes, iconUrl, appUrl), new PeerManager(storage, storageKey));
        this.type = TransportType.P2P;
    }
    static isAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(true);
        });
    }
    connect() {
        const _super = Object.create(null, {
            connect: { get: () => super.connect }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isConnected !== TransportStatus.NOT_CONNECTED) {
                return;
            }
            logger.log('connect');
            this._isConnected = TransportStatus.CONNECTING;
            yield this.client.start();
            const knownPeers = yield this.getPeers();
            if (knownPeers.length > 0) {
                logger.log('connect', `connecting to ${knownPeers.length} peers`);
                const connectionPromises = knownPeers.map((peer) => __awaiter(this, void 0, void 0, function* () { return this.listen(peer.publicKey); }));
                Promise.all(connectionPromises).catch((error) => logger.error('connect', error));
            }
            yield this.startOpenChannelListener();
            return _super.connect.call(this);
        });
    }
    disconnect() {
        const _super = Object.create(null, {
            disconnect: { get: () => super.disconnect }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.stop();
            return _super.disconnect.call(this);
        });
    }
    startOpenChannelListener() {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
    getPairingRequestInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getPairingRequestInfo();
        });
    }
    listen(publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client
                .listenForEncryptedMessage(publicKey, (message) => {
                const connectionContext = {
                    origin: Origin.P2P,
                    id: publicKey
                };
                this.notifyListeners(message, connectionContext).catch((error) => {
                    throw error;
                });
            })
                .catch((error) => {
                throw error;
            });
        });
    }
}
//# sourceMappingURL=P2PTransport.js.map