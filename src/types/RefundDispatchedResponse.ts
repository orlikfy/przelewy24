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
  // naming of those entries are so weird, so I've decided to map it instead of expose them in lib interface
  // in case you want to change it, change it also in P24 class.
  merchantId: number;
  refundAmountInZLGroshes: number;
}
