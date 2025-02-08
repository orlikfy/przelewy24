import { P24 } from "./P24";

const testEmail = process.env.TEST_EMAIL || 'test@email.com';
describe("P24 test", () => {
  let p24: P24;

  beforeEach(async () => {
    const { merchantId, apiKey, crc } = validateEnvVariables();
    p24 = new P24({
      prod: false,
      merchantId,
      posId: undefined,
      apiKey,
      crc,
      defaultValues: {
        currency: 'PLN',
        country: 'PL',
      }
    })
  });

  it("Should connect to the API", async () => {
    await expect(p24.testAccess()).resolves.not.toThrow();
  });

  it("Should throw P24Error on API connection failure", async () => {
    p24 = new P24({
      prod: false,
      merchantId: 123,
      posId: undefined,
      apiKey: 'bad',
      crc: 'bad2',
      defaultValues: {
        currency: 'PLN',
        country: 'PL',
      }
    })

    await expect(p24.testAccess()).rejects.toThrow({
      name: 'P24Error',
      message: 'Incorrect authentication',
    });
  });

  it("Should validate IP address", () => {
    const validIP = '91.216.191.181';
    const invalidIP = '192.168.0.1';

    expect(p24.validateIP(validIP)).toBe(true);
    expect(p24.validateIP(invalidIP)).toBe(false);
  });


  it("Should get payment methods", async () => {
    const paymentMethods = await p24.getPaymentMethods({ lang: 'pl' });
    console.log('Received payment methods', JSON.stringify(paymentMethods.data.length, null, 2));
  });

  it("Should register a transaction and verify", async () => {
    const sessionId = Date.now().toString();
    const transactionData = await p24.registerTransaction({
      sessionId,
      amount: 1000,
      description: 'Test transaction',
      email: testEmail,
      urlReturn: 'https://yourdomain.com/return',
      urlStatus: 'https://yourdomain.com/status',
      currency: 'PLN',
      waitForResult: true

    });

    console.log(`Registered transaction with sessionId ${sessionId}`, JSON.stringify(transactionData, null, 2));
    console.log('Now you should be able to see it in sandbox: https://sandbox.przelewy24.pl/');

    expect(transactionData).toBeDefined();
    expect(transactionData.token).toBeDefined();
    expect(transactionData.redirectUrl).toContain(transactionData.token);

    const verifyData = {
      sessionId: '1739039761312',
      orderId: 123456,
      amount: 1000,
      currency: 'PLN',
    };
    const isTransactionVerified = await p24.verifyTransaction(verifyData);
    console.log('Transaction verified', isTransactionVerified);
  });

});

function validateEnvVariables() {
  const merchantId = process.env.P24_USER;
  const apiKey = process.env.P24_API_SECRET_ID;
  const crc = process.env.P24_CRC;

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
    apiKey,
    crc
  };
}
