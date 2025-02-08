export interface DispatchTransactionResponse {
    result: DispatchTransactionResponseEntry[];
}
export interface DispatchTransactionResponseEntry {
    orderId: number;
    orderIdNew: number;
    sessionId: string;
    sellerId: number;
    amount: number;
    status: boolean;
    error: string;
}
