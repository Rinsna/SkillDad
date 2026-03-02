# University Course Management Guide

## Overview
This guide explains how universities can create and manage course content (modules, videos, exercises) in SkillDad.

## Current Status
⚠️ **No UI exists yet** - Universities must use API calls directly or we need to build a Course Management UI.

## API Endpoints for Course Management

### 1. Create a Course
```javascript
POST /api/courses
Headers: { Authorization: "Bearer <university-token>" }
Body: {
  "title": "Advanced Clinical Trials & Methodology",
  "description": "A deep dive into clinical trial design, phase management, and ethical considerations in modern medicine.",
  "category": "Medical Science",
  "price": 4999,
  "thumbnail": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
  "isPublished": false
}

Response: { _id: "course-id", title: "...", ... }
```

### 2. Add Module to Course
```javascript
POST /api/courses/:courseId/modules
Headers: { Authorization: "Bearer <university-token>" }
Body: {
  "title": "Module 1: Introduction to Clinical Trials"
}

Response: Updated course object with new module
```

### 3. Add Video to Module
```javascript
POST /api/courses/:courseId/modules/:moduleId/videos
Headers: { Authorization: "Bearer <university-token>" }
Body: {
  "title": "Lesson 1: What is a Clinical Trial?",
  "url": "https://www.youtube.com/embed/xyz123",
  "duration": "12:30"
}

Response: Updated course object with new video
```

### 4. Add Exercise to Video
```javascript
POST /api/courses/:courseId/modules/:moduleId/videos/:videoId/exercises
Headers: { Authorization: "Bearer <university-token>" }
Body: {
  "question": "What are the main phases of clinical trials?",
  "options": [
    "Phase 1-4",
    "Phase 1-3",
    "Phase 1-5",
    "Phase 1-2"
  ],
  "correctAnswer": "Phase 1-4",
  "type": "mcq"
}

Response: Updated course object with new exercise
```

### 5. Link Zoom Recording to Video
```javascript
POST /api/courses/:courseId/modules/:moduleIndex/videos/:videoIndex/link-zoom-recording
Headers: { Authorization: "Bearer <university-token>" }
Body: {
  "sessionId": "69a56a4fc657bdba1450b7f2"
}

Response: { message: "Recording linked successfully", video: {...} }
```

### 6. Update Course (Publish/Edit)
```javascript
PUT /api/courses/:courseId
Headers: { Authorization: "Bearer <university-token>" }
Body: {
  "isPublished": true,
  "title": "Updated Title",
  "price": 5999
}

Response: Updated course object
```

### 7. Delete Course
```javascript
DELETE /api/courses/:courseId
Headers: { Authorization: "Bearer <university-token>" }

Response: { id: "course-id" }
```

## Complete Example Workflow

```javascript
// Step 1: Create Course
const courseResponse = await axios.post('/api/courses', {
  title: "Web Development Bootcamp",
  description: "Learn HTML, CSS, JavaScript, React",
  category: "Computer Science",
  price: 2999,
  isPublished: false
}, { headers: { Authorization: `Bearer ${token}` }});

const courseId = courseResponse.data._id;

// Step 2: Add Module
const moduleResponse = await axios.post(`/api/courses/${courseId}/modules`, {
  title: "Module 1: HTML Basics"
}, { headers: { Authorization: `Bearer ${token}` }});

const moduleId = moduleResponse.data.modules[0]._id;

// Step 3: Add Video
const videoResponse = await axios.post(
  `/api/courses/${courseId}/modules/${moduleId}/videos`,
  {
    title: "Introduction to HTML",
    url: "https://youtube.com/embed/abc123",
    duration: "15:30"
  },
  { headers: { Authorization: `Bearer ${token}` }}
);

const videoId = videoResponse.data.modules[0].videos[0]._id;

// Step 4: Add Exercise
await axios.post(
  `/api/courses/${courseId}/modules/${moduleId}/videos/${videoId}/exercises`,
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language"
    ],
    correctAnswer: "Hyper Text Markup Language",
    type: "mcq"
  },
  { headers: { Authorization: `Bearer ${token}` }}
);

// Step 5: Publish Course
await axios.put(`/api/courses/${courseId}`, {
  isPublished: true
}, { headers: { Authorization: `Bearer ${token}` }});
```

## Recommended: Build Course Management UI

The UI should include:

1. **Course List Page**
   - View all courses
   - Create/Edit/Delete courses
   - Publish/Unpublish toggle

2. **Course Builder Page**
   - Add/Edit/Delete modules
   - Add/Edit/Delete videos
   - Add/Edit/Delete exercises
   - Drag-and-drop reordering
   - Preview course structure

3. **Video Manager**
   - YouTube/Vimeo embed support
   - Zoom recording integration
   - Duration input
   - Thumbnail preview

4. **Exercise Builder**
   - MCQ question builder
   - Short answer support
   - Correct answer selection
   - Preview mode

5. **Publish Workflow**
   - Validation checks
   - Preview before publish
   - Student enrollment tracking

## Next Steps

Would you like me to:
1. Build the Course Management UI component by component?
2. Create a simple form-based interface?
3. Integrate with the existing University Dashboard?

Let me know and I'll implement it!
