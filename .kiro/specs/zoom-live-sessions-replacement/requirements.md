# Requirements Document: Zoom Live Sessions Replacement

## Introduction

This document specifies the requirements for replacing the existing Bunny.net RTMP/HLS live streaming infrastructure with Zoom's embedded meeting SDK. The system will enable universities and instructors to create, manage, and conduct live educational sessions using Zoom's native meeting capabilities, while students can join sessions through an embedded SDK interface. The system will handle meeting creation, access control, recording management, and student enrollment.

## Glossary

- **System**: The backend API and database layer that manages live sessions and Zoom integration
- **Zoom_API**: Zoom's REST API for creating and managing meetings
- **Zoom_SDK**: Zoom's client-side SDK for embedding meetings in web applications
- **Session**: A scheduled or live educational meeting with associated metadata
- **Instructor**: A user with permission to create and host sessions
- **Student**: A user enrolled in sessions who can join as a participant
- **University**: An organization that owns sessions and manages instructors
- **Recording**: A cloud recording of a completed Zoom meeting
- **SDK_Config**: Configuration object containing credentials for Zoom SDK initialization
- **Signature**: A JWT token that authorizes SDK access to a specific meeting
- **Meeting_Data**: Zoom meeting information including ID, passcode, and URLs

## Requirements

### Requirement 1: Session Creation with Zoom Meeting

**User Story:** As an instructor, I want to create a live session that automatically provisions a Zoom meeting, so that I can schedule classes without manually creating Zoom meetings.

#### Acceptance Criteria

1. WHEN an instructor creates a session with valid topic, start time, and duration, THE System SHALL create a Zoom meeting via Zoom_API
2. WHEN a Zoom meeting is created, THE System SHALL store the meeting ID, passcode, join URL, and start URL in the session record
3. WHEN session creation fails due to Zoom_API error, THE System SHALL retry up to 3 times with exponential backoff
4. IF all retry attempts fail, THEN THE System SHALL return a 503 error and SHALL NOT create the session in the database
5. THE System SHALL validate that topic is non-empty, start time is in the future, and duration is positive before creating a Zoom meeting

### Requirement 2: Student Enrollment

**User Story:** As an instructor, I want students to be automatically enrolled in sessions based on course or university membership, so that I don't have to manually manage participant lists.

#### Acceptance Criteria

1. WHEN a session is created with a course ID, THE System SHALL enroll all students enrolled in that course
2. WHEN a session is created without a course ID, THE System SHALL enroll all students from the university
3. THE System SHALL store enrolled student IDs in the session's enrolledStudents array
4. WHEN enrollment is updated, THE System SHALL verify that all enrolled student IDs reference valid users with student role

### Requirement 3: Zoom SDK Configuration Generation

**User Story:** As a student or instructor, I want to receive valid SDK configuration to join a meeting, so that I can participate in live sessions through the embedded interface.

#### Acceptance Criteria

1. WHEN a user requests SDK configuration for a session, THE System SHALL verify the user is either the instructor, university owner, or an enrolled student
2. IF the user is not authorized, THEN THE System SHALL return 403 Forbidden and SHALL NOT reveal session details
3. WHEN generating SDK configuration for an instructor or university owner, THE System SHALL set role to 1 (host)
4. WHEN generating SDK configuration for an enrolled student, THE System SHALL set role to 0 (participant)
5. THE System SHALL generate a JWT signature that is valid for at least 2 hours
6. THE System SHALL include SDK key, meeting number, passcode, signature, user name, user email, role, and leave URL in the configuration

### Requirement 4: Signature Generation and Security

**User Story:** As a system administrator, I want meeting signatures to be securely generated and time-limited, so that unauthorized users cannot join meetings.

#### Acceptance Criteria

1. WHEN generating a signature, THE System SHALL use the Zoom SDK secret to create a JWT token
2. THE System SHALL set signature expiration to 2 hours from generation time
3. THE System SHALL include meeting number and role in the signature payload
4. THE System SHALL never expose the SDK secret to client applications
5. WHERE signature caching is enabled, THE System SHALL cache signatures for 1 hour using Redis with key format `zoom:sig:{sessionId}:{userId}:{role}`

### Requirement 5: Session Status Management

**User Story:** As an instructor, I want to start and end sessions with proper status tracking, so that students know when sessions are live and when they have ended.

#### Acceptance Criteria

1. WHEN an instructor starts a session, THE System SHALL update the session status to 'live'
2. WHEN a session status changes to 'live', THE System SHALL notify all enrolled students via socket and email
3. WHEN an instructor ends a session, THE System SHALL update the session status to 'ended'
4. WHEN a session status changes to 'ended', THE System SHALL update the endTime field with the current timestamp
5. THE System SHALL only allow status transitions from 'scheduled' to 'live', and from 'live' to 'ended' or 'cancelled'

