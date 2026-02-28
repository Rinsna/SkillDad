# Implementation Plan: Zoom Live Sessions Replacement

## Overview

Replace the existing Bunny.net RTMP/HLS live streaming infrastructure with Zoom's embedded meeting SDK. This implementation will migrate from video streaming to native Zoom meetings, updating the data model, API endpoints, and frontend components to use Zoom's SDK for meeting creation, joining, and recording management.

## Tasks

- [x] 1. Set up Zoom integration infrastructure
  - Install required dependencies: `@zoom/meetingsdk` for backend, `@zoom/meetingsdk` for frontend, ensure `jsonwebtoken` and `axios` are available
  - Add Zoom environment variables to `.env`: `ZOOM_API_KEY`, `ZOOM_API_SECRET`, `ZOOM_ACCOUNT_ID`, `ZOOM_SDK_KEY`, `ZOOM_SDK_SECRET`, `ZOOM_WEBHOOK_SECRET`
  - Create `server/utils/zoomUtils.js` with helper functions for API calls and signature generation
  - _Requirements: 1.1, 4.1, 9.1_

- [x] 2. Update database schema for Zoom integration
  - [x] 2.1 Modify LiveSession model to add zoom field
    - Add `zoom` field with nested structure: `meetingId`, `meetingNumber`, `passcode`, `joinUrl`, `startUrl`, `hostEmail`, `createdAt`
    - Update `recording` schema to support Zoom recordings: `recordingId`, `downloadUrl`, `playUrl`, `recordingType`, `durationMs`, `fileSizeBytes`, `status`, `createdAt`
    - Keep `bunny` field temporarily for backward compatibility during migration
    - Add database index on `zoom.meetingId` for fast lookups
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 10.5_
  
  - [ ] 2.2 Write property test for schema validation
    - **Property 30: Meeting Data Storage Structure**
    - **Validates: Requirements 9.3, 9.5**

- [x] 3. Implement Zoom meeting creation
  - [x] 3.1 Create `createZoomMeeting()` function in zoomUtils.js
    - Implement Zoom API call to create meeting with topic, start time, duration, and host email
    - Add retry logic with exponential backoff (3 attempts) for API failures
    - Return structured ZoomMeetingData object with all required fields
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 8.1_
  
  - [ ] 3.2 Write property tests for meeting creation
    - **Property 1: Session Creation with Complete Zoom Data**
    - **Validates: Requirements 1.1, 1.2, 1.5, 9.1, 9.2**
    - **Property 2: Input Validation Rejects Invalid Sessions**
    - **Validates: Requirements 1.5**
    - **Property 3: Retry Logic on API Failures**
    - **Validates: Requirements 1.3, 1.4, 8.1**

- [x] 4. Implement Zoom signature generation
  - [x] 4.1 Create `generateZoomSignature()` function in zoomUtils.js
    - Generate JWT signature using SDK key and secret
    - Set expiration to 2 hours from generation time
    - Include meeting number and role in payload
    - Implement Redis caching with key format `zoom:sig:{sessionId}:{userId}:{role}` and 1-hour TTL
    - _Requirements: 3.5, 4.1, 4.2, 4.3, 4.5, 10.2, 11.1_
  
  - [ ] 4.2 Write property tests for signature generation
    - **Property 11: Signature Validity Duration**
    - **Validates: Requirements 3.5, 4.2**
    - **Property 12: Signature Content Completeness**
    - **Validates: Requirements 4.3**
    - **Property 13: Signature Caching Consistency**
    - **Validates: Requirements 4.5, 10.2**
    - **Property 33: SDK Secret Never Exposed**
    - **Validates: Requirements 11.1**

