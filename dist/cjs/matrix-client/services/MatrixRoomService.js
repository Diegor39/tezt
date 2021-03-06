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
exports.MatrixRoomService = void 0;
var MatrixRoom_1 = require("../models/MatrixRoom");
/**
 * A service to help with matrix room management
 */
var MatrixRoomService = /** @class */ (function () {
    function MatrixRoomService(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * Create a room
     *
     * @param accessToken
     * @param config
     */
    MatrixRoomService.prototype.createRoom = function (accessToken, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.httpClient.post('/createRoom', config, { accessToken: accessToken })];
            });
        });
    };
    /**
     * Invite a user to a room
     *
     * @param accessToken
     * @param user
     * @param room
     */
    MatrixRoomService.prototype.inviteToRoom = function (accessToken, user, room) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (room.status !== MatrixRoom_1.MatrixRoomStatus.JOINED && room.status !== MatrixRoom_1.MatrixRoomStatus.UNKNOWN) {
                    return [2 /*return*/, Promise.reject("User is not a member of room " + room.id + ".")];
                }
                return [2 /*return*/, this.httpClient.post("/rooms/" + encodeURIComponent(room.id) + "/invite", { user_id: user }, { accessToken: accessToken })];
            });
        });
    };
    /**
     * Join a specific room
     *
     * @param accessToken
     * @param room
     */
    MatrixRoomService.prototype.joinRoom = function (accessToken, room) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (room.status === MatrixRoom_1.MatrixRoomStatus.JOINED) {
                    return [2 /*return*/, Promise.resolve({ room_id: room.id })];
                }
                return [2 /*return*/, this.httpClient.post("/rooms/" + encodeURIComponent(room.id) + "/join", {}, { accessToken: accessToken })];
            });
        });
    };
    /**
     * Get all joined rooms
     *
     * @param accessToken
     */
    MatrixRoomService.prototype.getJoinedRooms = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.httpClient.get("/joined_rooms", undefined, { accessToken: accessToken })];
            });
        });
    };
    return MatrixRoomService;
}());
exports.MatrixRoomService = MatrixRoomService;
//# sourceMappingURL=MatrixRoomService.js.map