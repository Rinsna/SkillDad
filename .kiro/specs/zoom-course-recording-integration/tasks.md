# Implementation Plan: Zoom Course Recording Integration

## Overview

This implementation plan focuses on completing the Zoom Course Recording Integration feature. Most components are already implemented (ZoomRecordingPlayer, CoursePlayer, LinkZoomRecording UI, CourseZoomController). The primary missing piece is the webhook infrastructure for automatic recording capture. Additional tasks include database optimization, comprehensive testing, and documentation.

## Tasks

- [x] 1. Implement Zoom webhook infrastructure
  - [x] 1.1 Create webhook endpoint and signature verification
    - Create POST /api/webhooks/zoom endpoint in server/routes
    - Implement HMAC-SHA256 signature verification using crypto module
    - Verify x-zm-signature header matches computed signature
    - Use constant-time comparison to prevent timing attacks
    - Return 401 for invalid signatures with security warning log
    - _Requirements: 1.1, 1.2, 1.6, 12.1, 12.2, 12.6_
  
  - [ ]* 1.2 Write property test for webhook signature verification
    - **Property 1: Webhook Signature Verification**
    - **Validates: Requirements 1.2, 1.6, 12.1, 12.6**
  
  - [x] 1.3 Process recording.completed webhook events
    - Parse recording.completed event payload from Zoom
    - Extract meetingUuid, recordingFiles array, and metadata
    - Find LiveSession by zoom.meetingId matching webhook UUID
    - Update LiveSession.recording with recordingId, playUrl, downloadUrl, durationMs, fileSizeBytes
    - Set recording.status to 'completed'
    - Handle idempotent processing for duplicate webhooks
    - Return 200 OK response within 150ms
    - _Requirements: 1.3, 1.4, 1.5, 1.7, 11.3, 15.1, 15.2, 15.3, 15.4_
  
  - [ ]* 1.4 Write property test for webhook idempotency
    - **Property 2: Webhook Idempotency**
    - **Validates: Requirements 1.7, 15.1, 15.3, 15.4**
  
  - [ ]* 1.5 Write property test for recording metadata completeness
    - **Property 3: Recording Metadata Completeness**
    - **Validates: Requirements 1.3, 1.4, 1.5**
  
  - [ ]* 1.6 Write unit tests for webhook handler
    - Test valid webhook processing
    - Test invalid signature rejection
    - Test missing LiveSession handling
    - Test duplicate webhook processing
    - _Requirements: 1.1, 1.2, 1.6, 1.7_

- [x] 2. Add database indexes for performance
  - [x] 2.1 Create compound index on LiveSession collection
    - Add compound index: { status: 1, 'recording.status': 1, endTime: -1 }
    - Create migration script in server/scripts/
    - Test query performance with 1000+ sessions
    - Verify query time < 50ms
    - _Requirements: 2.7, 11.1, 11.6_
  
  - [ ]* 2.2 Write performance test for recording queries
    - Test available recordings query with 1000+ sessions
    - Verify response time < 200ms
    - _Requirements: 2.7, 11.1_

- [x] 3. Verify and test existing components
  - [x] 3.1 Verify CourseZoomController implementation
    - Review linkZoomRecording endpoint authorization logic
    - Review getAvailableZoomRecordings filtering and sorting
    - Review unlinkZoomRecording data cleanup
    - Verify duration calculation from durationMs
    - _Requirements: 3.1-3.10, 4.1-4.6, 7.1-7.5_
  
  - [ ]* 3.2 Write property test for link operation authorization
    - **Property 7: Link Operation Authorization**
    - **Validates: Requirements 3.1, 3.8, 4.1, 4.6, 7.1, 7.2, 7.3, 7.4**
  
  - [ ]* 3.3 Write property test for link operation validation
    - **Property 8: Link Operation Validation**
    - **Validates: Requirements 3.2, 3.9**
  
  - [ ]* 3.4 Write property test for recording link data integrity
    - **Property 9: Recording Link Data Integrity**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.6, 3.7**
  
  - [ ]* 3.5 Write property test for unlink operation data cleanup
    - **Property 11: Unlink Operation Data Cleanup**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5**
  
  - [ ]* 3.6 Write unit tests for CourseZoomController
    - Test linkZoomRecordingToVideo with valid data
    - Test authorization rejection for unauthorized users
    - Test validation rejection for sessions without recordings
    - Test duration calculation accuracy
    - Test unlinkZoomRecordingFromVideo data cleanup
    - Test error handling for missing resources
    - _Requirements: 3.1-3.10, 4.1-4.6_

