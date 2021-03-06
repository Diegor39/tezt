"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageEvents = void 0;
var events_1 = require("./events");
var _1 = require(".");
exports.messageEvents = (_a = {},
    _a[_1.BeaconMessageType.PermissionRequest] = {
        sent: events_1.BeaconEvent.PERMISSION_REQUEST_SENT,
        success: events_1.BeaconEvent.PERMISSION_REQUEST_SUCCESS,
        error: events_1.BeaconEvent.PERMISSION_REQUEST_ERROR
    },
    _a[_1.BeaconMessageType.PermissionResponse] = {
        sent: events_1.BeaconEvent.UNKNOWN,
        success: events_1.BeaconEvent.UNKNOWN,
        error: events_1.BeaconEvent.UNKNOWN
    },
    _a[_1.BeaconMessageType.OperationRequest] = {
        sent: events_1.BeaconEvent.OPERATION_REQUEST_SENT,
        success: events_1.BeaconEvent.OPERATION_REQUEST_SUCCESS,
        error: events_1.BeaconEvent.OPERATION_REQUEST_ERROR
    },
    _a[_1.BeaconMessageType.OperationResponse] = {
        sent: events_1.BeaconEvent.UNKNOWN,
        success: events_1.BeaconEvent.UNKNOWN,
        error: events_1.BeaconEvent.UNKNOWN
    },
    _a[_1.BeaconMessageType.SignPayloadRequest] = {
        sent: events_1.BeaconEvent.SIGN_REQUEST_SENT,
        success: events_1.BeaconEvent.SIGN_REQUEST_SUCCESS,
        error: events_1.BeaconEvent.SIGN_REQUEST_ERROR
    },
    _a[_1.BeaconMessageType.SignPayloadResponse] = {
        sent: events_1.BeaconEvent.UNKNOWN,
        success: events_1.BeaconEvent.UNKNOWN,
        error: events_1.BeaconEvent.UNKNOWN
    },
    // TODO: ENCRYPTION
    // [BeaconMessageType.EncryptPayloadRequest]: {
    //   sent: BeaconEvent.ENCRYPT_REQUEST_SENT,
    //   success: BeaconEvent.ENCRYPT_REQUEST_SUCCESS,
    //   error: BeaconEvent.ENCRYPT_REQUEST_ERROR
    // },
    // [BeaconMessageType.EncryptPayloadResponse]: {
    //   sent: BeaconEvent.UNKNOWN,
    //   success: BeaconEvent.UNKNOWN,
    //   error: BeaconEvent.UNKNOWN
    // },
    _a[_1.BeaconMessageType.BroadcastRequest] = {
        sent: events_1.BeaconEvent.BROADCAST_REQUEST_SENT,
        success: events_1.BeaconEvent.BROADCAST_REQUEST_SUCCESS,
        error: events_1.BeaconEvent.BROADCAST_REQUEST_ERROR
    },
    _a[_1.BeaconMessageType.BroadcastResponse] = {
        sent: events_1.BeaconEvent.UNKNOWN,
        success: events_1.BeaconEvent.UNKNOWN,
        error: events_1.BeaconEvent.UNKNOWN
    },
    _a[_1.BeaconMessageType.Acknowledge] = {
        sent: events_1.BeaconEvent.UNKNOWN,
        success: events_1.BeaconEvent.UNKNOWN,
        error: events_1.BeaconEvent.UNKNOWN
    },
    _a[_1.BeaconMessageType.Disconnect] = {
        sent: events_1.BeaconEvent.UNKNOWN,
        success: events_1.BeaconEvent.UNKNOWN,
        error: events_1.BeaconEvent.UNKNOWN
    },
    _a[_1.BeaconMessageType.Error] = {
        sent: events_1.BeaconEvent.UNKNOWN,
        success: events_1.BeaconEvent.UNKNOWN,
        error: events_1.BeaconEvent.UNKNOWN
    },
    _a);
//# sourceMappingURL=beacon-message-events.js.map