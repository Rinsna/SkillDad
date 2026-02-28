# Implementation Plan: HDFC SmartGateway Payment Integration

## Overview

This implementation plan breaks down the HDFC Bank SmartGateway payment integration into discrete, incremental coding tasks. Each task builds on previous work, with checkpoints to ensure quality and correctness. The implementation follows a bottom-up approach: core services first, then business logic, then API endpoints, and finally frontend components.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Create directory structure for payment module
  - Install required npm packages (crypto, express-validator, express-rate-limit, rate-limit-redis, csurf, mongoose)
  - Set up environment variables in .env file
  - Create configuration service to load and validate environment variables
  - _Requirements: 5.4, 12.1, 12.2, 14.6_

- [x] 2. Implement core security services
  - [x] 2.1 Create EncryptionService class
    - Implement AES-256-GCM encryption method
    - Implement AES-256-GCM decryption method with authentication tag verification
    - _Requirements: 5.1, 14.1, 14.2_
  
  - [x] 2.2 Create SignatureService class
    - Implement HMAC-SHA256 signature generation with alphabetically sorted parameters
    - Implement signature verification with constant-time comparison
    - _Requirements: 5.2, 5.3_
  
  - [x] 2.3 Write unit tests for EncryptionService
    - Test encryption and decryption round-trip
    - Test authentication tag validation
    - Test error handling for invalid keys
    - _Requirements: 5.1, 18.4_
  
  - [x] 2.4 Write unit tests for SignatureService
    - Test signature generation consistency
    - Test signature verification with valid and invalid signatures
    - Test parameter sorting
    - _Requirements: 5.2, 5.3, 18.4_


- [x] 3. Implement data formatting and parsing services
  - [x] 3.1 Create DataFormatterService class
    - Implement formatPaymentRequest method to convert internal data to HDFC format
    - Implement field validation for required payment fields
    - Implement amount formatting with 2 decimal places and banker's rounding
    - Implement ISO 8601 timestamp formatting
    - _Requirements: 15.1, 15.2, 15.8, 17.3, 17.8_
  
  - [x] 3.2 Implement parsePaymentResponse method
    - Parse JSON, XML, and form-encoded response formats
    - Validate data types and ranges for all fields
    - Convert to internal Payment_Data object structure
    - Return descriptive errors for invalid fields
    - _Requirements: 15.3, 15.4, 15.7, 15.9_
  
  - [x] 3.3 Write unit tests for DataFormatterService
    - Test round-trip property: format → parse → format produces equivalent object
    - Test amount formatting edge cases (rounding, precision)
    - Test timestamp formatting
    - Test special character escaping
    - Test error handling for missing required fields
    - _Requirements: 15.6, 15.8, 15.9, 18.2_

- [x] 4. Create database models
  - [x] 4.1 Create Transaction model schema
    - Define schema with all required fields (transactionId, student, course, amounts, status, etc.)
    - Add indexes for performance (transactionId, student+createdAt, status+createdAt, gatewayTransactionId)
    - Add virtual field for formatted amount
    - Implement TTL index for session expiration
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_
  
  - [x] 4.2 Create GatewayConfig model schema
    - Define schema for merchant credentials and configuration
    - Add fields for payment method enablement
    - Add transaction limit fields
    - Add audit fields (lastModifiedBy, timestamps)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.10_
  
  - [x] 4.3 Create PaymentSession model schema
    - Define schema with sessionId, transactionId, student, course, amount
    - Add TTL index for automatic expiration after 15 minutes
    - _Requirements: 1.7, 1.8, 14.6_
  
  - [x] 4.4 Create Reconciliation model schema
    - Define schema for reconciliation records with summary and discrepancies
    - Add fields for amounts, transaction counts, and status
    - _Requirements: 10.1, 10.3, 10.4, 10.5, 10.6_

