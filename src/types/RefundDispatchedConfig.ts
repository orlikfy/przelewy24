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
  // naming of those entries are so weird, so I've decided to map it instead of expose them in lib interface
  // in case you want to change it, change it also in P24 class.
  merchantId: number;
  refundAmountInZLGroshes: number;
}
