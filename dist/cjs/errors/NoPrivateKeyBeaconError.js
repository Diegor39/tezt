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
exports.NoPrivateKeyBeaconError = void 0;
var __1 = require("..");
/**
 * @category Error
 */
var NoPrivateKeyBeaconError = /** @class */ (function (_super) {
    __extends(NoPrivateKeyBeaconError, _super);
    function NoPrivateKeyBeaconError() {
        var _this = _super.call(this, __1.BeaconErrorType.NO_PRIVATE_KEY_FOUND_ERROR, 'The account you are trying to interact with is not available. Please make sure to add the account to your wallet and try again.') || this;
        _this.name = 'NoPrivateKeyBeaconError';
        _this.title = 'Account Not Found';
        return _this;
    }
    return NoPrivateKeyBeaconError;
}(__1.BeaconError));
exports.NoPrivateKeyBeaconError = NoPrivateKeyBeaconError;
//# sourceMappingURL=NoPrivateKeyBeaconError.js.map