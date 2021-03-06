"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixMessage = exports.MatrixMessageType = void 0;
var events_1 = require("../utils/events");
var MatrixMessageType;
(function (MatrixMessageType) {
    MatrixMessageType["TEXT"] = "m.text";
})(MatrixMessageType = exports.MatrixMessageType || (exports.MatrixMessageType = {}));
var MatrixMessage = /** @class */ (function () {
    function MatrixMessage(type, sender, content, timestamp) {
        this.type = type;
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
    }
    /**
     * Construct a message from a message event
     *
     * @param event
     */
    MatrixMessage.from = function (event) {
        if (events_1.isTextMessageEvent(event)) {
            return new MatrixMessage(event.content.msgtype, event.sender, event.content.body, event.origin_server_ts);
        }
        // for now only text messages are supported
        return undefined;
    };
    return MatrixMessage;
}());
exports.MatrixMessage = MatrixMessage;
//# sourceMappingURL=MatrixMessage.js.map