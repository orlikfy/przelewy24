import { VerifyTransactionConfig } from './types/VerifyTransactionConfig';
import { RefundConfig } from './types/RefundConfig';
import { RefundNotificationConfig } from './types/RefundNotificationConfig';
import { PaymentMethodsConfig } from './types/PaymentMethodsConfig';
import { PaymentMethodsResponse } from './types/PaymentMethodsResponse';
import { RegisterTransactionConfig } from './types/RegisterTransactionConfig';
import { RegisterTransactionResponse } from './types/RegisterTransactionResponse';
import { TransactionNotificationConfig } from './types/TransactionNotificationConfig';
import { RefundResponse } from './types/RefundResponse';
import { P24Config } from './types/P24Config';
import { RegisterMerchantConfig } from "./types/RegisterMerchantConfig";
import { RegisterMerchantResponse } from "./types/RegisterMerchantResponse";
import { DispatchTransactionConfig } from "./types/DispatchTransactionConfig";
import { DispatchTransactionResponse } from "./types/DispatchTransactionResponse";
import { GetDispatchTransactionInfoResponse } from "./types/GetDispatchTransactionInfoResponse";
import { GetMerchantBalanceResponse } from "./types/GetMerchantBalanceResponse";
import { GetRegisteredMerchantsResponse } from "./types/GetRegisteredMerchantsResponse";
import { RefundDispatchedConfig } from "./types/RefundDispatchedConfig";
import { RefundDispatchedResponse } from "./types/RefundDispatchedResponse";
import { GetSubMerchantCRCResponse } from "./types/GetSubMetchantCRCResponse";
import { GetSubMerchantApiKeyResponse } from "./types/GetSubMerchantApiKeyResponse";
export declare class P24 {
    private prod;
    private baseURL;
    private baseApiURL;
    private merchantId;
    private posId;
    private apiKey;
    private crc;
    private defaultValues;
    private axiosInstance;
    private signUtils;
    constructor(data: P24Config);
    testAccess(): Promise<void>;
    getPaymentMethods(data: PaymentMethodsConfig): Promise<PaymentMethodsResponse>;
    registerTransaction(data: RegisterTransactionConfig): Promise<RegisterTransactionResponse>;
    validateIP(ip: string): boolean;
    verifyTransactionNotification(data: TransactionNotificationConfig): boolean;
    verifyTransaction(data: VerifyTransactionConfig): Promise<boolean>;
    verifyNotificationAndTransaction(data: TransactionNotificationConfig & VerifyTransactionConfig): Promise<boolean>;
    refund(data: RefundConfig): Promise<RefundResponse[]>;
    verifyRefundNotification(data: RefundNotificationConfig): boolean;
    private createAxiosInstance;
    registerMerchant(data: RegisterMerchantConfig): Promise<RegisterMerchantResponse>;
    doesMerchantExist(pathParams: {
        identificationType: 'nip' | 'pesel';
        identificationNumber: string;
    }): Promise<string[]>;
    dispatchTransaction(data: DispatchTransactionConfig): Promise<DispatchTransactionResponse>;
    getDispatchTransactionInfo(pathParams: {
        orderId: number;
    }): Promise<GetDispatchTransactionInfoResponse>;
    getMerchantBalance(queryParams: {
        merchantId: number;
    }): Promise<GetMerchantBalanceResponse>;
    getRegisteredMerchants(queryParams: {
        merchantId?: number;
    }): Promise<GetRegisteredMerchantsResponse>;
    refundDispatchTransaction(data: RefundDispatchedConfig): Promise<RefundDispatchedResponse>;
    getSubMerchantCRC({ merchantId }: {
        merchantId: number;
    }): Promise<GetSubMerchantCRCResponse>;
    getSubMerchantApiKey({ merchantId }: {
        merchantId: number;
    }): Promise<GetSubMerchantApiKeyResponse>;
}
export interface RefundDispatchedRawResponseEntry {
    orderId: number;
    sessionId: string;
    amount: number;
    data: Array<{
        spId: number;
        spAmount: number;
    }>;
    description: string;
    status: boolean;
    message: string;
}
