export interface RegisterTransactionConfig {
    sessionId: string;
    amount: number;
    currency: string;
    description: string;
    email: string;
    client?: string;
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
    phone?: string;
    language?: string;
    method?: number;
    urlReturn: string;
    urlStatus?: string;
    timeLimit?: number;
    channel?: number;
    waitForResult?: boolean;
    regulationAccept?: boolean;
    shipping?: number;
    transferLabel?: string;
    encoding?: string;
    methodRefId?: string;
    cart?: {
        sellerId: string;
        sellerCategory: string;
        name?: string;
        description?: string;
        quantity?: number;
        price?: number;
        number?: string;
    }[];
    additional?: {
        shipping?: {
            type: 0 | 1 | 2 | 3;
            address: string;
            zip: string;
            city: string;
            country: string;
        };
    };
}
