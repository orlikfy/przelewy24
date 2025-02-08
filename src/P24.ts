import axios, { AxiosInstance } from 'axios';
import { CONFIG_DEFAULT_VALUES } from './constants/CONFIG_DEFAULT_VALUES';
import { PRZELEWY24_IP_LIST } from './constants/PRZELEWY24_IP_LIST';
import { SignUtils } from './SignUtils';
import { VerifyTransactionConfig } from './types/VerifyTransactionConfig';
import { RefundConfig } from './types/RefundConfig';
import { RefundNotificationConfig } from './types/RefundNotificationConfig';
import { PaymentMethodsConfig } from './types/PaymentMethodsConfig';
import { PaymentMethodsResponse } from './types/PaymentMethodsResponse';
import { RegisterTransactionConfig } from './types/RegisterTransactionConfig';
import { RegisterTransactionResponse } from './types/RegisterTransactionResponse';
import { TransactionNotificationConfig } from './types/TransactionNotificationConfig';
import { RefundResponse } from './types/RefundResponse';
import { P24ConfigDefaultValues } from './types/P24ConfigDefaultValues';
import { P24Config } from './types/P24Config';
import { P24Error } from './P24Error';
import { RegisterMerchantConfig } from "./types/RegisterMerchantConfig";
import { RegisterMerchantResponse } from "./types/RegisterMerchantResponse";
import { DispatchTransactionConfig } from "./types/DispatchTransactionConfig";
import { DispatchTransactionResponse } from "./types/DispatchTransactionResponse";
import { GetDispatchTransactionInfoResponse } from "./types/GetDispatchTransactionInfoResponse";
import { GetMerchantBalanceResponse } from "./types/GetMerchantBalanceResponse";
import { GetRegisteredMerchantsResponse } from "./types/GetRegisteredMerchantsResponse";
import { RefundDispatchedConfig } from "./types/RefundDispatchedConfig";
import { RefundDispatchedData, RefundDispatchedResponse } from "./types/RefundDispatchedResponse";
import { GetSubMerchantCRCResponse } from "./types/GetSubMetchantCRCResponse";
import { GetSubMerchantApiKeyResponse } from "./types/GetSubMerchantApiKeyResponse";

const PROD_BASE_URL = 'https://secure.przelewy24.pl';
const PROD_API_BASE_URL = PROD_BASE_URL + '/api/v1';
const DEV_BASE_URL = 'https://sandbox.przelewy24.pl';
const DEV_API_BASE_URL = DEV_BASE_URL + '/api/v1';

export class P24 {
  private prod: boolean;
  private baseURL: string;
  private baseApiURL: string;
  private merchantId: number;
  private posId: number;
  private apiKey: string;
  private crc: string;
  private defaultValues: P24ConfigDefaultValues;
  private axiosInstance!: AxiosInstance;
  private signUtils: SignUtils;

  /**
   * Creates an instance of the P24 class, which provides functionality for interacting with the Przelewy24 payment gateway.
   *
   * @class
   * @name P24
   *
   * @param {P24Config} data - Configuration data for initializing the P24 instance.
   * @param {boolean} data.prod - Indicates whether to use the production or sandbox environment.
   * @param {number} data.merchantId - The merchant ID assigned by Przelewy24.
   * @param {number} [data.posId] - The point of sale (POS) ID assigned by Przelewy24. Defaults to the merchant ID if not provided.
   * @param {string} data.apiKey - The API key provided by Przelewy24 for authentication.
   * @param {string} data.crc - The CRC key provided by Przelewy24 for generating checksums.
   * @param {P24ConfigDefaultValues} data.defaultValues - Default values for transaction parameters.
   *
   * @throws {Error} Throws an error if the required configuration data is missing.
   *
   * @example
   * const p24 = new P24({
   *   prod: true,
   *   merchantId: YOUR_MERCHANT_ID,
   *   apiKey: 'YOUR_API_KEY',
   *   crc: 'YOUR_CRC_KEY',
   *   defaultValues: {
   *     currency: 'PLN',
   *     country: 'PL',
   *     language: 'pl',
   *   },
   * });
   */
  constructor(data: P24Config) {
    this.prod = data.prod;
    this.baseURL = data.prod ? PROD_BASE_URL : DEV_BASE_URL;
    this.baseApiURL = data.prod ? PROD_API_BASE_URL : DEV_API_BASE_URL;
    this.merchantId = data.merchantId;
    this.posId = data.posId ? data.posId : data.merchantId;
    this.apiKey = data.apiKey;
    this.crc = data.crc;
    this.defaultValues = {
      ...CONFIG_DEFAULT_VALUES,
      ...data.defaultValues,
    };
    this.createAxiosInstance();
    this.signUtils = new SignUtils({
      merchantId: this.merchantId,
      posId: this.posId,
      crc: this.crc,
    });
  }

