import * as crypto from 'crypto';
import { VerifySignData } from './types/VerifySignData.js';
import { RefundNotificationSignData } from './types/RefundNotificationSignData.js';
import { TransactionNotificationSignData } from './types/TransactionNotificationSignData.js';


export class SignUtils {
  private merchantId: number;
  private posId: number;
  private crc: string;

  constructor(data: {merchantId: number, posId: number, crc: string}) {
    this.merchantId = data.merchantId;
    this.posId = data.posId;
    this.crc = data.crc;
  }

  getRegisterTransactionSign(data: {
    sessionId: string, 
    amount: number, 
    currency: string
  }) {
    return crypto
      .createHash('sha384')
      .update(`{"sessionId":"${data.sessionId}","merchantId":${this.merchantId},"amount":${data.amount},"currency":"${data.currency}","crc":"${this.crc}"}`)
      .digest('hex');
  }

  getTransactionNotificationSign(data: TransactionNotificationSignData) {
    return crypto
      .createHash('sha384')
      .update(`{"merchantId":${this.merchantId},"posId":${this.posId},"sessionId":"${data.sessionId}","amount":${data.amount},"originAmount":${data.originAmount},"currency":"${data.currency}","orderId":${data.orderId},"methodId":${data.methodId},"statement":"${data.statement}","crc":"${this.crc}"}`)
      .digest('hex');
  }

  getVerifySign(data: VerifySignData) {
    return crypto
      .createHash('sha384')
      .update(`{"sessionId":"${data.sessionId}","orderId":${data.orderId},"amount":${data.amount},"currency":"${data.currency}","crc":"${this.crc}"}`)
      .digest('hex');
  }

  getRefundNotificationSign(data: RefundNotificationSignData) {
    return crypto
      .createHash('sha384')
      .update(`{"orderId":${data.orderId},"sessionId":"${data.sessionId}","refundsUuid":"${data.refundsUuid}","merchantId":${this.merchantId},"amount":${data.amount},
      "currency":"${data.currency}","status":${data.status},"crc":"${this.crc}"}`)
      .digest('hex');
  }
}
