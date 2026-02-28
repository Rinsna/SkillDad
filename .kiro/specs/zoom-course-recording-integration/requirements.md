# Requirements Document: Zoom Course Recording Integration

## Introduction

The Zoom Course Recording Integration feature enables the SkillDad platform to seamlessly embed Zoom cloud recordings into course videos. This system automatically syncs recordings from live Zoom sessions to the course library, allowing university administrators and instructors to manage which recordings are linked to specific course videos. Students can watch Zoom recordings directly within the course player with the same user experience as external videos.

This feature bridges the existing live session infrastructure with the course content delivery system, creating a unified educational experience where live sessions can be repurposed as on-demand course content.

## Glossary

- **System**: The SkillDad platform backend and frontend application
- **Course_Player**: The frontend component that renders course videos for students
- **Zoom_Recording_Player**: The frontend component that renders Zoom cloud recordings using HTML5 video
- **Course_Zoom_Controller**: The backend controller handling Zoom recording operations for courses
- **Webhook_Handler**: The backend service that processes Zoom webhook events
- **Live_Session**: A scheduled Zoom meeting session stored in the database
- **Course_Video**: A video object within a course module that can reference external URLs or Zoom recordings
- **Recording_Metadata**: Data about a Zoom recording including playUrl, downloadUrl, duration, and file size
- **Available_Recording**: A completed Zoom recording that is ready to be linked to a course video
- **Admin_User**: A user with role 'admin', 'university', or 'instructor' who can manage course content
- **Enrolled_Student**: A user who has enrolled in a course and can access its content
- **Zoom_API**: The external Zoom REST API for managing meetings and recordings
- **Zoom_Webhook**: HTTP callback from Zoom when recording events occur

## Requirements

### Requirement 1: Automatic Recording Capture

**User Story:** As a system administrator, I want Zoom recordings to be automatically captured when live sessions end, so that recordings are available for linking without manual intervention.

#### Acceptance Criteria

1. WHEN a Zoom recording is completed, THEN THE Webhook_Handler SHALL receive a webhook notification from Zoom
2. WHEN a webhook is received, THEN THE Webhook_Handler SHALL verify the HMAC signature before processing
3. WHEN a valid recording.completed webhook is received, THEN THE System SHALL update the corresponding Live_Session with recording metadata
4. WHEN updating recording metadata, THEN THE System SHALL store recordingId, playUrl, downloadUrl, durationMs, and fileSizeBytes
5. WHEN a recording is captured, THEN THE System SHALL set the recording status to 'completed'
6. IF a webhook signature is invalid, THEN THE Webhook_Handler SHALL reject the request and log a security warning
7. WHEN the same webhook is received multiple times, THEN THE System SHALL process it idempotently without creating duplicate data

---

### Requirement 2: Recording Availability Query

**User Story:** As an instructor, I want to view a list of available Zoom recordings, so that I can select which recordings to link to my course videos.

#### Acceptance Criteria

1. WHEN an Admin_User requests available recordings, THEN THE System SHALL return recordings from Live_Sessions with status='ended' and recording.status='completed'
2. WHEN returning available recordings, THEN THE System SHALL include sessionId, title, recordedAt, duration, playUrl, downloadUrl, and fileSize
3. WHEN a university user requests recordings, THEN THE System SHALL filter results to only sessions they own
4. WHEN an admin requests recordings, THEN THE System SHALL return recordings from all sessions
5. WHEN returning recordings, THEN THE System SHALL sort results by endTime in descending order
6. WHEN returning recordings, THEN THE System SHALL limit results to a maximum of 50 recordings
7. WHEN querying recordings, THEN THE System SHALL complete the operation in less than 200ms

---

### Requirement 3: Link Recording to Course Video

**User Story:** As an instructor, I want to link a Zoom recording to a specific course video, so that students can watch the recording as part of the course content.

#### Acceptance Criteria

1. WHEN an Admin_User links a recording, THEN THE System SHALL verify the user is authorized to modify the course
2. WHEN linking a recording, THEN THE System SHALL validate that the Live_Session has a completed recording with a valid playUrl
3. WHEN a recording is linked, THEN THE System SHALL set the Course_Video videoType to 'zoom-recording'
4. WHEN a recording is linked, THEN THE System SHALL populate the Course_Video zoomRecording object with complete metadata
5. WHEN a recording is linked, THEN THE System SHALL set the Course_Video zoomSession reference to the Live_Session ID
6. WHEN a recording is linked, THEN THE System SHALL update the Course_Video url field to the recording playUrl
7. WHEN a recording is linked, THEN THE System SHALL calculate and set the Course_Video duration from durationMs in MM:SS format
8. IF the user is not authorized, THEN THE System SHALL return a 403 error and make no changes
9. IF the session does not have a completed recording, THEN THE System SHALL return a 400 error
10. IF the course, module, or video is not found, THEN THE System SHALL return a 404 error

