export type GetRegisteredMerchantsResponse = GetRegisteredMerchantResponseEntry[];

export interface GetRegisteredMerchantsResponseEntry {
  id: number;
  name: string;
  nip: string;
  regon: string;
  customerStatus: string;
}
