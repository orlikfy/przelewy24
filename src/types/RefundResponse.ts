import { Refund } from "./Refund.js";

export interface RefundResponse extends Refund {
  status: boolean, 
  message: string,
}