import { VerifySignData } from './types/VerifySignData';
import { RefundNotificationSignData } from './types/RefundNotificationSignData';
import { TransactionNotificationSignData } from './types/TransactionNotificationSignData';
export declare class SignUtils {
    private merchantId;
    private posId;
    private crc;
    constructor(data: {
        merchantId: number;
        posId: number;
        crc: string;
    });
    getRegisterTransactionSign(data: {
        sessionId: string;
        amount: number;
        currency: string;
    }): string;
    getTransactionNotificationSign(data: TransactionNotificationSignData): string;
    getVerifySign(data: VerifySignData): string;
    getRefundNotificationSign(data: RefundNotificationSignData): string;
}
