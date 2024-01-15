export interface Refund {
  orderId: number,
  sessionId: string,
  amount: number,
  description?: string,
}
