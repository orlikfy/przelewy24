export interface DispatchTransactionConfig {
  batchId: number;
  details: DispatchTransactionConfigEntry[];
}

interface DispatchTransactionConfigEntry {
  orderId: number;
  sessionId: string;
  sellerId: number;
  amount: number;
}
