export interface RefundDispatchedConfig {
    requestId: string;
    refundsUuid: string;
    urlStatus: string;
    refunds: RefundDispatchedEntry[];
}
interface RefundDispatchedEntry {
    orderId: number;
    sessionId: string;
    amount: number;
    description: string;
    data: RefundData[];
}
interface RefundData {
    merchantId: number;
    refundAmountInZLGroshes: number;
}
export {};
