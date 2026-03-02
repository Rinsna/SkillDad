# How Universities Conduct Live Sessions - Step by Step Guide

## Overview
Universities can schedule and conduct live Zoom sessions for their students through the SkillDad platform. This guide explains the complete process.

---

## Prerequisites

Before conducting live sessions, ensure:
- ✅ University account is verified
- ✅ Courses are assigned to the university
- ✅ Students are enrolled in courses
- ✅ Zoom integration is enabled (production mode)

---

## Step-by-Step Process

### Step 1: Login to University Dashboard

1. Go to your SkillDad application
2. Login with university credentials
3. Navigate to **University Dashboard**

---

### Step 2: Navigate to Live Sessions

From the University Dashboard:
1. Click on **"Live Sessions"** tab or menu item
2. You'll see the Live Sessions Hub with:
   - Upcoming sessions
   - Past sessions
   - Session statistics

---

### Step 3: Schedule a New Live Session

1. Click the **"Schedule New Class"** button
2. Fill in the session details:

   **Basic Information:**
   - **Session Title**: Enter a descriptive title (e.g., "Introduction to Python")
   - **Description**: Add session details and topics to be covered
   - **Course**: Select the course this session belongs to
   - **Instructor**: Select the instructor who will conduct the session

   **Date & Time:**
   - **Date**: Choose the session date
   - **Start Time**: Set when the session begins
   - **Duration**: Set session length (in minutes)

   **Student Selection:**
   - **Select Students**: Choose which students can attend
     - Option 1: Select all students from the course
     - Option 2: Select specific students
     - Option 3: Select by group (if groups are configured)

3. Click **"Schedule Session"** button

---

### Step 4: Session is Created

After scheduling:
- ✅ A Zoom meeting is automatically created via Zoom API
- ✅ Session appears in "Upcoming Sessions" list
- ✅ Students receive notifications (if enabled)
- ✅ Session details are saved with status: "scheduled"

---

### Step 5: Before the Session Starts

**For University/Instructor:**
1. Go to **Live Sessions** tab
2. Find your scheduled session
3. Review session details:
   - Zoom meeting ID
   - Start time
   - Enrolled students list
   - Session topic

**What Students See:**
- Session appears in their dashboard
- They can see session details
- Join button becomes active when session starts

---

### Step 6: Starting the Live Session

**Option A: Manual Start (Recommended)**
1. Navigate to the session detail page
2. Click **"Start Session"** button
3. Session status changes to "live"
4. Zoom meeting interface loads
5. Students can now join

**Option B: Auto-Start**
- Session automatically becomes "live" at scheduled start time
- Students can join when ready

---

### Step 7: Conducting the Session

**Instructor View:**
1. Zoom meeting interface embedded in the platform
2. Full Zoom controls available:
   - Video on/off
   - Audio mute/unmute
   - Screen sharing
   - Chat
   - Participant management
   - Recording controls

**Student View:**
1. Students click "Join Session" button
2. Zoom interface loads in their browser
3. They can participate with video/audio
4. Access to chat and reactions

---

### Step 8: During the Session

**Features Available:**
- ✅ Real-time video/audio communication
- ✅ Screen sharing for presentations
- ✅ Chat for questions and discussions
- ✅ Participant list management
- ✅ Recording (if enabled)
- ✅ Breakout rooms (Zoom feature)
- ✅ Polls and Q&A (Zoom features)

**Monitoring:**
- See who joined
- Track attendance
- Monitor participation
- View session metrics

---

### Step 9: Ending the Session

**To End the Session:**
1. Click **"End Session"** button in the interface
2. Confirm you want to end for all participants
3. Session status changes to "completed"
4. Zoom meeting closes for all participants

**What Happens:**
- ✅ Session marked as completed
- ✅ Attendance recorded
- ✅ Duration calculated
- ✅ Recording processed (if enabled)
- ✅ Metrics saved

---

### Step 10: After the Session

**Automatic Processing:**
1. **Recording Processing** (if enabled):
   - Zoom processes the recording
   - Recording is uploaded to cloud
   - Webhook notifies SkillDad platform
   - Recording becomes available in course materials

2. **Metrics & Analytics**:
   - Total duration
   - Attendance count
   - Participant list
   - Join/leave times

**Access Recording:**
1. Go to the course page
2. Navigate to "Recordings" section
3. Find the session recording
4. Students can watch the replay

---

## Session Management Features

### View All Sessions

