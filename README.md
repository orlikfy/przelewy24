
# P24 (Przelewy24) Node.js SDK

This Node.js SDK provides a convenient way to interact with Przelewy24 (P24) payment gateway in your Node.js applications.

## Installation

Install the package using npm:

```bash
npm install @dimski/przelewy24
```

## Usage

### Initialize P24 instance

```javascript
const { P24 } = require('@dimski/przelewy24');
// or
import { P24 } from "@dimski/przelewy24";

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
```

### Test access to the Przelewy24 API

```javascript
try {
  await p24.testAccess();
  console.log('Connection to Przelewy24 API successful.');
} catch (error) {
  console.error('Connection to Przelewy24 API failed:', error.message);
}
```

### Get available payment methods

```javascript
// Specify the configuration for getting payment methods
const paymentMethodsConfig = {
  lang: 'pl',  // Language code ('en' for English, 'pl' for Polish, etc.)
  amount: 1000, // Optional: Amount for which payment methods are requested
  currency: 'PLN', // Optional: Currency code
};

// Get available payment methods
try {
  const paymentMethods = await p24.getPaymentMethods(paymentMethodsConfig);
  console.log('Available payment methods:', paymentMethods);
} catch (error) {
  console.error('Failed to retrieve payment methods:', error.message);
}
```

### Validate IP

```javascript
const exampleIP = '91.216.191.182';
const isValidIP = p24.validateIP(exampleIP);

if (isValidIP) {
  console.log(`IP ${exampleIP} is valid.`);
} else {
  console.error(`IP ${exampleIP} is not within the valid IP range.`);
}
```

### Register a transaction

```javascript
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
```

### Verify the transaction notification

```javascript
// Example transaction notification data
const notificationData = {
  sessionId: 'unique_session_id',
  amount: 1000,
  originAmount: 1000,
  currency: 'PLN',
  orderId: 123456,
  methodId: 1,
  statement: 'Payment for Order #123456',
  sign: 'generated_sign_from_przelewy24',
};

// Verify the transaction notification
const isNotificationValid = p24.verifyTransactionNotification(notificationData);

if (isNotificationValid) {
  console.log('Transaction notification is valid.');
} else {
  console.error('Transaction notification is not valid. Possible tampering detected.');
}
```

### Verify transaction

```javascript
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
```

### Verify the notification and transaction using one method

```javascript
// Example data for notification verification and transaction verification
const verificationData = {
  sessionId: 'unique_session_id',
  amount: 1000,
  originAmount: 1000,
  currency: 'PLN',
  orderId: 123456,
  methodId: 1,
  statement: 'Payment for Order #123456',
  sign: 'generated_sign_from_przelewy24',
  // Add additional properties required for transaction verification
  // ...
};

// Verify the notification and transaction
const isVerificationSuccessful = await p24.verifyNotificationAndTransaction(verificationData);

if (isVerificationSuccessful) {
  console.log('Notification and transaction verification successful.');
} else {
  console.error('Verification failed. Possible tampering or unsuccessful transaction.');
}
```

### Refund

```javascript
// Example data for initiating a refund
const refundData = {
  requestId: 'unique_request_id',
  refundsUuid: 'unique_refund_uuid',
  urlStatus: 'https://your-callback-url.com/refund-status',
  refunds: [
    {
      orderId: 123456,          // Order ID for the transaction to be refunded
      sessionId: 'unique_session_id',
      amount: 500,               // Amount to be refunded in grosz (e.g., 500 grosz = 5 PLN)
      description: 'Refund for Order #123456',
      // Add additional properties required for each refund
      // ...
    },
    // Add more refund objects if needed
    // ...
  ],
};

// Initiate the refund
try {
  const refundResponse = await p24.refund(refundData);
  console.log('Refund initiated successfully:', refundResponse);
} catch (error) {
  console.error('Refund failed:', error.message);
}
```

### Verify the refund notification

```javascript
// Example data for verifying a refund notification
const refundNotificationData = {
  orderId: 123456,               // Order ID for the refunded transaction
  sessionId: 'unique_session_id',
  requestId: 'unique_request_id',
  refundsUuid: 'unique_refund_uuid',
  amount: 500,                   // Amount refunded in grosz (e.g., 500 grosz = 5 PLN)
  currency: 'PLN',
  timestamp: 1634750000,         // Timestamp of the refund notification
  status: 1,                     // Status of the refund (1: Success, 2: Rejected)
  sign: 'valid_signature',       // Signature received with the refund notification
};

// Verify the refund notification
const isVerified = p24.verifyRefundNotification(refundNotificationData);

if (isVerified) {
  console.log('Refund notification is valid.');
} else {
  console.error('Refund notification verification failed.');
}
```

## Documentation

For detailed documentation on the available methods and configurations, refer to the official Przelewy24 API documentation.

## License

This SDK is open-source and released under the MIT License.