- [x] 5. Implement HDFC Gateway Service
  - [x] 5.1 Create HDFCGatewayService class with constructor
    - Initialize with merchant credentials from config
    - Inject EncryptionService and SignatureService dependencies
    - _Requirements: 5.4, 12.1_
  
  - [x] 5.2 Implement createPaymentRequest method
    - Format transaction data using DataFormatterService
    - Generate signature using SignatureService
    - Encrypt sensitive fields using EncryptionService
    - Build payment URL with query parameters
    - _Requirements: 1.2, 1.4, 1.5, 5.2, 5.5_
  
  - [x] 5.3 Implement verifyCallback method
    - Extract signature from callback data
    - Verify signature using SignatureService
    - Return boolean verification result
    - _Requirements: 3.2, 3.3, 5.3_
  
  - [x] 5.4 Implement verifyWebhook method
    - Extract signature from webhook data
    - Verify signature using SignatureService
    - Return boolean verification result
    - _Requirements: 4.2, 4.3, 5.3_
  
  - [x] 5.5 Implement queryTransactionStatus method
    - Call HDFC status API with transaction ID
    - Parse response using DataFormatterService
    - Return status object
    - _Requirements: 11.6, 11.7_
  
  - [x] 5.6 Implement initiateRefund method
    - Format refund request with transaction ID and amount
    - Generate signature
    - Call HDFC refund API
    - Parse and return refund response
    - _Requirements: 8.2, 8.4_
  
  - [x] 5.7 Write integration tests for HDFCGatewayService
    - Test createPaymentRequest with sandbox credentials
    - Test signature verification with known test data
    - Test queryTransactionStatus with test transaction
    - _Requirements: 18.1, 18.3_


- [x] 6. Checkpoint - Core services complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement payment session management
  - [x] 7.1 Create PaymentSessionManager class
    - Implement createSession method with secure session ID generation
    - Implement validateSession method with expiration check
    - Implement expireSession method
    - _Requirements: 1.1, 1.7, 1.8, 14.6_
  
  - [x] 7.2 Write unit tests for PaymentSessionManager
    - Test session creation with correct expiration time
    - Test session validation for active and expired sessions
    - Test secure session ID generation (uniqueness, randomness)
    - _Requirements: 1.7, 1.8_

- [x] 8. Implement receipt generation service
  - [x] 8.1 Create ReceiptGeneratorService class
    - Implement generateReceipt method to create PDF from transaction data
    - Format receipt with transaction details, student info, course info
    - Include GST breakdown and company details
    - Generate unique receipt number
    - Upload PDF to storage and return URL
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.8, 9.10_
  
  - [x] 8.2 Implement emailReceipt method
    - Generate receipt PDF
    - Attach to email
    - Send via email service
    - _Requirements: 9.7_
  
  - [x] 8.3 Write unit tests for ReceiptGeneratorService
    - Test receipt generation with complete transaction data
    - Test GST calculation
    - Test receipt number uniqueness
    - _Requirements: 9.1, 9.4, 9.10_

- [x] 9. Implement monitoring service
  - [x] 9.1 Create MonitoringService class
    - Implement trackPaymentAttempt method to log attempts and update metrics
    - Implement trackAPIResponseTime method
    - Implement getPaymentMetrics method to calculate success rate, avg processing time, failure distribution
    - Implement checkSystemHealth method to verify gateway connectivity and thresholds
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10_
  
  - [x] 9.2 Write unit tests for MonitoringService
    - Test metric calculation accuracy
    - Test alert triggering thresholds
    - Test health check logic
    - _Requirements: 16.4, 16.5_

- [x] 10. Implement reconciliation service
  - [x] 10.1 Create ReconciliationService class
    - Implement fetchSettlementReport method to call HDFC settlement API
    - Parse settlement data from CSV/JSON format
    - _Requirements: 10.2_
  
  - [x] 10.2 Implement reconcileTransactions method
    - Fetch local transactions for date range
    - Fetch settlement report from HDFC
    - Match transactions by transaction ID
    - Compare amounts and status
    - Flag discrepancies (missing_in_system, missing_in_gateway, amount_mismatch, status_mismatch)
    - Calculate summary totals
    - Create Reconciliation record in database
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.8_
  
  - [x] 10.3 Implement generateReconciliationReport method
    - Aggregate transaction data for date range
    - Calculate totals (payments received, refunds processed, net settlement)
    - Export to CSV and Excel formats
    - Return report URL
    - _Requirements: 10.6, 10.9_
  
  - [x] 10.4 Write unit tests for ReconciliationService
    - Test transaction matching logic
    - Test discrepancy detection for all types
    - Test summary calculation accuracy
    - _Requirements: 10.3, 10.4, 10.5_