---

### Requirement 4: Unlink Recording from Course Video

**User Story:** As an instructor, I want to unlink a Zoom recording from a course video, so that I can replace it with a different video source or remove it entirely.

#### Acceptance Criteria

1. WHEN an Admin_User unlinks a recording, THEN THE System SHALL verify the user is authorized to modify the course
2. WHEN a recording is unlinked, THEN THE System SHALL set the Course_Video videoType to 'external'
3. WHEN a recording is unlinked, THEN THE System SHALL remove the zoomRecording object from the Course_Video
4. WHEN a recording is unlinked, THEN THE System SHALL remove the zoomSession reference from the Course_Video
5. WHEN a recording is unlinked, THEN THE System SHALL preserve the existing url field value
6. IF the user is not authorized, THEN THE System SHALL return a 403 error

---

### Requirement 5: Student Video Playback

**User Story:** As a student, I want to watch Zoom recordings within the course player, so that I can access recorded sessions as part of my learning experience.

#### Acceptance Criteria

1. WHEN a student accesses a course, THEN THE Course_Player SHALL fetch the course data including video metadata
2. WHEN rendering a video, THEN THE Course_Player SHALL detect the videoType field
3. WHEN videoType is 'zoom-recording', THEN THE Course_Player SHALL render the Zoom_Recording_Player component
4. WHEN videoType is 'external', THEN THE Course_Player SHALL render an iframe with the external video URL
5. WHEN the Zoom_Recording_Player renders, THEN THE System SHALL display an HTML5 video element with the recording playUrl
6. WHEN a video completes playback, THEN THE System SHALL trigger the onEnded callback to update user progress
7. IF a recording fails to load, THEN THE Zoom_Recording_Player SHALL display an error message to the user
8. WHEN a student is not enrolled in the course, THEN THE System SHALL prevent access to course videos

---

### Requirement 6: Progress Tracking Consistency

**User Story:** As a student, I want my progress to be tracked consistently regardless of video type, so that my course completion status is accurate.

#### Acceptance Criteria

1. WHEN a student completes a video, THEN THE System SHALL add the video ID to the completedVideos array
2. WHEN tracking progress, THEN THE System SHALL treat Zoom recordings and external videos identically
3. WHEN a student completes exercises, THEN THE System SHALL record the score in the completedExercises array
4. WHEN a student accesses a video, THEN THE System SHALL update the lastAccessedModule and lastAccessedVideo fields
5. WHEN a student accesses a video, THEN THE System SHALL update the lastAccessedAt timestamp

---

### Requirement 7: Authorization and Access Control

**User Story:** As a system administrator, I want to enforce role-based access control on recording management operations, so that only authorized users can modify course content.

#### Acceptance Criteria

1. WHEN a user attempts to link a recording, THEN THE System SHALL verify the user role is 'admin', 'university', or 'instructor'
2. WHEN a university user attempts to link a recording, THEN THE System SHALL verify the user owns the course
3. WHEN an instructor attempts to link a recording, THEN THE System SHALL verify the user is the course instructor
4. WHEN a student attempts to link a recording, THEN THE System SHALL reject the request with a 403 error
5. WHEN a user attempts to view available recordings, THEN THE System SHALL filter results based on user role and ownership
6. WHEN a student attempts to watch a recording, THEN THE System SHALL verify the student is enrolled in the course

---

### Requirement 8: Video Type Consistency

**User Story:** As a developer, I want video metadata to be consistent with the video type, so that the system maintains data integrity.

#### Acceptance Criteria

1. WHEN a Course_Video has videoType='zoom-recording', THEN THE System SHALL ensure zoomRecording.playUrl is not null
2. WHEN a Course_Video has videoType='zoom-recording', THEN THE System SHALL ensure zoomSession reference is not null
3. WHEN a Course_Video has videoType='external', THEN THE System SHALL ensure zoomRecording is null or undefined
4. WHEN a Course_Video has videoType='external', THEN THE System SHALL ensure zoomSession is null or undefined
5. WHEN any Course_Video is created or updated, THEN THE System SHALL ensure the url field is not null or empty

---

### Requirement 9: Duration Calculation

**User Story:** As an instructor, I want video durations to be automatically calculated from recording metadata, so that course timings are accurate.

#### Acceptance Criteria

1. WHEN a recording is linked with durationMs, THEN THE System SHALL calculate the duration in MM:SS format
2. WHEN calculating duration, THEN THE System SHALL compute minutes as FLOOR(durationMs / 60000)
3. WHEN calculating duration, THEN THE System SHALL compute seconds as FLOOR((durationMs MOD 60000) / 1000)
4. WHEN formatting duration, THEN THE System SHALL pad seconds with leading zero if less than 10
5. WHEN durationMs is null, THEN THE System SHALL preserve the existing duration value

