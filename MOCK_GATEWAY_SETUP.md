# Mock HDFC Payment Gateway Setup

## Overview
A mock payment gateway has been created to simulate the HDFC SmartGateway payment flow for testing purposes.

## What Was Created

### 1. Mock Payment Gateway Component
**File**: `client/src/pages/MockPaymentGateway.jsx`

Features:
- Displays transaction details (ID, amount, customer info)
- Shows payment method options (Card, UPI, Net Banking, Wallet)
- Mock card input fields (visual only, not validated)
- Two action buttons:
  - **Simulate Success** - Returns success status to callback
  - **Simulate Failure** - Returns failure status to callback
- 2.5 second processing delay to simulate real gateway
- Professional UI matching payment gateway design

### 2. Route Added
**File**: `client/src/App.jsx`
- Added route: `/mock-gateway` (public route, no authentication required)
- Lazy-loaded component for performance

### 3. Environment Configuration Updated
**File**: `server/.env`
- Changed `HDFC_GATEWAY_URL` from:
  ```
  https://sandbox.hdfcbank.com/smartgateway
  ```
  To:
  ```
  http://localhost:5173/mock-gateway
  ```

## Setup Instructions

### Step 1: Re-seed Gateway Configuration
Run the following command to update the gateway URL in the database:

```bash
node server/seed_gateway.js
```

This will update the `GatewayConfig` collection with the new mock gateway URL.

### Step 2: Restart Server (if running)
If your server is currently running, restart it to pick up the new environment variable:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## How It Works

### Payment Flow
1. User initiates payment from the application
2. Server redirects to mock gateway with parameters:
   - `transactionId` - Unique transaction identifier
   - `amount` - Payment amount
   - `customerName`, `customerEmail`, `customerPhone` - Customer details
   - `callbackUrl` - URL to return to after payment
   - `merchantId` - Merchant identifier

3. Mock gateway displays payment interface
4. User clicks "Simulate Success" or "Simulate Failure"
5. Gateway redirects back to callback URL with:
   - `transactionId` - Original transaction ID
   - `status` - `success` or `failed`
   - `gatewayTransactionId` - Mock gateway transaction ID (format: `MOCK_<timestamp>_<random>`)
   - `signature` - Mock signature for testing
   - `amount` - Payment amount
   - `errorCode` & `errorMessage` - (only for failures)

### Callback URL Format
```
http://localhost:5173/payment/callback?transactionId=XXX&status=success&gatewayTransactionId=MOCK_XXX&signature=mock_sig_XXX&amount=XXX
```

## Testing the Payment Flow

### Test Success Payment
1. Navigate to a course enrollment page
2. Click "Proceed to Payment"
3. You'll be redirected to the mock gateway
4. Review the transaction details
5. Click "Simulate Success"
6. You'll be redirected back with success status

### Test Failed Payment
1. Follow steps 1-4 above
2. Click "Simulate Failure"
3. You'll be redirected back with failure status and error details

## Mock Gateway Features

### Payment Methods (Visual Only)
- Credit/Debit Card
- UPI
- Net Banking
- Wallet

### Card Details Form
When "Card" is selected, a form appears with:
- Card Number (formatted as XXXX XXXX XXXX XXXX)
- Cardholder Name
- Expiry Date (MM/YY format)
- CVV (masked)

**Note**: These fields are for visual purposes only and are not validated or stored.

### Mock Transaction IDs
Format: `MOCK_<timestamp>_<random_string>`
Example: `MOCK_1704123456789_A7B9C2D4E`

### Mock Signatures
Format: `mock_sig_<transactionId>_<status>`
Example: `mock_sig_TXN123456_success`

## Switching Back to Real Gateway

To switch back to the real HDFC sandbox gateway:

1. Update `server/.env`:
   ```
   HDFC_GATEWAY_URL=https://sandbox.hdfcbank.com/smartgateway
   ```

2. Re-seed the gateway configuration:
   ```bash
   node server/seed_gateway.js
   ```

3. Restart the server

## Benefits of Mock Gateway

1. **No External Dependencies** - Test without HDFC sandbox access
2. **Predictable Results** - Control success/failure outcomes
3. **Fast Testing** - No network latency or external service delays
4. **Offline Development** - Work without internet connection
5. **Visual Feedback** - See the payment flow from user perspective
6. **Error Simulation** - Test error handling easily

## Notes

- The mock gateway runs on the client side (React app)
- All payment processing is simulated - no real transactions occur
- The gateway URL must match the client URL (default: `http://localhost:5173`)
- If you change the client port, update `HDFC_GATEWAY_URL` accordingly
- The mock gateway is accessible without authentication for testing purposes