- [x] 11. Implement security and audit logging
  - [x] 11.1 Create SecurityLogger class
    - Implement logPaymentAttempt method with transaction ID, user ID, IP, user agent
    - Implement logSignatureFailure method with security alert creation
    - Implement logRefundOperation method with audit trail
    - Implement maskSensitiveData method to mask card numbers and remove CVV/PIN
    - _Requirements: 5.8, 5.9, 14.5_
  
  - [x] 11.2 Create PCIComplianceService class
    - Implement validateCardDataNotStored method to prevent storing forbidden fields
    - Implement maskCardNumber method to show only last 4 digits
    - Implement enforceAccessControl method with role-based permissions
    - _Requirements: 14.1, 14.2, 14.4_
  
  - [x] 11.3 Write unit tests for security services
    - Test sensitive data masking
    - Test access control enforcement
    - Test PCI-DSS validation rules
    - _Requirements: 14.1, 14.2, 5.9_

- [x] 12. Implement Payment Controller
  - [x] 12.1 Create PaymentController class with initiatePayment method
    - Validate course ID and check for existing active enrollment
    - Validate and apply discount code if provided
    - Calculate final amount with discount and GST
    - Create Transaction record with status "pending"
    - Create PaymentSession using PaymentSessionManager
    - Generate payment request using HDFCGatewayService
    - Log payment attempt using SecurityLogger
    - Return payment URL and transaction details
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 17.1, 17.2, 17.3, 17.4, 17.5, 17.9_
  
  - [x] 12.2 Implement handleCallback method
    - Extract transaction ID and payment status from callback data
    - Verify signature using HDFCGatewayService
    - If signature invalid, reject callback and log security alert
    - Update Transaction record with payment status and callback data
    - If status is "success", activate course enrollment and generate receipt
    - If status is "failed", update with error details and categorize failure reason
    - Send confirmation or failure email to student
    - Track payment attempt in MonitoringService
    - Render confirmation page with transaction details
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 7.1, 7.2, 7.3, 7.8_
  
  - [x] 12.3 Implement handleWebhook method
    - Verify signature using HDFCGatewayService
    - If signature invalid, return HTTP 401 and log security violation
    - Extract transaction ID and payment status
    - Check if webhook already processed (idempotency)
    - Update Transaction record with webhook data
    - If status is "success" and enrollment not active, activate enrollment
    - Return HTTP 200 to acknowledge processing
    - If processing fails, return HTTP 500 and log error
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_
  
  - [x] 12.4 Implement checkPaymentStatus method
    - Validate transaction ID format
    - Query real-time status from HDFC using HDFCGatewayService
    - Update Transaction record with latest status
    - Return transaction details with current status
    - _Requirements: 11.6, 11.7_
  
  - [x] 12.5 Implement getPaymentHistory method
    - Fetch all transactions for authenticated student
    - Support pagination with page and limit parameters
    - Support filtering by status
    - Return transaction list with course details
    - _Requirements: 11.1, 11.2_
  
  - [x] 12.6 Implement processRefund method
    - Validate admin has refund permissions and 2FA
    - Validate transaction exists and status is "success"
    - Validate refund amount does not exceed original amount
    - Check transaction not already refunded
    - Send refund request using HDFCGatewayService
    - Update Transaction record with refund details
    - Deactivate course enrollment
    - Send refund confirmation email to student
    - Log refund operation using SecurityLogger
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.10, 17.10_
  
  - [x] 12.7 Implement retryPayment method
    - Validate transaction exists and status is "failed"
    - Check retry count is less than 3
    - Check retry is within 24 hours of original attempt
    - Create new Transaction record linked to original
    - Increment retry count
    - Create new PaymentSession
    - Return new payment URL
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 6.9_
  
  - [x] 12.8 Write unit tests for PaymentController
    - Test initiatePayment with valid and invalid inputs
    - Test discount code application
    - Test callback handling for success and failure scenarios
    - Test webhook idempotency
    - Test refund validation logic
    - Test retry limit enforcement
    - _Requirements: 1.1, 3.4, 4.8, 7.5, 8.10, 18.2, 18.3, 18.6_


