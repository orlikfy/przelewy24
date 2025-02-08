"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var P24_1 = require("./P24");
var testEmail = process.env.TEST_EMAIL || 'test@email.com';
describe("P24 test", function () {
    var p24;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, merchantId, apiKey, crc;
        return __generator(this, function (_b) {
            _a = validateEnvVariables(), merchantId = _a.merchantId, apiKey = _a.apiKey, crc = _a.crc;
            p24 = new P24_1.P24({
                prod: false,
                merchantId: merchantId,
                posId: undefined,
                apiKey: apiKey,
                crc: crc,
                defaultValues: {
                    currency: 'PLN',
                    country: 'PL',
                }
            });
            return [2];
        });
    }); });
    it("Should connect to the API", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, expect(p24.testAccess()).resolves.not.toThrow()];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it("Should throw P24Error on API connection failure", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p24 = new P24_1.P24({
                        prod: false,
                        merchantId: 123,
                        posId: undefined,
                        apiKey: 'bad',
                        crc: 'bad2',
                        defaultValues: {
                            currency: 'PLN',
                            country: 'PL',
                        }
                    });
                    return [4, expect(p24.testAccess()).rejects.toThrow({
                            name: 'P24Error',
                            message: 'Incorrect authentication',
                        })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it("Should validate IP address", function () {
        var validIP = '91.216.191.181';
        var invalidIP = '192.168.0.1';
        expect(p24.validateIP(validIP)).toBe(true);
        expect(p24.validateIP(invalidIP)).toBe(false);
    });
    it("Should get payment methods", function () { return __awaiter(void 0, void 0, void 0, function () {
        var paymentMethods;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, p24.getPaymentMethods({ lang: 'pl' })];
                case 1:
                    paymentMethods = _a.sent();
                    console.log('Received payment methods', JSON.stringify(paymentMethods.data.length, null, 2));
                    return [2];
            }
        });
    }); });
    it("Should register a transaction and verify", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionId, transactionData, verifyData, isTransactionVerified;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = Date.now().toString();
                    return [4, p24.registerTransaction({
                            sessionId: sessionId,
                            amount: 1000,
                            description: 'Test transaction',
                            email: testEmail,
                            urlReturn: 'https://yourdomain.com/return',
                            urlStatus: 'https://yourdomain.com/status',
                            currency: 'PLN',
                            waitForResult: true
                        })];
                case 1:
                    transactionData = _a.sent();
                    console.log("Registered transaction with sessionId ".concat(sessionId), JSON.stringify(transactionData, null, 2));
                    console.log('Now you should be able to see it in sandbox: https://sandbox.przelewy24.pl/');
                    expect(transactionData).toBeDefined();
                    expect(transactionData.token).toBeDefined();
                    expect(transactionData.redirectUrl).toContain(transactionData.token);
                    verifyData = {
                        sessionId: '1739039761312',
                        orderId: 123456,
                        amount: 1000,
                        currency: 'PLN',
                    };
                    return [4, p24.verifyTransaction(verifyData)];
                case 2:
                    isTransactionVerified = _a.sent();
                    console.log('Transaction verified', isTransactionVerified);
                    return [2];
            }
        });
    }); });
});
function validateEnvVariables() {
    var merchantId = process.env.P24_USER;
    var apiKey = process.env.P24_API_SECRET_ID;
    var crc = process.env.P24_CRC;
    if (!merchantId) {
        throw new Error("P24_MERCHANT_ID environment variable is required");
    }
    if (!apiKey) {
        throw new Error("P24_API_SECRET_ID environment variable is required");
    }
    if (!crc) {
        throw new Error("P24_CRC environment variable is required");
    }
    return {
        merchantId: parseInt(merchantId, 10),
        apiKey: apiKey,
        crc: crc
    };
}
//# sourceMappingURL=P24.spec.js.map