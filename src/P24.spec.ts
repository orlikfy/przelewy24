import { P24 } from "./P24";

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

  it("Should connect api", async () => {
    await p24.testAccess();
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