- [x] 13. Checkpoint - Business logic complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement API routes and middleware
  - [x] 14.1 Create input validation rules
    - Define validation rules for initiatePayment (courseId, discountCode)
    - Define validation rules for checkStatus (transactionId format)
    - Define validation rules for processRefund (transactionId, amount, reason)
    - Define validation rules for reconciliation (startDate, endDate)
    - _Requirements: 5.7, 15.2_
  
  - [x] 14.2 Create rate limiting middleware
    - Configure rate limiter for payment initiation (5 requests/min per user)
    - Configure rate limiter for payment retry (3 requests/hour per transaction)
    - Configure rate limiter for admin refunds (10 requests/hour per admin)
    - Configure rate limiter for reconciliation (10 requests/day)
    - Use Redis store for distributed rate limiting
    - _Requirements: 5.6_
  
  - [x] 14.3 Create CSRF protection middleware
    - Configure CSRF token generation endpoint
    - Apply CSRF protection to payment initiation route
    - Configure secure cookie settings
    - _Requirements: 5.10_
  
  - [x] 14.4 Create payment routes
    - POST /api/payment/initiate - with CSRF and rate limiting
    - GET /api/payment/callback - no auth, signature verified
    - POST /api/payment/webhook - no auth, signature verified
    - GET /api/payment/status/:transactionId - with JWT auth
    - GET /api/payment/history - with JWT auth and pagination
    - GET /api/payment/receipt/:transactionId - with JWT auth
    - POST /api/payment/retry/:transactionId - with JWT auth and rate limiting
    - _Requirements: 1.1, 3.1, 4.1, 11.1, 11.4, 11.6, 7.3_
  
  - [x] 14.5 Create admin payment routes
    - POST /api/admin/payment/refund - with admin auth, 2FA, and rate limiting
    - GET /api/admin/payment/config - with admin auth
    - PUT /api/admin/payment/config - with admin auth
    - POST /api/admin/payment/test-connection - with admin auth
    - _Requirements: 8.1, 12.1, 12.2, 12.3, 12.9_
  
  - [x] 14.6 Create reconciliation routes
    - POST /api/admin/reconciliation/run - with finance role auth
    - GET /api/admin/reconciliation/:reconciliationId - with finance role auth
    - POST /api/admin/reconciliation/resolve - with finance role auth
    - _Requirements: 10.1, 10.3, 10.7_
  
  - [x] 14.7 Create monitoring routes
    - GET /api/admin/monitoring/metrics - with admin auth
    - GET /api/admin/monitoring/health - with admin auth
    - _Requirements: 16.1, 16.6_
  
  - [x] 14.8 Write integration tests for API routes
    - Test payment initiation flow end-to-end
    - Test callback handling with valid and invalid signatures
    - Test webhook processing
    - Test rate limiting enforcement
    - Test CSRF protection
    - Test authentication and authorization
    - _Requirements: 18.3, 18.5, 18.9_

- [x] 15. Implement admin configuration controller
  - [x] 15.1 Create AdminConfigController class
    - Implement getGatewayConfig method to fetch current configuration
    - Implement updateGatewayConfig method with validation and encryption
    - Implement testGatewayConnection method to verify HDFC connectivity
    - Log all configuration changes with admin user ID
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10_
  
  - [ ] 15.2 Write unit tests for AdminConfigController
    - Test configuration validation
    - Test credential encryption
    - Test gateway connectivity test
    - Test audit logging
    - _Requirements: 12.7, 12.8_