**Upcoming Sessions:**
- See all scheduled future sessions
- Edit or cancel sessions
- View enrolled students
- Check Zoom meeting details

**Past Sessions:**
- Review completed sessions
- View attendance records
- Access recordings
- Check session metrics

**Live Sessions:**
- See currently active sessions
- Join ongoing sessions
- Monitor participation

---

### Edit a Scheduled Session

1. Go to Live Sessions list
2. Click on the session you want to edit
3. Click **"Edit"** button
4. Modify details:
   - Title, description
   - Date/time
   - Duration
   - Student list
5. Save changes
6. Zoom meeting is updated automatically

---

### Cancel a Session

1. Find the session in the list
2. Click **"Cancel"** or **"Delete"** button
3. Confirm cancellation
4. Session is marked as cancelled
5. Students are notified (if enabled)
6. Zoom meeting is deleted

---

## Student Experience

### How Students Join Sessions

1. **Login** to SkillDad platform
2. **Navigate** to Dashboard or Live Sessions
3. **Find** the scheduled session
4. **Wait** for session to become "live"
5. **Click** "Join Session" button
6. **Zoom interface** loads in browser
7. **Allow** camera/microphone permissions
8. **Join** the meeting

### What Students Can Do

- ✅ View session schedule
- ✅ See session details and topics
- ✅ Join live sessions
- ✅ Participate with video/audio
- ✅ Use chat for questions
- ✅ View shared screens
- ✅ Access recordings after session

---

## Technical Details

### Zoom Integration

**How It Works:**
1. University schedules session via SkillDad UI
2. SkillDad backend calls Zoom API
3. Zoom creates meeting and returns meeting ID
4. Meeting details stored in database
5. Zoom SDK embedded in frontend
6. Users join via Zoom SDK (no external app needed)

**Recording Process:**
1. Instructor enables recording during session
2. Zoom records to cloud
3. After session ends, Zoom processes recording
4. Zoom sends webhook to SkillDad
5. SkillDad receives recording URL
6. Recording linked to course materials
7. Students can access replay

---

## Troubleshooting

### Session Won't Start
- Check Zoom credentials are configured
- Verify `ZOOM_MOCK_MODE=false` in production
- Check session is scheduled for current time
- Verify instructor permissions

### Students Can't Join
- Ensure session status is "live"
- Check students are enrolled in the course
- Verify students are added to session
- Check browser permissions for camera/mic

### Recording Not Available
- Verify recording was enabled during session
- Check Zoom webhook is configured correctly
- Wait for Zoom to process (can take 5-10 minutes)
- Check webhook secret matches Zoom app

### 403 Access Denied Error
- Student not enrolled in course
- Student not added to session participant list
- Session belongs to different university
- Check student's universityId matches session university

---

## Best Practices

### Before Scheduling
- ✅ Ensure course is created and active
- ✅ Verify students are enrolled
- ✅ Choose appropriate session duration
- ✅ Add clear session title and description
- ✅ Schedule with enough advance notice

### During Session
- ✅ Start 5 minutes early to test setup
- ✅ Enable recording for future reference
- ✅ Use screen sharing for presentations
- ✅ Monitor chat for student questions
- ✅ Take attendance at start
- ✅ Engage students with polls/Q&A

### After Session
- ✅ End session properly (don't just close browser)
- ✅ Verify recording is processing
- ✅ Review attendance and metrics
- ✅ Share recording link with absent students
- ✅ Follow up on student questions

---

## Quick Reference

### University Dashboard Navigation
```
Login → University Dashboard → Live Sessions → Schedule New Class
```

### Session Lifecycle
```
Scheduled → Live → Completed → Recording Available
```

### Key Endpoints (for developers)
- `POST /api/sessions` - Create session
- `GET /api/sessions` - List sessions
- `GET /api/sessions/:id` - Get session details
- `PUT /api/sessions/:id/start` - Start session
- `PUT /api/sessions/:id/end` - End session
- `POST /api/webhooks/zoom` - Zoom webhook for recordings

---

## Support

If you encounter issues:
1. Check this guide first
2. Verify Zoom credentials on Render
3. Check browser console for errors
4. Review server logs on Render dashboard
5. Contact platform administrator

---

## Summary

Universities can easily conduct live sessions by:
1. Scheduling sessions through the dashboard
2. Starting sessions at scheduled time
3. Conducting sessions via embedded Zoom
4. Ending sessions when complete
5. Accessing recordings and metrics afterward

The entire process is integrated into the SkillDad platform with no need for external Zoom accounts or apps.
