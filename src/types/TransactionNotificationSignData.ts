export interface TransactionNotificationSignData {
  sessionId: string, 
  amount: number, 
  originAmount: number,
  currency: string,
  orderId: number,
  methodId: number,
  statement: string,
}