- [x] 4. Verify and test frontend components
  - [x] 4.1 Verify ZoomRecordingPlayer component
    - Review HTML5 video player implementation
    - Review error handling and loading states
    - Review onEnded and onError callback triggers
    - _Requirements: 5.5, 5.6, 5.7, 10.5_
  
  - [x] 4.2 Verify CoursePlayer conditional rendering
    - Review videoType detection logic
    - Review ZoomRecordingPlayer vs iframe rendering
    - Review progress tracking for video completion
    - _Requirements: 5.2, 5.3, 5.4, 6.1, 6.2_
  
  - [ ]* 4.3 Write property test for video player component selection
    - **Property 12: Video Player Component Selection**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5**
  
  - [ ]* 4.4 Write unit tests for ZoomRecordingPlayer
    - Test video player renders with correct URL
    - Test error state display for invalid URLs
    - Test loading state display
    - Test onEnded callback invocation
    - Test onError callback invocation
    - _Requirements: 5.5, 5.6, 5.7, 10.5_
  
  - [ ]* 4.5 Write unit tests for CoursePlayer
    - Test conditional rendering based on videoType
    - Test progress tracking on video completion
    - Test enrollment-based access control
    - _Requirements: 5.2, 5.3, 5.4, 6.1, 6.2, 7.6_

- [x] 5. Implement data validation and consistency checks
  - [x] 5.1 Add video type validation to Course model
    - Validate videoType enum: 'external', 'zoom-recording', 'zoom-live'
    - Validate zoomRecording.playUrl exists when videoType='zoom-recording'
    - Validate zoomSession reference exists when videoType='zoom-recording'
    - Validate zoomRecording is null when videoType='external'
    - Validate url field is not null or empty for all videos
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 14.1_
  
  - [ ]* 5.2 Write property test for video type consistency
    - **Property 15: Video Type Consistency**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**
  
  - [x] 5.3 Add recording validation to LiveSession model
    - Validate recording.status enum: 'pending', 'processing', 'ready', 'completed', 'failed'
    - Validate playUrl is valid HTTPS URL from zoom.us domain
    - Validate durationMs and fileSizeBytes are positive integers
    - Validate zoomSession reference points to existing LiveSession
    - _Requirements: 12.3, 12.4, 14.2, 14.3, 14.4, 14.5_
  
  - [ ]* 5.4 Write property test for duration format calculation
    - **Property 16: Duration Format Calculation**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**
  
  - [ ]* 5.5 Write property test for recording URL validation
    - **Property 17: Recording URL Validation**
    - **Validates: Requirements 12.3, 12.4, 14.3**
  
  - [ ]* 5.6 Write property test for numeric field validation
    - **Property 20: Numeric Field Validation**
    - **Validates: Requirements 14.4**

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement recording availability query optimization
  - [x] 7.1 Optimize getAvailableZoomRecordings query
    - Use .lean() for read-only queries
    - Project only necessary fields: topic, startTime, endTime, recording, zoom
    - Implement 5-minute caching for available recordings list
    - Filter by user role (university users see only their sessions)
    - Sort by endTime descending, limit to 50 results
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 11.5_
  
  - [ ]* 7.2 Write property test for recording availability filtering
    - **Property 4: Recording Availability Filtering**
    - **Validates: Requirements 2.1, 2.5, 2.6**
  
  - [ ]* 7.3 Write property test for available recording data completeness
    - **Property 5: Available Recording Data Completeness**
    - **Validates: Requirements 2.2**
  
  - [ ]* 7.4 Write property test for role-based recording access
    - **Property 6: Role-Based Recording Access**
    - **Validates: Requirements 2.3, 2.4, 7.5**

