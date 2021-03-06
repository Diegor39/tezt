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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixHttpClient = void 0;
var axios_1 = __importDefault(require("axios"));
var utils_1 = require("../utils/utils");
var CLIENT_API_R0 = '/_matrix/client/r0';
/**
 * Handling the HTTP connection to the matrix synapse node
 */
var MatrixHttpClient = /** @class */ (function () {
    function MatrixHttpClient(baseUrl) {
        this.baseUrl = baseUrl;
        this.cancelTokenSource = axios_1.default.CancelToken.source();
    }
    /**
     * Get data from the synapse node
     *
     * @param endpoint
     * @param options
     */
    MatrixHttpClient.prototype.get = function (endpoint, params, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send('GET', endpoint, options, params)];
            });
        });
    };
    /**
     * Post data to the synapse node
     *
     * @param endpoint
     * @param body
     * @param options
     * @param params
     */
    MatrixHttpClient.prototype.post = function (endpoint, body, options, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send('POST', endpoint, options, params, body)];
            });
        });
    };
    /**
     * Put data to the synapse node
     *
     * @param endpoint
     * @param body
     * @param options
     * @param params
     */
    MatrixHttpClient.prototype.put = function (endpoint, body, options, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send('PUT', endpoint, options, params, body)];
            });
        });
    };
    MatrixHttpClient.prototype.cancelAllRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cancelTokenSource.cancel('Manually cancelled')];
            });
        });
    };
    /**
     * Send a request to the synapse node
     *
     * @param method
     * @param endpoint
     * @param config
     * @param requestParams
     * @param data
     */
    MatrixHttpClient.prototype.send = function (method, endpoint, config, requestParams, data) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, params, response, axiosError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = config ? this.getHeaders(config) : undefined;
                        params = requestParams ? this.getParams(requestParams) : undefined;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.request({
                                method: method,
                                url: endpoint,
                                baseURL: this.apiUrl(CLIENT_API_R0),
                                headers: headers,
                                data: data,
                                params: params,
                                cancelToken: this.cancelTokenSource.token
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        axiosError_1 = _a.sent();
                        throw axiosError_1.response.data;
                    case 4: return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Get the headers based on the options object
     *
     * @param options
     */
    MatrixHttpClient.prototype.getHeaders = function (options) {
        var headers = {};
        var entries = [];
        if (options.accessToken) {
            entries.push(['Authorization', "Bearer " + options.accessToken]);
        }
        if (entries.length === 0) {
            return undefined;
        }
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var _a = entries_1[_i], key = _a[0], value = _a[1];
            headers[key] = value;
        }
        return headers;
    };
    /**
     * Get parameters
     *
     * @param _params
     */
    MatrixHttpClient.prototype.getParams = function (_params) {
        if (!_params) {
            return undefined;
        }
        var params = Object.assign(_params, {});
        utils_1.keys(params).forEach(function (key) { return params[key] === undefined && delete params[key]; });
        return params;
    };
    /**
     * Construct API URL
     */
    MatrixHttpClient.prototype.apiUrl = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        var apiBase = this.baseUrl.endsWith('/')
            ? this.baseUrl.substr(0, this.baseUrl.length - 1)
            : this.baseUrl;
        var apiParts = parts.map(function (path) { return (path.startsWith('/') ? path.substr(1) : path); });
        return __spreadArrays([apiBase], apiParts).join('/');
    };
    return MatrixHttpClient;
}());
exports.MatrixHttpClient = MatrixHttpClient;
//# sourceMappingURL=MatrixHttpClient.js.map