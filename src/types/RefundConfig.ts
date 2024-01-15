import { Refund } from "./Refund.js";


export interface RefundConfig {
  requestId: string,
  refundsUuid: string,
  urlStatus?: string,
  refunds: Refund[],
}
