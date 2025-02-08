export type GetRegisteredMerchantsResponse = GetRegisteredMerchantResponseEntry[];
export interface GetRegisteredMerchantResponseEntry {
    id: number;
    name: string;
    nip: string;
    regon: string;
    customerStatus: string;
}
