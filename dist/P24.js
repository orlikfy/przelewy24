import axios from 'axios';
import { CONFIG_DEFAULT_VALUES } from './constants/CONFIG_DEFAULT_VALUES.js';
import { PRZELEWY24_IP_LIST } from './constants/PRZELEWY24_IP_LIST.js';
import { SignUtils } from './SignUtils.js';
const PROD_BASE_URL = 'https://secure.przelewy24.pl';
const PROD_API_BASE_URL = PROD_BASE_URL + '/api/v1';
const DEV_BASE_URL = 'https://sandbox.przelewy24.pl';
const DEV_API_BASE_URL = DEV_BASE_URL + '/api/v1';
export class P24 {
    constructor(data) {
        this.prod = data.prod;
        this.baseURL = data.prod ? PROD_BASE_URL : DEV_BASE_URL;
        this.baseApiURL = data.prod ? PROD_API_BASE_URL : DEV_API_BASE_URL;
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
        await this.axiosInstance.get('/transaction/testAccess');
        return;
    }
    async getPaymentMethods(data) {
        const { lang, ...params } = data;
        const res = await this.axiosInstance.get(`/payment/methods/${lang}`, { params });
        return res.data;
    }
    async registerTransaction(data) {
        const req = {
            ...data,
            merchantId: this.merchantId,
            posId: this.posId,
            sign: '',
        };
        if (!req.country && this.defaultValues.country)
            req.country = this.defaultValues.country;
        if (!req.language && this.defaultValues.language)
            req.language = this.defaultValues.language;
        if (!req.waitForResult && req.waitForResult !== false && typeof (this.defaultValues.waitForResult) === 'boolean')
            req.waitForResult = this.defaultValues.waitForResult;
        if (!req.regulationAccept && req.regulationAccept !== false && typeof (this.defaultValues.regulationAccept) === 'boolean')
            req.regulationAccept = this.defaultValues.regulationAccept;
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
        };
    }
    validateIP(ip) {
        return PRZELEWY24_IP_LIST.includes(ip);
    }
    verifyTransactionNotification(data) {
        const notificationData = { ...data };
        const sign = this.signUtils.getTransactionNotificationSign(notificationData);
        return sign === data.sign;
    }
    async verifyTransaction(data) {
        var _a, _b;
        const verifyData = { ...data };
        const req = {
            ...verifyData, sign: this.signUtils.getVerifySign(verifyData)
        };
        const res = await this.axiosInstance.put('/transaction/verify', req);
        const status = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status;
        return status === 'success';
    }
    async verifyNotificationAndTransaction(data) {
        const isValid = this.verifyTransactionNotification(data);
        if (!isValid)
            return false;
        return await this.verifyTransaction(data);
    }
    async refund(data) {
        const res = await this.axiosInstance.post('/transaction/refund', data);
        return res.data.data;
    }
    verifyRefundNotification(data) {
        const notificationData = { ...data };
        const sign = this.signUtils.getRefundNotificationSign(notificationData);
        return sign === data.sign;
    }
    createAxiosInstance() {
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
//# sourceMappingURL=P24.js.map