- [x] 8. Enhance mock mode for development
  - [x] 8.1 Improve mock recording data generation
    - Generate realistic recording metadata in mock mode
    - Add mock webhook simulator for testing
    - Display visual indicator in admin UI when mock mode is active
    - Log warning on server startup when ZOOM_MOCK_MODE=true
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 8.2 Write unit tests for mock mode
    - Test mock recordings appear in available list
    - Test mock recordings can be linked to videos
    - Test mock mode indicator displays correctly
    - _Requirements: 13.1, 13.2, 13.3_

- [x] 9. Implement error handling and recovery
  - [x] 9.1 Add comprehensive error handling
    - Return 400 for sessions without recordings
    - Return 403 for unauthorized users
    - Return 404 for missing resources
    - Return 500 for database errors with proper logging
    - Ensure no partial database updates on errors
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
  
  - [ ]* 9.2 Write property test for resource not found handling
    - **Property 10: Resource Not Found Handling**
    - **Validates: Requirements 3.10, 10.3**
  
  - [ ]* 9.3 Write unit tests for error scenarios
    - Test recording not available error
    - Test unauthorized access error
    - Test webhook signature verification failure
    - Test database connection failure handling
    - Test video index out of bounds error
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6, 10.7_

- [x] 10. Integration testing
  - [ ]* 10.1 Write integration test for complete recording link flow
    - Create live session via API
    - Simulate Zoom webhook for recording completion
    - Verify recording appears in available list
    - Link recording to course video
    - Fetch course and verify video metadata
    - Verify student can access recording
    - _Requirements: 1.1-1.7, 2.1-2.6, 3.1-3.10, 5.1-5.8_
  
  - [ ]* 10.2 Write integration test for authorization flow
    - Test university user can link own course recordings
    - Test university user cannot link other university recordings
    - Test admin can link any recordings
    - Test instructor can link course recordings
    - Test student cannot link recordings
    - _Requirements: 7.1-7.6_
  
  - [ ]* 10.3 Write integration test for error recovery flow
    - Attempt to link recording from session without recording (should fail)
    - Complete recording via webhook
    - Retry link operation (should succeed)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 10.4 Write integration test for progress tracking
    - Student watches Zoom recording to completion
    - Verify video ID added to completedVideos array
    - Verify lastAccessedModule and lastAccessedVideo updated
    - Verify lastAccessedAt timestamp updated
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Update documentation
  - [x] 12.1 Update API documentation
    - Document POST /api/webhooks/zoom endpoint
    - Document webhook signature verification process
    - Document POST /api/courses/:courseId/modules/:moduleIndex/videos/:videoIndex/link-zoom-recording
    - Document GET /api/courses/zoom-recordings/available
    - Document DELETE /api/courses/:courseId/modules/:moduleIndex/videos/:videoIndex/unlink-zoom-recording
    - Include request/response examples and error codes
    - _Requirements: All_
  
  - [x] 12.2 Create deployment guide
    - Document Zoom Marketplace app setup
    - Document environment variable configuration
    - Document webhook endpoint configuration in Zoom
    - Document database index creation
    - Document migration from mock mode to production
    - Include troubleshooting section
    - _Requirements: 12.5, 13.5_
  
  - [x] 12.3 Update ZOOM_MOCK_MODE documentation
    - Update server/docs/ZOOM_MOCK_MODE.md with recording integration details
    - Document mock webhook simulator usage
    - Document testing workflow with mock mode
    - _Requirements: 13.1-13.5_

- [x] 13. Final verification and cleanup
  - [x] 13.1 Verify all requirements are met
    - Review requirements document and check all acceptance criteria
    - Test all user stories end-to-end
    - Verify all correctness properties hold
    - _Requirements: All_
  
  - [x] 13.2 Performance verification
    - Verify available recordings query < 200ms with 1000+ sessions
    - Verify link operation < 500ms
    - Verify webhook processing < 150ms
    - Verify video player loads < 2s
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 13.3 Security verification
    - Verify webhook signature verification works correctly
    - Verify RBAC enforcement on all endpoints
    - Verify URL validation for Zoom domains
    - Verify environment variables are not exposed
    - _Requirements: 12.1-12.7_

- [x] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Most components are already implemented and only need verification and testing
- The primary new implementation is the webhook infrastructure (Task 1)
- Database indexes (Task 2) are critical for performance with large datasets
- Property-based tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
