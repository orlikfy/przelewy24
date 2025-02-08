export type RefundDispatchedResponse = RefundDispatchedResponseEntry[];
export interface RefundDispatchedResponseEntry {
    orderId: number;
    sessionId: string;
    amount: number;
    data: RefundDispatchedData[];
    description: string;
    status: boolean;
    message: string;
}
export interface RefundDispatchedData {
    merchantId: number;
    refundAmountInZLGroshes: number;
}