---

### Requirement 10: Error Handling and Recovery

**User Story:** As a user, I want clear error messages when operations fail, so that I can understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN a recording is not available, THEN THE System SHALL return a 400 error with message "Session does not have a recording available"
2. WHEN a user is not authorized, THEN THE System SHALL return a 403 error with message "Not authorized to modify this course"
3. WHEN a resource is not found, THEN THE System SHALL return a 404 error with an appropriate message
4. WHEN a database operation fails, THEN THE System SHALL return a 500 error and log the error details
5. WHEN a video fails to load in the player, THEN THE Zoom_Recording_Player SHALL display "Recording Unavailable - The recording may not be available yet"
6. WHEN a webhook signature is invalid, THEN THE System SHALL return a 401 error and log a security warning
7. WHEN an error occurs, THEN THE System SHALL not leave the database in an inconsistent state

---

### Requirement 11: Performance and Scalability

**User Story:** As a system administrator, I want the recording integration to perform efficiently, so that users have a responsive experience.

#### Acceptance Criteria

1. WHEN querying available recordings, THEN THE System SHALL complete the operation in less than 200ms for 1000+ sessions
2. WHEN linking a recording, THEN THE System SHALL complete the operation in less than 500ms
3. WHEN processing a webhook, THEN THE System SHALL respond to Zoom within 150ms
4. WHEN loading a video player, THEN THE System SHALL display the first frame within 2 seconds on broadband connections
5. WHEN caching is enabled, THEN THE System SHALL cache available recordings for 5 minutes
6. WHEN using database indexes, THEN THE System SHALL use a compound index on LiveSession for status, recording.status, and endTime

---

### Requirement 12: Security and Data Protection

**User Story:** As a security administrator, I want the system to protect against unauthorized access and malicious attacks, so that user data and recordings remain secure.

#### Acceptance Criteria

1. WHEN receiving a Zoom webhook, THEN THE System SHALL verify the HMAC-SHA256 signature using the webhook secret
2. WHEN comparing signatures, THEN THE System SHALL use constant-time comparison to prevent timing attacks
3. WHEN validating recording URLs, THEN THE System SHALL ensure URLs are from the zoom.us domain
4. WHEN validating recording URLs, THEN THE System SHALL ensure URLs use HTTPS protocol
5. WHEN storing credentials, THEN THE System SHALL use environment variables and never store them in code
6. WHEN a security violation is detected, THEN THE System SHALL log the incident for audit purposes
7. WHEN rate limiting is enabled, THEN THE System SHALL limit webhook requests to 100 per minute per IP address

---

### Requirement 13: Mock Mode for Development

**User Story:** As a developer, I want to use mock Zoom data during development, so that I can test the integration without a real Zoom account.

#### Acceptance Criteria

1. WHEN ZOOM_MOCK_MODE is set to true, THEN THE System SHALL use mock recording data instead of calling the Zoom API
2. WHEN in mock mode, THEN THE System SHALL generate realistic recording metadata
3. WHEN in mock mode, THEN THE System SHALL display a visual indicator in the admin UI
4. WHEN in mock mode, THEN THE System SHALL log a warning on server startup
5. WHEN ZOOM_MOCK_MODE is false, THEN THE System SHALL use the real Zoom API with configured credentials

---

### Requirement 14: Data Model Validation

**User Story:** As a developer, I want data models to enforce validation rules, so that invalid data cannot be stored in the database.

#### Acceptance Criteria

1. WHEN saving a Course_Video, THEN THE System SHALL validate videoType is one of 'external', 'zoom-recording', or 'zoom-live'
2. WHEN saving a Live_Session recording, THEN THE System SHALL validate status is one of 'pending', 'processing', 'ready', 'completed', or 'failed'
3. WHEN saving recording metadata, THEN THE System SHALL validate playUrl is a valid HTTPS URL
4. WHEN saving recording metadata, THEN THE System SHALL validate durationMs and fileSizeBytes are positive integers
5. WHEN a zoomSession reference is set, THEN THE System SHALL validate it references an existing Live_Session document

---

### Requirement 15: Webhook Idempotency

**User Story:** As a system administrator, I want webhook processing to be idempotent, so that duplicate webhook deliveries do not cause data corruption.

#### Acceptance Criteria

1. WHEN the same webhook is received multiple times, THEN THE System SHALL produce the same result as processing it once
2. WHEN updating recording metadata, THEN THE System SHALL use upsert operations to handle duplicates
3. WHEN a webhook is processed, THEN THE System SHALL not create duplicate recording entries
4. WHEN a webhook updates a Live_Session, THEN THE System SHALL overwrite existing recording data with the latest values