- [x] 16. Implement frontend payment UI components
  - [x] 16.1 Create PaymentInitiation component
    - Display course details and pricing
    - Input field for discount code with validation
    - Show price breakdown (original, discount, GST, final)
    - "Proceed to Payment" button that calls initiate API
    - Handle loading and error states
    - Redirect to HDFC gateway on success
    - _Requirements: 1.1, 1.3, 13.1, 13.8, 17.1_
  
  - [x] 16.2 Create PaymentCallback component
    - Parse callback URL parameters
    - Display loading spinner while processing
    - Show success message with transaction details on success
    - Show error message with retry option on failure
    - Display receipt download link
    - _Requirements: 3.8, 7.1, 7.4, 9.6_
  
  - [x] 16.3 Create PaymentHistory component
    - Display list of all student transactions
    - Show transaction ID, course, amount, status, date
    - Filter by status (all, success, failed, refunded)
    - Pagination controls
    - Click transaction to view details
    - Download receipt button for successful payments
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 16.4 Create PaymentStatus component
    - Display complete transaction details
    - Show payment timeline (initiated, processing, completed/failed)
    - "Check Status" button to query real-time status
    - Display refund status and expected date if refunded
    - Contact support link for failed transactions
    - _Requirements: 11.3, 11.5, 11.6, 11.8, 11.9, 11.10_


- [x] 17. Implement admin frontend components
  - [x] 17.1 Create AdminRefundPanel component
    - Display transaction details for refund
    - Input field for refund amount with validation
    - Input field for refund reason
    - 2FA code input
    - "Process Refund" button
    - Show refund status and confirmation
    - _Requirements: 8.1, 8.2, 8.3, 14.4_
  
  - [x] 17.2 Create GatewayConfigPanel component
    - Display current gateway configuration
    - Form to update merchant credentials (masked display)
    - Checkboxes to enable/disable payment methods
    - Input fields for transaction limits
    - Input field for session timeout
    - "Test Connection" button
    - "Save Configuration" button
    - Display last modified info
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.9_
  
  - [x] 17.3 Create ReconciliationDashboard component
    - Date range picker for reconciliation period
    - "Run Reconciliation" button
    - Display reconciliation summary (total, matched, unmatched transactions)
    - Display amount totals (total, settled, pending)
    - List of discrepancies with type and amounts
    - "Resolve" button for each discrepancy with notes input
    - "Export Report" button (CSV/Excel)
    - _Requirements: 10.1, 10.3, 10.4, 10.5, 10.6, 10.7, 10.9_
  
  - [x] 17.4 Create PaymentMonitoringDashboard component
    - Time range selector (24h, 7d, 30d)
    - Display key metrics (success rate, avg processing time, total amount)
    - Chart showing payment method distribution
    - Chart showing failure reasons distribution
    - Real-time transaction list
    - System health status indicators
    - Alert notifications
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.10_

- [x] 18. Implement email notifications
  - [x] 18.1 Create email templates
    - Payment success confirmation template with transaction details
    - Payment failure notification template with retry link
    - Refund confirmation template with expected date
    - Reconciliation summary template for finance team
    - _Requirements: 3.9, 7.7, 8.8, 10.10_
  
  - [x] 18.2 Create EmailService class
    - Implement sendPaymentConfirmation method
    - Implement sendPaymentFailure method
    - Implement sendRefundConfirmation method
    - Implement sendReconciliationSummary method
    - Attach receipt PDF to confirmation emails
    - _Requirements: 3.9, 7.7, 8.8, 9.7, 10.10_

- [x] 19. Implement error handling and edge cases
  - [x] 19.1 Add gateway timeout handling
    - Detect gateway timeout errors
    - Display maintenance message when gateway unavailable
    - Prevent payment initiation when gateway is down
    - _Requirements: 7.9_
  
  - [x] 19.2 Add session expiration handling
    - Check session expiration in callback
    - Update transaction status to "expired"
    - Display appropriate error message
    - Provide option to create new payment session
    - _Requirements: 1.7, 14.6_
  
  - [x] 19.3 Add concurrent payment handling
    - Implement database transaction locks for payment updates
    - Handle race conditions between callback and webhook
    - Ensure idempotent updates
    - _Requirements: 4.8, 6.8_
  
  - [x] 19.4 Add amount validation edge cases
    - Validate minimum transaction amount (INR 10)
    - Validate maximum transaction amount (INR 500,000)
    - Handle floating-point precision issues with Decimal128
    - Validate GST calculation accuracy
    - _Requirements: 17.4, 17.5, 17.6, 17.7, 17.9_

