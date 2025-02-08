export interface RefundNotificationSignData {
    orderId: number;
    sessionId: string;
    refundsUuid: string;
    amount: number;
    currency: string;
    status: number;
}
