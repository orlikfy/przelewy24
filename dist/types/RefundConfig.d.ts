import { Refund } from "./Refund";
export interface RefundConfig {
    requestId: string;
    refundsUuid: string;
    urlStatus?: string;
    refunds: Refund[];
}
