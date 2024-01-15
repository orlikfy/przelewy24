export interface TransactionNotificationConfig {
  sessionId: string, 
  amount: number, 
  originAmount: number,
  currency: string,
  orderId: number,
  methodId: number,
  statement: string,
  sign: string,
}
