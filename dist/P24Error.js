"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.P24Error = void 0;
var error_mapping_1 = require("./error-mapping");
var P24Error = (function (_super) {
    __extends(P24Error, _super);
    function P24Error(errorCode, errorMessage) {
        var _this = _super.call(this, errorMessage) || this;
        _this.errorCode = errorCode;
        _this.name = 'P24Error';
        return _this;
    }
    P24Error.fromResponse = function (errorCode, errorMessage, error) {
        var _a;
        var mappedMessage = error_mapping_1.P24ErrorCodeMapping[errorCode] || errorMessage;
        if (!mappedMessage) {
            console.warn("Unknown error code: ".concat(errorCode, ", not able to extract error message, just logging error."));
            console.error(((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error);
        }
        return new P24Error(errorCode, mappedMessage);
    };
    return P24Error;
}(Error));
exports.P24Error = P24Error;
//# sourceMappingURL=P24Error.js.map