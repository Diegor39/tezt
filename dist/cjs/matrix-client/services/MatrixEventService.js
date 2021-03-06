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
exports.MatrixEventService = void 0;
/**
 * A service to help with matrix event management
 */
var MatrixEventService = /** @class */ (function () {
    function MatrixEventService(httpClient) {
        this.httpClient = httpClient;
        this.cachedPromises = new Map();
    }
    /**
     * Get the latest state from the matrix node
     *
     * @param accessToken
     * @param options
     */
    MatrixEventService.prototype.sync = function (accessToken, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.withCache('sync', function () {
                        return _this.httpClient.get('/sync', {
                            timeout: options ? options.pollingTimeout : undefined,
                            since: options ? options.syncToken : undefined
                        }, { accessToken: accessToken });
                    })];
            });
        });
    };
    /**
     * Send a message to a room
     *
     * @param accessToken
     * @param room
     * @param content
     * @param txnId
     */
    MatrixEventService.prototype.sendMessage = function (accessToken, roomId, content, txnId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        return _this.scheduleEvent({
                            accessToken: accessToken,
                            roomId: roomId,
                            type: 'm.room.message',
                            content: content,
                            txnId: txnId,
                            onSuccess: resolve,
                            onError: reject
                        });
                    })];
            });
        });
    };
    /**
     * Schedules an event to be sent to the node
     *
     * @param event
     */
    MatrixEventService.prototype.scheduleEvent = function (event) {
        // TODO: actual scheduling
        this.sendEvent(event);
    };
    /**
     * Send an event to the matrix node
     *
     * @param scheduledEvent
     */
    MatrixEventService.prototype.sendEvent = function (scheduledEvent) {
        return __awaiter(this, void 0, void 0, function () {
            var roomId, type, txnId, content, accessToken, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomId = scheduledEvent.roomId, type = scheduledEvent.type, txnId = scheduledEvent.txnId, content = scheduledEvent.content, accessToken = scheduledEvent.accessToken;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpClient.put("/rooms/" + encodeURIComponent(roomId) + "/send/" + type + "/" + encodeURIComponent(txnId), content, { accessToken: accessToken })];
                    case 2:
                        response = _a.sent();
                        scheduledEvent.onSuccess(response);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        scheduledEvent.onError(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check the cache when interacting with the Matrix node, if there is an already ongoing call for the specified key, return its promise instead of duplicating the call.
     *
     * @param key
     * @param promiseProvider
     */
    MatrixEventService.prototype.withCache = function (key, promiseProvider) {
        var _this = this;
        var promise = this.cachedPromises.get(key);
        if (!promise) {
            promise = promiseProvider().finally(function () {
                _this.cachedPromises.delete(key);
            });
            this.cachedPromises.set(key, promise);
        }
        return promise;
    };
    return MatrixEventService;
}());
exports.MatrixEventService = MatrixEventService;
//# sourceMappingURL=MatrixEventService.js.map