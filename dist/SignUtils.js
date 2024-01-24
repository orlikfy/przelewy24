"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUtils = void 0;
var crypto = __importStar(require("crypto"));
var SignUtils = (function () {
    function SignUtils(data) {
        this.merchantId = data.merchantId;
        this.posId = data.posId;
        this.crc = data.crc;
    }
    SignUtils.prototype.getRegisterTransactionSign = function (data) {
        return crypto
            .createHash('sha384')
            .update("{\"sessionId\":\"".concat(data.sessionId, "\",\"merchantId\":").concat(this.merchantId, ",\"amount\":").concat(data.amount, ",\"currency\":\"").concat(data.currency, "\",\"crc\":\"").concat(this.crc, "\"}"))
            .digest('hex');
    };
    SignUtils.prototype.getTransactionNotificationSign = function (data) {
        return crypto
            .createHash('sha384')
            .update("{\"merchantId\":".concat(this.merchantId, ",\"posId\":").concat(this.posId, ",\"sessionId\":\"").concat(data.sessionId, "\",\"amount\":").concat(data.amount, ",\"originAmount\":").concat(data.originAmount, ",\"currency\":\"").concat(data.currency, "\",\"orderId\":").concat(data.orderId, ",\"methodId\":").concat(data.methodId, ",\"statement\":\"").concat(data.statement, "\",\"crc\":\"").concat(this.crc, "\"}"))
            .digest('hex');
    };
    SignUtils.prototype.getVerifySign = function (data) {
        return crypto
            .createHash('sha384')
            .update("{\"sessionId\":\"".concat(data.sessionId, "\",\"orderId\":").concat(data.orderId, ",\"amount\":").concat(data.amount, ",\"currency\":\"").concat(data.currency, "\",\"crc\":\"").concat(this.crc, "\"}"))
            .digest('hex');
    };
    SignUtils.prototype.getRefundNotificationSign = function (data) {
        return crypto
            .createHash('sha384')
            .update("{\"orderId\":".concat(data.orderId, ",\"sessionId\":\"").concat(data.sessionId, "\",\"refundsUuid\":\"").concat(data.refundsUuid, "\",\"merchantId\":").concat(this.merchantId, ",\"amount\":").concat(data.amount, ",\"currency\":\"").concat(data.currency, "\",\"status\":").concat(data.status, ",\"crc\":\"").concat(this.crc, "\"}"))
            .digest('hex');
    };
    return SignUtils;
}());
exports.SignUtils = SignUtils;
//# sourceMappingURL=SignUtils.js.map