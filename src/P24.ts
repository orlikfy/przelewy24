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

  constructor(data: P24Config) {
    this.prod = data.prod;
    this.baseURL = data.prod ? PROD_BASE_URL : DEV_BASE_URL
    this.baseApiURL = data.prod ? PROD_API_BASE_URL : DEV_API_BASE_URL

    this.merchantId = data.merchantId;
    this.posId = data.posId ? data.posId : data.merchantId;
    this.apiKey = data.apiKey;
    this.crc = data.crc;
    
    this.defaultValues = {
      ...CONFIG_DEFAULT_VALUES,
      ...data.defaultValues
    };

    this.createAxiosInstance();
    this.signUtils = new SignUtils({
      merchantId: this.merchantId, 
      posId: this.posId,
      crc: this.crc,
    });
  }

  async testAccess() {
    await this.axiosInstance.get('/testAccess');
  }

  async getPaymentMethods(data: PaymentMethodsConfig): Promise<PaymentMethodsResponse> {
    const { lang, ...params } = data;
    const res = await this.axiosInstance.get(`/payment/methods/${lang}`, {params});
    return res.data;
  }

  async registerTransaction(data: RegisterTransactionConfig): Promise<RegisterTransactionResponse> {
    const req = {
      ...data,
      merchantId: this.merchantId,
      posId: this.posId,
      sign: '',
    }

    if (!req.country && this.defaultValues.country) req.country = this.defaultValues.country;
    if (!req.language && this.defaultValues.language) req.language = this.defaultValues.language;
    if (!req.waitForResult && req.waitForResult !== false && typeof(this.defaultValues.waitForResult) === 'boolean') req.waitForResult = this.defaultValues.waitForResult;
    if (!req.regulationAccept && req.regulationAccept !== false && typeof(this.defaultValues.regulationAccept) === 'boolean') req.regulationAccept = this.defaultValues.regulationAccept;

    req.sign = this.signUtils.getRegisterTransactionSign({
      sessionId: req.sessionId,
      amount: req.amount,
      currency: req.currency,
    });
    
    const res = await this.axiosInstance.post('/transaction/register', req);
    const resData = res.data;
    const token = resData.data.token;

    return {
      token, redirectUrl: `${this.baseURL}/trnRequest/${token}`,
    }
  }

  validateIP(ip: string): boolean {
    return PRZELEWY24_IP_LIST.includes(ip);
  }

  verifyTransactionNotification(data: TransactionNotificationConfig): boolean {
    const notificationData = {...data};
    const sign = this.signUtils.getTransactionNotificationSign(notificationData);
    return sign === data.sign;
  }

  async verifyTransaction(data: VerifyTransactionConfig): Promise<boolean> {
    const verifyData = {...data};

    const req = {
      ...verifyData, 
      merchantId: this.merchantId,
      posId: this.posId,
      sign: this.signUtils.getVerifySign(verifyData)
    }

    const res = await this.axiosInstance.put('/transaction/verify', req);
    const status = res.data?.data?.status;
    return status === 'success';
  }

  async verifyNotificationAndTransaction(data: TransactionNotificationConfig & VerifyTransactionConfig): Promise<boolean> {
    const isValid = this.verifyTransactionNotification(data);
    if (!isValid) return false;
    return await this.verifyTransaction(data);
  }

  async refund(data: RefundConfig): Promise<RefundResponse[]> {
    const res = await this.axiosInstance.post('/transaction/refund', data);
    return res.data.data;
  }

  verifyRefundNotification(data: RefundNotificationConfig) {
    const notificationData = {...data};
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
}
