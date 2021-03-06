"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixClientEventEmitter = void 0;
var events_1 = require("events");
var utils_1 = require("../utils/utils");
var MatrixRoom_1 = require("./models/MatrixRoom");
var MatrixClientEvent_1 = require("./models/MatrixClientEvent");
var MatrixClientEventEmitter = /** @class */ (function (_super) {
    __extends(MatrixClientEventEmitter, _super);
    function MatrixClientEventEmitter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.eventEmitProviders = new Map([
            [MatrixClientEvent_1.MatrixClientEventType.INVITE, function () { return [_this.isInvite, _this.emitInvite.bind(_this)]; }],
            [MatrixClientEvent_1.MatrixClientEventType.MESSAGE, function () { return [_this.isMessage, _this.emitMessage.bind(_this)]; }]
        ]);
        return _this;
    }
    /**
     * This method is called every time the state is changed
     *
     * @param _oldState
     * @param _newState
     * @param stateChange
     */
    MatrixClientEventEmitter.prototype.onStateChanged = function (_oldState, _newState, stateChange) {
        for (var _i = 0, _a = utils_1.keys(MatrixClientEvent_1.MatrixClientEventType); _i < _a.length; _i++) {
            var event_1 = _a[_i];
            this.emitIfEvent(MatrixClientEvent_1.MatrixClientEventType[event_1], stateChange);
        }
    };
    /**
     * Emit the message if we have listeners registered for that type
     *
     * @param eventType
     * @param object
     */
    MatrixClientEventEmitter.prototype.emitIfEvent = function (eventType, object) {
        var provider = this.eventEmitProviders.get(eventType);
        if (provider) {
            var _a = provider(), predicate = _a[0], emitter = _a[1];
            if (predicate(object)) {
                emitter(eventType, object);
            }
        }
    };
    /**
     * Emit a client event
     *
     * @param eventType
     * @param content
     */
    MatrixClientEventEmitter.prototype.emitClientEvent = function (eventType, content, timestamp) {
        this.emit(eventType, {
            type: eventType,
            content: content,
            timestamp: timestamp
        });
    };
    /**
     * Check if event is an invite
     *
     * @param stateChange
     */
    MatrixClientEventEmitter.prototype.isInvite = function (stateChange) {
        return stateChange.rooms
            ? stateChange.rooms.some(function (room) { return room.status === MatrixRoom_1.MatrixRoomStatus.INVITED; })
            : false;
    };
    /**
     * Emit an invite
     *
     * @param eventType
     * @param stateChange
     */
    MatrixClientEventEmitter.prototype.emitInvite = function (eventType, stateChange) {
        var _this = this;
        stateChange.rooms
            .filter(function (room) { return room.status === MatrixRoom_1.MatrixRoomStatus.INVITED; })
            .map(function (room) { return [room.id, room.members]; })
            .forEach(function (_a) {
            var id = _a[0], members = _a[1];
            _this.emitClientEvent(eventType, {
                roomId: id,
                members: members
            });
        });
    };
    /**
     * Check if event is a message
     *
     * @param stateChange
     */
    MatrixClientEventEmitter.prototype.isMessage = function (stateChange) {
        return stateChange.rooms ? stateChange.rooms.some(function (room) { return room.messages.length > 0; }) : false;
    };
    /**
     * Emit an event to all rooms
     *
     * @param eventType
     * @param stateChange
     */
    MatrixClientEventEmitter.prototype.emitMessage = function (eventType, stateChange) {
        var _this = this;
        stateChange.rooms
            .filter(function (room) { return room.messages.length > 0; })
            .map(function (room) {
            return room.messages.map(function (message) {
                return [room.id, message, message.timestamp];
            });
        })
            .reduce(function (flatten, toFlatten) { return flatten.concat(toFlatten); }, [])
            .forEach(function (_a) {
            var roomId = _a[0], message = _a[1], timestamp = _a[2];
            _this.emitClientEvent(eventType, {
                roomId: roomId,
                message: message
            }, timestamp);
        });
    };
    return MatrixClientEventEmitter;
}(events_1.EventEmitter));
exports.MatrixClientEventEmitter = MatrixClientEventEmitter;
//# sourceMappingURL=MatrixClientEventEmitter.js.map