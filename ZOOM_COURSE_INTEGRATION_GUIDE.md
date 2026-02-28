# Zoom Course Integration Guide

## Overview

Your SkillDad platform now supports embedding Zoom recordings directly into course videos! This allows you to:

1. Record live Zoom sessions
2. Link those recordings to course videos
3. Students watch Zoom recordings embedded in the course player

---

## How It Works

### Architecture:

```
Live Zoom Session → Recording → Link to Course Video → Student Watches
```

1. **Instructor** conducts a live Zoom session
2. **Zoom** automatically records the session (cloud recording)
3. **Instructor** links the recording to a course video
4. **Students** watch the embedded Zoom recording in the course player

---

## Step-by-Step Usage

### Step 1: Record a Live Zoom Session

1. Go to "Live Sessions" in your dashboard
2. Create a new live session
3. Conduct the session (Zoom will record automatically if cloud recording is enabled)
4. End the session
5. Wait for Zoom to process the recording (~5-10 minutes)

### Step 2: Link Recording to Course Video

1. Go to "Courses" → Select your course → "Edit"
2. Navigate to the module and video you want to link
3. Click "Link Zoom Recording" button
4. Select the recording from the list of available recordings
5. Click "Link Selected Recording"

### Step 3: Students Watch the Recording

1. Students enroll in the course
2. Navigate to the course player
3. The Zoom recording plays automatically in the embedded player
4. Students can pause, rewind, and control playback

---

## API Endpoints

### Get Available Zoom Recordings

```http
GET /api/courses/zoom-recordings/available
Authorization: Bearer <token>
```

**Response**:
```json
[
  {
    "sessionId": "session_id",
    "title": "Introduction to React",
    "recordedAt": "2024-02-26T10:00:00Z",
    "duration": "45:30",
    "playUrl": "https://zoom.us/rec/play/...",
    "downloadUrl": "https://zoom.us/rec/download/...",
    "fileSize": "250.50 MB"
  }
]
```

### Link Zoom Recording to Video

```http
POST /api/courses/:courseId/modules/:moduleIndex/videos/:videoIndex/link-zoom-recording
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "session_id"
}
```

### Unlink Zoom Recording from Video

```http
DELETE /api/courses/:courseId/modules/:moduleIndex/videos/:videoIndex/unlink-zoom-recording
Authorization: Bearer <token>
```

---

## Database Schema Updates

### Course Model - Video Schema

```javascript
{
  title: String,
  url: String, // Fallback URL
  duration: String,
  exercises: [ExerciseSchema],
  
  // NEW: Zoom integration fields
  videoType: {
    type: String,
    enum: ['external', 'zoom-recording', 'zoom-live'],
    default: 'external'
  },
  zoomRecording: {
    recordingId: String,
    playUrl: String,
    downloadUrl: String,
    durationMs: Number,
    fileSizeBytes: Number,
    recordedAt: Date
  },
  zoomSession: {
    type: ObjectId,
    ref: 'LiveSession'
  }
}
```

---

## Components

### ZoomRecordingPlayer

Located: `client/src/components/ZoomRecordingPlayer.jsx`

**Props**:
- `recordingUrl` (string): Zoom recording play URL
- `title` (string): Video title
- `onEnded` (function): Callback when video ends
- `onError` (function): Callback when error occurs

**Usage**:
```jsx
<ZoomRecordingPlayer
  recordingUrl="https://zoom.us/rec/play/..."
  title="Introduction to React"
  onEnded={() => console.log('Video ended')}
  onError={(error) => console.error(error)}
/>
```

### LinkZoomRecording Page

Located: `client/src/pages/university/LinkZoomRecording.jsx`

**Route**: `/admin/courses/:courseId/modules/:moduleIndex/videos/:videoIndex/link-zoom`

**Features**:
- Lists all available Zoom recordings
- Shows recording details (date, duration, file size)
- Allows selection and linking to course video

---

## User Flow

### For Instructors/Universities:

1. **Create Course** → Add modules and videos
2. **Conduct Live Session** → Zoom records automatically
3. **Link Recording** → Connect recording to course video
4. **Publish Course** → Students can now watch

### For Students:

1. **Enroll in Course** → Pay and get access
2. **Open Course Player** → Navigate to video
3. **Watch Zoom Recording** → Embedded player with controls
4. **Complete Exercises** → After watching

