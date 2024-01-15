import * as crypto from 'crypto';
export class SignUtils {
    constructor(data) {
        this.merchantId = data.merchantId;
        this.posId = data.posId;
        this.crc = data.crc;
    }
    getRegisterTransactionSign(data) {
        return crypto
            .createHash('sha384')
            .update(`{"sessionId":"${data.sessionId}","merchantId":${this.merchantId},"amount":${data.amount},"currency":"${data.currency}","crc":"${this.crc}"}`)
            .digest('hex');
    }
    getTransactionNotificationSign(data) {
        return crypto
            .createHash('sha384')
            .update(`{"merchantId":${this.merchantId},"posId":${this.posId},"sessionId":"${data.sessionId}","amount":${data.amount},"originAmount":${data.originAmount},"currency":"${data.currency}","orderId":${data.orderId},"methodId":${data.methodId},"statement":"${data.statement}","crc":"${this.crc}"}`)
            .digest('hex');
    }
    getVerifySign(data) {
        return crypto
            .createHash('sha384')
            .update(`{"sessionId":"${data.sessionId}","orderId":${data.orderId},"amount":${data.amount},"currency":"${data.currency}","crc":"${this.crc}"}`)
            .digest('hex');
    }
    getRefundNotificationSign(data) {
        return crypto
            .createHash('sha384')
            .update(`{"orderId":${data.orderId},"sessionId":"${data.sessionId}","refundsUuid":"${data.refundsUuid}","merchantId":${this.merchantId},"amount":${data.amount},
      "currency":"${data.currency}","status":${data.status},"crc":"${this.crc}"}`)
            .digest('hex');
    }
}
//# sourceMappingURL=SignUtils.js.map