- [x] 20. Checkpoint - Integration complete
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 21. Implement scheduled jobs and automation
  - [ ] 21.1 Create daily reconciliation cron job
    - Schedule job to run daily at 2 AM
    - Fetch previous day's transactions
    - Run reconciliation automatically
    - Send summary email to finance team
    - _Requirements: 10.2, 10.10_
  
  - [x] 21.2 Create session cleanup job
    - Schedule job to run every hour
    - Find expired payment sessions
    - Update associated transactions to "expired" status
    - Clean up expired session records
    - _Requirements: 1.7_
  
  - [x] 21.3 Create monitoring alert job
    - Schedule job to run every 5 minutes
    - Check payment success rate threshold (< 90%)
    - Check gateway API response time threshold (> 5 seconds)
    - Send alerts to admin when thresholds breached
    - _Requirements: 16.4, 16.5_

- [ ] 22. Implement security scanning and compliance
  - [ ] 22.1 Add input sanitization to all endpoints
    - Sanitize all string inputs (trim, escape HTML)
    - Validate data types and ranges
    - Reject requests with unexpected fields
    - Test for SQL injection prevention
    - Test for XSS prevention
    - _Requirements: 5.7, 18.9_
  
  - [ ] 22.2 Implement PCI-DSS validation checks
    - Add validation to prevent storing card numbers
    - Add validation to prevent storing CVV/PIN
    - Ensure all card data collection uses HDFC hosted pages
    - Verify all payment data transmission uses HTTPS
    - _Requirements: 14.1, 14.2, 14.3, 14.5_
  
  - [ ] 22.3 Set up audit log retention
    - Configure audit logs to retain for 7 years minimum
    - Implement log rotation and archival
    - Ensure logs include all payment operations
    - _Requirements: 14.5_

- [ ] 23. Testing and quality assurance
  - [ ] 23.1 Write end-to-end tests for complete payment flows
    - Test successful payment flow from initiation to enrollment activation
    - Test failed payment flow with retry
    - Test refund flow from initiation to completion
    - Test webhook processing with various scenarios
    - _Requirements: 18.3_
  
  - [ ] 23.2 Write security tests
    - Test signature verification with tampered data
    - Test rate limiting enforcement
    - Test CSRF protection
    - Test unauthorized access attempts
    - Test injection attack prevention
    - _Requirements: 18.9_
  
  - [ ] 23.3 Write concurrency tests
    - Test simultaneous callback and webhook processing
    - Test multiple payment attempts for same course
    - Test concurrent refund requests
    - _Requirements: 18.7_
  
  - [ ] 23.4 Write performance tests
    - Test payment processing under load (100 concurrent requests)
    - Test database query performance with large transaction datasets
    - Test API response times meet requirements
    - _Requirements: 16.3_
  
  - [ ] 23.5 Verify code coverage
    - Run code coverage analysis
    - Ensure minimum 90% coverage for payment modules
    - Identify and test uncovered edge cases
    - _Requirements: 18.10_

- [ ] 24. Documentation and deployment preparation
  - [x] 24.1 Create API documentation
    - Document all payment API endpoints with request/response examples
    - Document webhook payload format
    - Document error codes and messages
    - Document rate limits and authentication requirements
  
  - [ ] 24.2 Create deployment guide
    - Document environment variable setup
    - Document HDFC gateway configuration steps
    - Document database migration steps
    - Document Redis setup for rate limiting
    - Document SSL certificate requirements
  
  - [ ] 24.3 Create operations runbook
    - Document payment failure troubleshooting steps
    - Document reconciliation discrepancy resolution process
    - Document refund processing procedures
    - Document monitoring and alerting setup
    - Document backup and disaster recovery procedures

- [ ] 25. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The implementation follows a bottom-up approach: core services → business logic → API layer → frontend
- Checkpoints ensure incremental validation and quality
- Security and compliance are integrated throughout the implementation, not added as an afterthought
- All sensitive data handling follows PCI-DSS requirements
- The system is designed for production use with proper error handling, monitoring, and audit trails

