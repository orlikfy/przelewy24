# P24 (Przelewy24) Node.js SDK

This Node.js SDK provides a convenient way to interact with Przelewy24 (P24) payment gateway in your Node.js applications.

## Installation

Install the package using npm:

```bash
npm install p24-node-sdk
```

## Usage

```
const { P24 } = require('p24-node-sdk');

// Initialize P24 instance
const p24 = new P24({
  prod: false,  // Set to true for production environment
  merchantId: YOUR_MERCHANT_ID,
  posId: YOUR_POS_ID,
  apiKey: YOUR_API_KEY,
  crc: YOUR_CRC_KEY,
  defaultValues: {
    currency: 'PLN',
    country: 'PL',
    language: 'pl',
  },
});

// Example: Register a transaction
const transactionData = await p24.registerTransaction({
  sessionId: 'unique_session_id',
  amount: 1000,
  description: 'Test transaction',
  email: 'test@example.com',
  urlReturn: 'https://yourdomain.com/return',
  urlStatus: 'https://yourdomain.com/status',
  currency: 'PLN',
});

console.log('Transaction token:', transactionData.token);

// Example: Verify transaction
const verifyData = {
  sessionId: 'unique_session_id',
  orderId: 123456,
  amount: 1000,
  currency: 'PLN',
};

const isTransactionVerified = await p24.verifyTransaction(verifyData);

if (isTransactionVerified) {
  console.log('Transaction verified successfully.');
} else {
  console.log('Transaction verification failed.');
}

// ... Other methods

```

## Documentation

For detailed documentation on the available methods and configurations, refer to the official Przelewy24 API documentation.

## License

This SDK is open-source and released under the MIT License.