- [x] 5. Update session creation controller
  - [x] 5.1 Modify `createSession()` in liveSessionController.js
    - Replace Bunny.net stream creation with `createZoomMeeting()` call
    - Store Zoom meeting data in `session.zoom` field instead of `session.bunny`
    - Validate input: non-empty topic, future start time, positive duration
    - Handle Zoom API errors: return 503 on failure, don't create database record
    - Keep existing student enrollment logic unchanged
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 7.1, 8.1, 9.1, 9.2_
  
  - [ ] 5.2 Write unit tests for session creation
    - Test successful creation with valid data
    - Test validation errors for invalid input
    - Test Zoom API failure handling and retry logic
    - Test student enrollment for course-based and university-wide sessions
    - _Requirements: 1.1, 1.2, 1.5, 2.1, 2.2_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement SDK configuration endpoint
  - [x] 7.1 Create `getZoomSDKConfig()` controller function
    - Fetch session and verify it has Zoom meeting data
    - Implement access control: verify user is instructor, university owner, or enrolled student
    - Determine role: 1 for instructor/university, 0 for students
    - Generate signature using `generateZoomSignature()`
    - Return SDK config object with all required fields: sdkKey, meetingNumber, passWord, signature, userName, userEmail, role, leaveUrl
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.2_
  
  - [x] 7.2 Add route `GET /api/sessions/:id/zoom-config` in session routes
    - Wire up the new controller function
    - Apply authentication middleware
    - _Requirements: 3.1_
  
  - [ ] 7.3 Write property tests for SDK config
    - **Property 7: SDK Config Access Control**
    - **Validates: Requirements 3.1, 3.2, 7.2**
    - **Property 8: Host Role Assignment**
    - **Validates: Requirements 3.3**
    - **Property 9: Participant Role Assignment**
    - **Validates: Requirements 3.4**
    - **Property 10: SDK Config Completeness**
    - **Validates: Requirements 3.6**

