# Zoom Credentials Setup Checklist

## ✅ Quick Reference

Use this checklist to track your progress setting up Zoom credentials.

---

## Step 1: Server-to-Server OAuth App (API Credentials)

**Purpose**: Backend creates and manages Zoom meetings

**URL**: https://marketplace.zoom.us/ → Develop → Build App → Server-to-Server OAuth

### Credentials Needed:

- [ ] **ZOOM_ACCOUNT_ID**: `_________________________`
- [ ] **ZOOM_API_KEY** (Client ID): `_________________________`
- [ ] **ZOOM_API_SECRET** (Client Secret): `_________________________`

### Required Scopes:

- [ ] `meeting:write:admin`
- [ ] `meeting:read:admin`
- [ ] `recording:read:admin`
- [ ] `user:read:admin`

### Activation:

- [ ] App is activated (toggle ON in Activation tab)

---

## Step 2: Meeting SDK App (SDK Credentials)

**Purpose**: Frontend embeds Zoom meetings in browser

**URL**: https://marketplace.zoom.us/ → Develop → Build App → Meeting SDK

### Credentials Needed:

- [ ] **ZOOM_SDK_KEY**: `_________________________`
- [ ] **ZOOM_SDK_SECRET**: `_________________________`

### Features Enabled:

- [ ] Video
- [ ] Audio
- [ ] Screen Share
- [ ] Chat
- [ ] Recording (if paid plan)

---

## Step 3: Webhook Configuration (Optional)

**Purpose**: Get notified when recordings are ready

**URL**: Your Server-to-Server OAuth app → Feature → Event Subscriptions

### Configuration:

- [ ] **Event Subscription Name**: Recording Notifications
- [ ] **Endpoint URL**: `https://your-domain.com/api/webhooks/zoom`
- [ ] **ZOOM_WEBHOOK_SECRET**: `_________________________`

### Event Types:

- [ ] `recording.completed`
- [ ] `recording.transcript_completed` (optional)

---

## Step 4: Generate Encryption Key

**Purpose**: Encrypt meeting passcodes in database

### Generate Key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] **ZOOM_ENCRYPTION_KEY**: `_________________________`

---

## Step 5: Update .env File

Open `server/.env` and update:

```bash
# Set to false to use real Zoom (true for testing only)
ZOOM_MOCK_MODE=false

# API Credentials (from Step 1)
ZOOM_API_KEY=<paste Client ID>
ZOOM_API_SECRET=<paste Client Secret>
ZOOM_ACCOUNT_ID=<paste Account ID>

# SDK Credentials (from Step 2)
ZOOM_SDK_KEY=<paste SDK Key>
ZOOM_SDK_SECRET=<paste SDK Secret>

# Webhook Secret (from Step 3)
ZOOM_WEBHOOK_SECRET=<paste Verification Token>

# Encryption Key (from Step 4)
ZOOM_ENCRYPTION_KEY=<paste generated key>
```

- [ ] All credentials pasted into `.env`
- [ ] No extra spaces or quotes around values
- [ ] `ZOOM_MOCK_MODE=false` (for production)

---

## Step 6: Restart Server

```bash
# Stop server (Ctrl+C)
# Then restart:
cd server
npm start
```

- [ ] Server restarted
- [ ] No Zoom-related errors in logs

---

## Step 7: Test Integration

### Create Test Session:

1. Log in as university user
2. Navigate to Live Sessions → Schedule Class
3. Create a test session with future date/time
4. Check server logs for: `[Zoom] Meeting created successfully`

- [ ] Test session created successfully
- [ ] Meeting ID appears in session details
- [ ] No errors in server logs

### Join Test Session:

1. Navigate to the test session
2. Click "Join Session"
3. Zoom meeting loads in browser

- [ ] Meeting loads successfully
- [ ] Video/audio works
- [ ] Can share screen (if enabled)

---

## Troubleshooting

### ❌ "Zoom API configuration error"

**Fix**: Verify API credentials are correct and app is activated

### ❌ "Failed to generate Zoom SDK signature"

**Fix**: Verify SDK credentials are from Meeting SDK app (not OAuth app)

### ❌ "Invalid signature"

**Fix**: Double-check ZOOM_SDK_SECRET and restart server

### ❌ Webhook not receiving events

**Fix**: Ensure webhook URL is publicly accessible (use ngrok for local dev)

---

## Estimated Time

- **Step 1-2**: 10 minutes
- **Step 3**: 5 minutes (optional)
- **Step 4-7**: 5 minutes

**Total**: ~15-20 minutes

---

## Resources

- 📖 [Full Setup Guide](ZOOM_SETUP_GUIDE.md)
- 📖 [Environment Variables Documentation](server/docs/ENVIRONMENT_VARIABLES.md)
- 🔗 [Zoom Developer Portal](https://marketplace.zoom.us/)
- 🔗 [Zoom API Docs](https://developers.zoom.us/docs/api/)

---

## Status

**Current Status**: ⚠️ Mock Mode Enabled (Testing Only)

**Next Step**: Follow ZOOM_SETUP_GUIDE.md to get real credentials

**Goal**: ✅ Production-Ready Zoom Integration