---

## Features

### Current Features:

- ✅ Embed Zoom recordings in course player
- ✅ Automatic video controls (play, pause, seek)
- ✅ Link/unlink recordings from videos
- ✅ List available recordings
- ✅ Display recording metadata (duration, file size, date)
- ✅ Fallback to external videos (YouTube/Vimeo)

### Future Enhancements:

- ⏳ Automatic linking (record session → auto-link to course)
- ⏳ Transcript integration
- ⏳ Chapter markers
- ⏳ Playback speed control
- ⏳ Download recordings (for offline viewing)

---

## Troubleshooting

### Recording Not Available

**Problem**: "Recording Unavailable" error in player

**Solutions**:
1. Wait 5-10 minutes after session ends (Zoom processing time)
2. Verify cloud recording is enabled in Zoom settings
3. Check session status is "ended"
4. Ensure recording.status is "completed"

### Cannot Link Recording

**Problem**: Recording doesn't appear in available list

**Solutions**:
1. Verify session has ended
2. Check recording is completed (not processing)
3. Ensure you have permission to access the session
4. Refresh the page

### Video Won't Play

**Problem**: Embedded player shows error

**Solutions**:
1. Check recording URL is valid
2. Verify Zoom credentials are configured
3. Ensure browser supports HTML5 video
4. Try a different browser

---

## Configuration

### Required Environment Variables:

```bash
# Zoom API Credentials
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
ZOOM_ACCOUNT_ID=your_zoom_account_id

# Zoom SDK Credentials
ZOOM_SDK_KEY=your_zoom_sdk_key
ZOOM_SDK_SECRET=your_zoom_sdk_secret

# Zoom Encryption Key
ZOOM_ENCRYPTION_KEY=your_32_char_encryption_key
```

### Zoom Settings:

1. Enable cloud recording in Zoom account
2. Set recording to "Automatic"
3. Enable "Share recording" option
4. Configure webhook for recording.completed events

---

## Best Practices

### For Instructors:

1. **Test First**: Record a test session before going live
2. **Check Quality**: Verify recording quality after session
3. **Link Promptly**: Link recordings to courses within 24 hours
4. **Organize**: Use clear naming for sessions and courses
5. **Backup**: Keep local copies of important recordings

### For Administrators:

1. **Monitor Storage**: Zoom recordings consume cloud storage
2. **Set Retention**: Configure auto-delete for old recordings
3. **Review Permissions**: Ensure proper access controls
4. **Track Usage**: Monitor which recordings are linked to courses
5. **Maintain Credentials**: Keep Zoom API credentials secure

---

## Security Considerations

### Access Control:

- ✅ Only instructors/admins can link recordings
- ✅ Students can only watch linked recordings
- ✅ Recording URLs are not exposed to unauthorized users
- ✅ Zoom credentials are stored securely on backend

### Data Protection:

- ✅ Recording URLs are encrypted in database
- ✅ Access tokens are validated on every request
- ✅ HTTPS required for all Zoom API calls
- ✅ No client-side storage of sensitive data

---

## Migration from External Videos

### To migrate existing courses:

1. **Identify Videos**: List all videos using external URLs
2. **Record Sessions**: Conduct live sessions for each topic
3. **Link Recordings**: Replace external URLs with Zoom recordings
4. **Test Playback**: Verify all recordings play correctly
5. **Update Metadata**: Ensure duration and titles are accurate

### Bulk Migration Script:

```javascript
// Coming soon: Automated migration tool
// Will convert external videos to Zoom recordings
```

---

## Support

### Common Questions:

**Q: Can I use both Zoom and YouTube videos?**
A: Yes! The system supports both. Set `videoType` to choose.

**Q: How long are recordings stored?**
A: Depends on your Zoom plan. Free plans: 30 days, Paid plans: unlimited.

**Q: Can students download recordings?**
A: Not by default. Enable `downloadUrl` if you want to allow downloads.

**Q: What video formats are supported?**
A: Zoom recordings are MP4 format, supported by all modern browsers.

---

## Changelog

### Version 1.0 (Current)

- ✅ Initial Zoom recording integration
- ✅ ZoomRecordingPlayer component
- ✅ Link/unlink API endpoints
- ✅ Course model updates
- ✅ Admin UI for linking recordings

---

**Need Help?** Check the main Zoom setup guides or contact support!
