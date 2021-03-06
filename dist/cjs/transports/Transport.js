"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transport = void 0;
var Logger_1 = require("../utils/Logger");
var __1 = require("..");
var logger = new Logger_1.Logger('Transport');
/**
 * @internalapi
 *
 *
 */
var Transport = /** @class */ (function () {
    function Transport(name, client, peerManager) {
        /**
         * The type of the transport
         */
        this.type = __1.TransportType.POST_MESSAGE;
        /**
         * The status of the transport
         */
        this._isConnected = __1.TransportStatus.NOT_CONNECTED;
        /**
         * The listeners that will be notified when new messages are coming in
         */
        this.listeners = [];
        this.name = name;
        this.client = client;
        this.peerManager = peerManager;
    }
    Object.defineProperty(Transport.prototype, "connectionStatus", {
        /**
         * Return the status of the connection
         */
        get: function () {
            return this._isConnected;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a promise that resolves to true if the transport is available, false if it is not
     */
    Transport.isAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(false)];
            });
        });
    };
    /**
     * Connect the transport
     */
    Transport.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.log('connect');
                this._isConnected = __1.TransportStatus.CONNECTED;
                return [2 /*return*/];
            });
        });
    };
    /**
     * Disconnect the transport
     */
    Transport.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.log('disconnect');
                this._isConnected = __1.TransportStatus.NOT_CONNECTED;
                return [2 /*return*/];
            });
        });
    };
    /**
     * Send a message through the transport
     *
     * @param message The message to send
     * @param recipient The recipient of the message
     */
    Transport.prototype.send = function (message, peer) {
        return __awaiter(this, void 0, void 0, function () {
            var knownPeers, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!peer) return [3 /*break*/, 1];
                        return [2 /*return*/, this.client.sendMessage(message, peer)];
                    case 1: return [4 /*yield*/, this.getPeers()
                        // A broadcast request has to be sent everywhere.
                    ];
                    case 2:
                        knownPeers = _a.sent();
                        promises = knownPeers.map(function (peerEl) { return _this.client.sendMessage(message, peerEl); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 3: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    /**
     * Add a listener to be called when a new message is received
     *
     * @param listener The listener that will be registered
     */
    Transport.prototype.addListener = function (listener) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.debug('addListener', listener);
                this.listeners.push(listener);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Remove a listener
     *
     * @param listener
     */
    Transport.prototype.removeListener = function (listener) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.log('removeListener');
                this.listeners = this.listeners.filter(function (element) { return element !== listener; });
                return [2 /*return*/];
            });
        });
    };
    Transport.prototype.getPeers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.peerManager.getPeers()]; // TODO: Fix type
            });
        });
    };
    Transport.prototype.addPeer = function (newPeer, _sendPairingResponse) {
        if (_sendPairingResponse === void 0) { _sendPairingResponse = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.log('addPeer', 'adding peer', newPeer);
                        return [4 /*yield*/, this.peerManager.addPeer(newPeer)]; // TODO: Fix type
                    case 1:
                        _a.sent(); // TODO: Fix type
                        return [4 /*yield*/, this.listen(newPeer.publicKey)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Transport.prototype.removePeer = function (peerToBeRemoved) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.log('removePeer', 'removing peer', peerToBeRemoved);
                        return [4 /*yield*/, this.peerManager.removePeer(peerToBeRemoved.publicKey)];
                    case 1:
                        _a.sent();
                        if (!this.client) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.client.unsubscribeFromEncryptedMessage(peerToBeRemoved.publicKey)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Transport.prototype.removeAllPeers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.log('removeAllPeers');
                        return [4 /*yield*/, this.peerManager.removeAllPeers()];
                    case 1:
                        _a.sent();
                        if (!this.client) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.client.unsubscribeFromEncryptedMessages()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Notify the listeners when a new message comes in
     *
     * @param message Message
     * @param connectionInfo Context info about the connection
     */
    Transport.prototype.notifyListeners = function (message, connectionInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.listeners.length === 0) {
                    logger.warn('notifyListeners', '0 listeners notified!', this);
                }
                else {
                    logger.log('notifyListeners', "Notifying " + this.listeners.length + " listeners", this);
                }
                this.listeners.forEach(function (listener) {
                    listener(message, connectionInfo);
                });
                return [2 /*return*/];
            });
        });
    };
    return Transport;
}());
exports.Transport = Transport;
//# sourceMappingURL=Transport.js.map