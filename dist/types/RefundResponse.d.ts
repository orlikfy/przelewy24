import { Refund } from "./Refund";
export interface RefundResponse extends Refund {
    status: boolean;
    message: string;
}
