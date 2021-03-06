"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMockWindowState = exports.windowRef = void 0;
var cbs = [function (_) { return undefined; }];
/**
 * A mock for postmessage if run in node.js environment
 */
var windowRef = {
    postMessage: function (message, _target) {
        console.log('GOT MOCK POST MESSAGE', message);
        cbs.forEach(function (callbackElement) {
            callbackElement({ data: message });
        });
    },
    addEventListener: function (_name, eventCallback) {
        cbs.push(eventCallback);
    },
    removeEventListener: function (_name, eventCallback) {
        cbs.splice(cbs.indexOf(function (element) { return element === eventCallback; }), 1);
    },
    location: {
        origin: '*'
    }
};
exports.windowRef = windowRef;
try {
    if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        exports.windowRef = windowRef = window;
    }
}
catch (windowError) {
    console.log("not defined: " + windowError);
}
var clearMockWindowState = function () {
    cbs.length = 0;
};
exports.clearMockWindowState = clearMockWindowState;
//# sourceMappingURL=MockWindow.js.map