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
exports.PermissionValidator = void 0;
var __1 = require("..");
var get_account_identifier_1 = require("../utils/get-account-identifier");
/**
 * @internalapi
 *
 * The PermissionValidator is used to check if permissions for a certain message type have been given
 */
var PermissionValidator = /** @class */ (function () {
    function PermissionValidator() {
    }
    /**
     * Check if permissions were given for a certain message type.
     *
     * PermissionRequest and BroadcastRequest will always return true.
     *
     * @param message Beacon Message
     */
    PermissionValidator.hasPermission = function (message, getOne, getAll) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accountIdentifier, permission, permissions, filteredPermissions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = message.type;
                        switch (_a) {
                            case __1.BeaconMessageType.PermissionRequest: return [3 /*break*/, 1];
                            case __1.BeaconMessageType.BroadcastRequest: return [3 /*break*/, 1];
                            case __1.BeaconMessageType.OperationRequest: return [3 /*break*/, 2];
                            case __1.BeaconMessageType.SignPayloadRequest: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1:
                        {
                            return [2 /*return*/, true];
                        }
                        _b.label = 2;
                    case 2: return [4 /*yield*/, get_account_identifier_1.getAccountIdentifier(message.sourceAddress, message.network)];
                    case 3:
                        accountIdentifier = _b.sent();
                        return [4 /*yield*/, getOne(accountIdentifier)];
                    case 4:
                        permission = _b.sent();
                        if (!permission) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, permission.scopes.includes(__1.PermissionScope.OPERATION_REQUEST)];
                    case 5: return [4 /*yield*/, getAll()];
                    case 6:
                        permissions = _b.sent();
                        filteredPermissions = permissions.filter(function (permission) { return permission.address === message.sourceAddress; });
                        if (filteredPermissions.length === 0) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, filteredPermissions.some(function (permission) {
                                return permission.scopes.includes(__1.PermissionScope.SIGN);
                            })];
                    case 7: throw new Error('Message not handled');
                }
            });
        });
    };
    return PermissionValidator;
}());
exports.PermissionValidator = PermissionValidator;
//# sourceMappingURL=PermissionValidator.js.map