- [x] 8. Update session start and end controllers
  - [x] 8.1 Modify `startSession()` to work with Zoom
    - Keep existing status update logic (scheduled → live)
    - Keep existing notification logic
    - Remove any Bunny-specific stream start logic
    - _Requirements: 5.1, 5.2, 5.5_
  
  - [x] 8.2 Modify `endSession()` to trigger recording sync
    - Keep existing status update logic (live → ended)
    - Set endTime to current timestamp
    - Remove Bunny re-encode logic
    - Call `syncZoomRecordings()` in background (don't block response)
    - _Requirements: 5.3, 5.4, 5.5, 6.1_
  
  - [ ] 8.3 Write property tests for status transitions
    - **Property 14: Valid Status Transitions**
    - **Validates: Requirements 5.5**
    - **Property 15: Session Start Updates Status**
    - **Validates: Requirements 5.1, 5.2**
    - **Property 16: Session End Updates Status and Time**
    - **Validates: Requirements 5.3, 5.4**

- [x] 9. Implement Zoom recording retrieval
  - [x] 9.1 Create `getZoomRecordings()` function in zoomUtils.js
    - Call Zoom API to fetch cloud recordings by meeting ID
    - Parse recording data and return array of ZoomRecording objects
    - Handle cases where no recordings exist (return empty array)
    - _Requirements: 6.1, 6.2_
  
  - [x] 9.2 Create `syncZoomRecordings()` function in zoomUtils.js
    - Fetch session from database
    - Call `getZoomRecordings()` with meeting ID
    - Update session.recording field with primary recording data
    - Implement retry logic: poll every 5 minutes for up to 24 hours if no recordings found
    - Handle processing status: poll every 5 minutes until completed
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 8.3, 10.3_
  
  - [ ] 9.3 Write property tests for recording management
    - **Property 17: Recording Retrieval After Session End**
    - **Validates: Requirements 6.1**
    - **Property 18: Recording Data Completeness**
    - **Validates: Requirements 6.2**
    - **Property 19: Recording Retry on Missing Data**
    - **Validates: Requirements 6.3, 6.5**
    - **Property 20: Recording Processing State Handling**
    - **Validates: Requirements 6.4**
    - **Property 21: Recording Availability Invariant**
    - **Validates: Requirements 6.6**

- [x] 10. Update recording endpoints
  - [x] 10.1 Modify `getRecordingStatus()` controller
    - Replace Bunny API call with Zoom recording sync logic
    - Check if recording is processing and update status accordingly
    - Return Zoom recording data structure
    - _Requirements: 6.1, 6.2, 6.4, 7.4_
  
  - [x] 10.2 Create `getRecordingPlaybackUrl()` controller function
    - Verify user authorization to access recording
    - Return Zoom recording play URL and download URL
    - Add route `GET /api/sessions/:id/recording/playback`
    - _Requirements: 7.4_
  
  - [ ] 10.3 Write unit tests for recording endpoints
    - Test recording status retrieval
    - Test playback URL generation
    - Test authorization checks
    - _Requirements: 6.2, 7.4_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement authorization and security
  - [x] 12.1 Add authorization checks to all Zoom-related endpoints
    - Verify session creation is restricted to instructors and universities
    - Verify SDK config access is restricted to authorized users
    - Verify session management (start/end) is restricted to instructor/university
    - Verify recording access is restricted to authorized users
    - Log all failed authorization attempts with user ID and operation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 12.2 Implement passcode encryption for stored meetings
    - Encrypt meeting passcodes before storing in database
    - Decrypt passcodes when generating SDK config
    - _Requirements: 11.2, 11.3_
  
  - [ ] 12.3 Write property tests for authorization
    - **Property 22: Session Creation Authorization**
    - **Validates: Requirements 7.1**
    - **Property 23: Session Management Authorization**
    - **Validates: Requirements 7.3**
    - **Property 24: Recording Access Authorization**
    - **Validates: Requirements 7.4**
    - **Property 25: Authorization Failure Logging**
    - **Validates: Requirements 7.5**
    - **Property 34: Passcode Required for Meetings**
    - **Validates: Requirements 11.2**
    - **Property 35: Passcode Encryption**
    - **Validates: Requirements 11.3**

- [x] 13. Implement error handling and rate limiting
  - [x] 13.1 Add comprehensive error handling to Zoom API calls
    - Handle rate limit errors: queue requests and retry after window expires
    - Handle credential errors: return 500 without exposing credentials
    - Log all errors with session ID, operation type, and error details
    - _Requirements: 8.1, 8.2, 8.4, 8.5, 10.1_
  
  - [ ] 13.2 Write property tests for error handling
    - **Property 27: Rate Limit Handling**
    - **Validates: Requirements 8.4, 10.1**
    - **Property 28: API Error Logging Completeness**
    - **Validates: Requirements 8.5**
    - **Property 29: Credential Error Handling**
    - **Validates: Requirements 8.2**

- [x] 14. Implement metrics tracking
  - [x] 14.1 Add join counter increment logic
    - Increment totalJoins when student joins via SDK
    - Track peak viewers during session
    - Calculate average watch time
    - Finalize metrics when session ends
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [x] 14.2 Update metrics API endpoint
    - Ensure metrics are returned in session API responses
    - Add authorization check for metrics access
    - _Requirements: 12.5_
  
  - [ ] 14.3 Write property tests for metrics
    - **Property 38: Join Counter Increment**
    - **Validates: Requirements 12.1**
    - **Property 39: Peak Viewers Tracking**
    - **Validates: Requirements 12.2**
    - **Property 40: Average Watch Time Calculation**
    - **Validates: Requirements 12.3**
    - **Property 41: Metrics Finalization on Session End**
    - **Validates: Requirements 12.4**
    - **Property 42: Metrics API Access**
    - **Validates: Requirements 12.5**

- [x] 15. Update frontend components for Zoom SDK
  - [x] 15.1 Install Zoom Meeting SDK for Web
    - Add `@zoom/meetingsdk` to client package.json
    - Import SDK in relevant components
    - _Requirements: 3.1_
  
  - [x] 15.2 Create ZoomMeeting component
    - Fetch SDK config from `/api/sessions/:id/zoom-config`
    - Initialize Zoom SDK with config
    - Implement join meeting flow
    - Handle SDK errors and display user-friendly messages
    - Add leave meeting functionality with redirect to leaveUrl
    - _Requirements: 3.1, 3.6_
  
  - [x] 15.3 Update session detail page to use ZoomMeeting component
    - Replace HLS player with ZoomMeeting component for live sessions
    - Show "Join Meeting" button for enrolled students
    - Show "Start Meeting" button for instructors
    - _Requirements: 3.1_
  
  - [ ] 15.4 Write integration tests for frontend
    - Test SDK initialization
    - Test join flow for students
    - Test host flow for instructors
    - Test error handling

- [x] 16. Update recording playback UI
  - [x] 16.1 Create ZoomRecordingPlayer component
    - Fetch recording playback URL from `/api/sessions/:id/recording/playback`
    - Display Zoom recording player
    - Handle cases where recording is still processing
    - Show download link for completed recordings
    - _Requirements: 6.2, 7.4_
  
  - [x] 16.2 Update session detail page for ended sessions
    - Replace Bunny player with ZoomRecordingPlayer for ended sessions
    - Show recording status (processing, completed, failed)
    - Display recording duration and file size
    - _Requirements: 6.2, 6.4_

- [x] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Remove Bunny.net dependencies
  - [x] 18.1 Remove Bunny.net utility functions
    - Delete or deprecate `server/utils/bunnyUtils.js`
    - Remove Bunny API calls from controllers
    - _Requirements: 9.5_
  
  - [x] 18.2 Update environment variables documentation
    - Document new Zoom environment variables
    - Mark Bunny environment variables as deprecated
    - _Requirements: 9.1_
  
  - [x] 18.3 Clean up unused code
    - Remove Bunny-specific routes if any
    - Remove Bunny-specific frontend components
    - Update API documentation
    - _Requirements: 9.5_

- [x] 19. Data migration and backward compatibility
  - [x] 19.1 Create migration script for existing sessions
    - Identify sessions with bunny data but no zoom data
    - Mark them as legacy or create placeholder Zoom meetings
    - Update database records
    - _Requirements: 9.5_
  
  - [x] 19.2 Add backward compatibility layer
    - Keep bunny field in schema temporarily
    - Add logic to handle sessions with only bunny data
    - Plan deprecation timeline
    - _Requirements: 9.5_

- [x] 20. Optional: Implement Zoom webhooks for instant recording notifications
  - [x] 20.1 Create webhook endpoint `POST /api/webhooks/zoom`
    - Verify webhook signature using ZOOM_WEBHOOK_SECRET
    - Handle `recording.completed` event
    - Update session recording status immediately
    - _Requirements: 10.4_
  
  - [x] 20.2 Configure webhook in Zoom dashboard
    - Document webhook URL and configuration steps
    - Test webhook delivery
    - _Requirements: 10.4_

- [x] 21. Final checkpoint and integration testing
  - [x] 21.1 Run full integration test suite
    - Test complete session lifecycle: create → start → join → end → recording
    - Test with multiple users (instructor and students)
    - Test error scenarios and recovery
    - Verify all metrics are tracked correctly
  
  - [x] 21.2 Performance testing
    - Test signature caching effectiveness
    - Test recording sync polling
    - Verify rate limiting works correctly
    - Check database query performance with indexes
  
  - [x] 21.3 Security audit
    - Verify SDK secret is never exposed
    - Verify passcodes are encrypted
    - Verify authorization checks on all endpoints
    - Test with unauthorized users
  
  - [x] 21.4 Final verification
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation maintains backward compatibility during migration
- Zoom SDK credentials must be configured before testing
- Recording sync uses polling by default; webhooks are optional for instant updates