  async testAccess(): Promise<void> {
    try {
      const res = await this.axiosInstance.get('/testAccess');
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error || error.response.data.error);
      }
      throw error;
    }
  }

  async getPaymentMethods(data: PaymentMethodsConfig): Promise<PaymentMethodsResponse> {
    try {
      const { lang, ...params } = data;
      const res = await this.axiosInstance.get(`/payment/methods/${lang}`, { params });
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async registerTransaction(data: RegisterTransactionConfig): Promise<RegisterTransactionResponse> {
    try {
      const req = {
        ...data,
        merchantId: this.merchantId,
        posId: this.posId,
        sign: '',
      };

      if (!req.country && this.defaultValues.country) req.country = this.defaultValues.country;
      if (!req.language && this.defaultValues.language) req.language = this.defaultValues.language;
      if (!req.waitForResult && req.waitForResult !== false && typeof this.defaultValues.waitForResult === 'boolean') req.waitForResult = this.defaultValues.waitForResult;
      if (!req.regulationAccept && req.regulationAccept !== false && typeof this.defaultValues.regulationAccept === 'boolean') req.regulationAccept = this.defaultValues.regulationAccept;

      req.sign = this.signUtils.getRegisterTransactionSign({
        sessionId: req.sessionId,
        amount: req.amount,
        currency: req.currency,
      });

      const res = await this.axiosInstance.post('/transaction/register', req);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      const resData = res.data;
      const token = resData.data.token;

      return {
        token,
        redirectUrl: `${this.baseURL}/trnRequest/${token}`,
      };
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  validateIP(ip: string): boolean {
    return PRZELEWY24_IP_LIST.includes(ip);
  }

  verifyTransactionNotification(data: TransactionNotificationConfig): boolean {
    const notificationData = { ...data };
    const sign = this.signUtils.getTransactionNotificationSign(notificationData);
    return sign === data.sign;
  }

  async verifyTransaction(data: VerifyTransactionConfig): Promise<boolean> {
    try {
      const verifyData = { ...data };
      const req = {
        ...verifyData,
        merchantId: this.merchantId,
        posId: this.posId,
        sign: this.signUtils.getVerifySign(verifyData),
      };

      const res = await this.axiosInstance.put('/transaction/verify', req);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      const status = res.data?.data?.status;
      return status === 'success';
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async verifyNotificationAndTransaction(data: TransactionNotificationConfig & VerifyTransactionConfig): Promise<boolean> {
    const isValid = this.verifyTransactionNotification({
      sessionId: data.sessionId,
      amount: data.amount,
      originAmount: data.originAmount,
      currency: data.currency,
      methodId: data.methodId,
      orderId: data.orderId,
      statement: data.statement,
      sign: data.sign,
    });

    if (!isValid) return false;
    return await this.verifyTransaction({
      sessionId: data.sessionId,
      amount: data.amount,
      currency: data.currency,
      orderId: data.orderId,
    });
  }

  async refund(data: RefundConfig): Promise<RefundResponse[]> {
    try {
      const res = await this.axiosInstance.post('/transaction/refund', data);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  verifyRefundNotification(data: RefundNotificationConfig) {
    const notificationData = { ...data };
    const sign = this.signUtils.getRefundNotificationSign(notificationData);
    return sign === data.sign;
  }

  private createAxiosInstance() {
    this.axiosInstance = axios.create({
      baseURL: this.baseApiURL,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: this.posId.toString(),
        password: this.apiKey,
      },
    });
  }

  async registerMerchant(data: RegisterMerchantConfig): Promise<RegisterMerchantResponse> {
    try {
      const res = await this.axiosInstance.post('/merchant/register', data);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(JSON.stringify(error.response.data, null, 2));
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async doesMerchantExist(pathParams: {
    identificationType: 'nip' | 'pesel',
    identificationNumber: string
  }): Promise<string[]> {
    try {
      const res = await this.axiosInstance.get(`/merchant/exists/${pathParams.identificationType}/${pathParams.identificationNumber}`);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async dispatchTransaction(data: DispatchTransactionConfig): Promise<DispatchTransactionResponse> {
    try {
      const res = await this.axiosInstance.post('/multiStore/dispatchTransaction', data);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async getDispatchTransactionInfo(pathParams: { orderId: number }): Promise<GetDispatchTransactionInfoResponse> {
    try {
      const res = await this.axiosInstance.get(`/multiStore/dispatchInfo/${pathParams.orderId}`);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async getMerchantBalance(queryParams: { merchantId: number }): Promise<GetMerchantBalanceResponse> {
    try {
      const res = await this.axiosInstance.get(`/multiStore/funds?merchantId=${queryParams.merchantId}`);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async getRegisteredMerchants(queryParams: { merchantId?: number }): Promise<GetRegisteredMerchantsResponse> {
    try {
      const affiliateQuery = queryParams.merchantId ? `merchantId=${queryParams.merchantId}` : '';
      const res = await this.axiosInstance.get(`/multiStore/affiliates?${affiliateQuery}`);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async refundDispatchTransaction(data: RefundDispatchedConfig): Promise<RefundDispatchedResponse> {
    try {
      const res = await this.axiosInstance.post('/multiStore/refund', {
        ...data,
        refunds: data.refunds.map(refund => ({
          ...refund,
          data: refund.data.map(data => ({
            // naming of those entries are so weird, so I've decided to map it instead of expose them in lib interface
            spId: data.merchantId,
            spAmount: data.refundAmountInZLGroshes,
          })),
        })),
      });
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      const rawData: RefundDispatchedRawResponseEntry[] = res.data.data;
      return rawData.map(entry => ({
        orderId: entry.orderId,
        sessionId: entry.sessionId,
        amount: entry.amount,
        data: entry.data.map(data => ({
          merchantId: data.spId,
          refundAmountInZLGroshes: data.spAmount,
        })),
        description: entry.description,
        status: entry.status,
        message: entry.message,
      }));
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async getSubMerchantCRC({ merchantId }: { merchantId: number }): Promise<GetSubMerchantCRCResponse> {
    try {
      const res = await this.axiosInstance.get(`/multiStore/${merchantId}/crc`);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }

  async getSubMerchantApiKey({ merchantId }: { merchantId: number }): Promise<GetSubMerchantApiKeyResponse> {
    try {
      const res = await this.axiosInstance.get(`/multiStore/${merchantId}/apiKey`);
      if (res.data.error) {
        throw P24Error.fromResponse(res.data.error.errorCode, res.data.error.errorMessage, res.data.error);
      }
      return res.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw P24Error.fromResponse(error.response.data.error.errorCode, error.response.data.error.errorMessage, error);
      }
      throw error;
    }
  }
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
