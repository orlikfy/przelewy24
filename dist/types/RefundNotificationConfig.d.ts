export interface RefundNotificationConfig {
    orderId: number;
    sessionId: string;
    requestId: string;
    refundsUuid: string;
    amount: number;
    currency: string;
    timestamp: number;
    status: number;
    sign: string;
}
