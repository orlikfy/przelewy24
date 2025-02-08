export interface GetDispatchTransactionInfoResponse {
  amountLeft: number;
  dispatch: GetDispatchTransactionInfoResponseEntry[];
}

interface GetDispatchTransactionInfoResponseEntry {
  date: string;
  orderId: number;
  partner_id: number;
  items: any[];
  amount: number;
}


