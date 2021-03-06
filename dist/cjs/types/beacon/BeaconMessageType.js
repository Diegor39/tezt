"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconMessageType = void 0;
var BeaconMessageType;
(function (BeaconMessageType) {
    BeaconMessageType["PermissionRequest"] = "permission_request";
    BeaconMessageType["SignPayloadRequest"] = "sign_payload_request";
    // EncryptPayloadRequest = 'encrypt_payload_request',
    BeaconMessageType["OperationRequest"] = "operation_request";
    BeaconMessageType["BroadcastRequest"] = "broadcast_request";
    BeaconMessageType["PermissionResponse"] = "permission_response";
    BeaconMessageType["SignPayloadResponse"] = "sign_payload_response";
    // EncryptPayloadResponse = 'encrypt_payload_response',
    BeaconMessageType["OperationResponse"] = "operation_response";
    BeaconMessageType["BroadcastResponse"] = "broadcast_response";
    BeaconMessageType["Acknowledge"] = "acknowledge";
    BeaconMessageType["Disconnect"] = "disconnect";
    BeaconMessageType["Error"] = "error";
})(BeaconMessageType = exports.BeaconMessageType || (exports.BeaconMessageType = {}));
//# sourceMappingURL=BeaconMessageType.js.map