### Requirement 6: Recording Management

**User Story:** As an instructor, I want session recordings to be automatically retrieved from Zoom after a session ends, so that students can review the content later.

#### Acceptance Criteria

1. WHEN a session ends, THE System SHALL fetch cloud recordings from Zoom_API using the meeting ID
2. WHEN recordings are retrieved, THE System SHALL store recording ID, download URL, play URL, recording type, duration, file size, and status
3. IF no recordings are found, THEN THE System SHALL set recording status to 'failed' and retry after 5 minutes
4. WHEN recordings are still processing, THE System SHALL set status to 'processing' and poll every 5 minutes
5. IF recordings are not available after 24 hours, THEN THE System SHALL mark them as permanently unavailable
6. THE System SHALL only make recording data available for sessions with status 'ended'

### Requirement 7: Access Control and Authorization

**User Story:** As a system administrator, I want strict access control on session operations, so that only authorized users can create, join, or manage sessions.

#### Acceptance Criteria

1. WHEN a user attempts to create a session, THE System SHALL verify the user has instructor or university role
2. WHEN a user requests to join a session, THE System SHALL verify the user is either the instructor, university owner, or an enrolled student
3. WHEN a user attempts to start or end a session, THE System SHALL verify the user is either the instructor or university owner
4. WHEN a user requests recording access, THE System SHALL verify the user is authorized to view the session
5. IF authorization fails for any operation, THEN THE System SHALL return 403 Forbidden and log a security event

### Requirement 8: Error Handling and Recovery

**User Story:** As a system administrator, I want robust error handling for Zoom API failures, so that temporary issues don't permanently break session functionality.

#### Acceptance Criteria

1. WHEN Zoom_API returns an error during meeting creation, THE System SHALL retry with exponential backoff up to 3 times
2. WHEN SDK credentials are missing or invalid, THE System SHALL return 500 Internal Server Error and log the error without exposing credential details
3. WHEN recording sync fails, THE System SHALL retry after 5 minutes for up to 24 hours
4. WHEN Zoom_API rate limits are exceeded, THE System SHALL queue requests and retry after the rate limit window
5. THE System SHALL log all Zoom_API errors with session ID, operation type, and error details for debugging

### Requirement 9: Meeting Data Consistency

**User Story:** As a developer, I want all sessions to maintain consistent Zoom meeting data, so that the system remains reliable and predictable.

#### Acceptance Criteria

1. THE System SHALL ensure all sessions with status 'scheduled', 'live', or 'ended' have non-null meeting ID, passcode, and join URL
2. WHEN a session is created, THE System SHALL validate that Zoom_API returned all required meeting fields before saving to database
3. THE System SHALL store meeting data in the zoom field of the session document
4. THE System SHALL maintain an index on zoom.meetingId for fast lookups
5. WHEN migrating from Bunny.net, THE System SHALL remove all bunny field references and replace with zoom field

### Requirement 10: Performance and Scalability

**User Story:** As a system administrator, I want the system to handle Zoom API rate limits and optimize performance, so that the platform scales to support many concurrent sessions.

#### Acceptance Criteria

1. THE System SHALL implement request queuing to stay within Zoom_API rate limits (100 meeting creations per day per user, 30 recording requests per second)
2. WHERE signature caching is enabled, THE System SHALL cache signatures in Redis for 1 hour to reduce computation
3. THE System SHALL poll Zoom_API for recording updates every 5 minutes for ended sessions
4. WHERE webhook notifications are configured, THE System SHALL use Zoom webhooks for instant recording availability notifications
5. THE System SHALL use database indexes on status and startTime fields for efficient session queries

### Requirement 11: Data Privacy and Security

**User Story:** As a compliance officer, I want the system to handle sensitive meeting data securely and comply with privacy regulations, so that user data is protected.

#### Acceptance Criteria

1. THE System SHALL store Zoom SDK key and secret in environment variables and never expose them to client applications
2. THE System SHALL always require passcodes for Zoom meetings
3. THE System SHALL store meeting passcodes encrypted in the database
4. THE System SHALL not store meeting content or chat transcripts in the database
5. WHEN a recording is deleted, THE System SHALL comply with GDPR requirements and remove all associated metadata

### Requirement 12: Session Metrics Tracking

**User Story:** As an instructor, I want to see engagement metrics for my sessions, so that I can understand student participation and improve my teaching.

#### Acceptance Criteria

1. WHEN a student joins a session, THE System SHALL increment the totalJoins counter
2. THE System SHALL track the peak number of concurrent viewers in the peakViewers field
3. THE System SHALL calculate average watch time in seconds and store in avgWatchSecs field
4. WHEN a session ends, THE System SHALL finalize all metrics and store them with the session record
5. THE System SHALL provide metrics data through the session API endpoint for authorized users
