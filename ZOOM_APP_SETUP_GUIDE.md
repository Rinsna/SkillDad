# Zoom App Setup Guide - Step-by-Step

This guide will walk you through creating the three Zoom apps needed for your SkillDad platform.

---

## Prerequisites

- Zoom account (free or paid)
- Admin access to create apps
- Your production domain (e.g., `skilldad.com`)

---

## App 1: Server-to-Server OAuth App

**Purpose**: Allows your backend to create and manage Zoom meetings via API

### Step 1.1: Create the App

1. Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click **"Develop"** in the top menu
3. Click **"Build App"**
4. Select **"Server-to-Server OAuth"**
5. Click **"Create"**

### Step 1.2: Basic Information

Fill in the app details:

```
App Name: SkillDad Live Sessions
Short Description: Server-to-Server OAuth app for managing live educational sessions
Company Name: [Your Company Name]
Developer Name: [Your Name]
Developer Email: [Your Email]
```

Click **"Continue"**

### Step 1.3: App Credentials

You'll see three important credentials. **Copy these immediately**:

```
Account ID: [Copy this - you'll need it as ZOOM_ACCOUNT_ID]
Client ID: [Copy this - you'll need it as ZOOM_API_KEY]
Client Secret: [Copy this - you'll need it as ZOOM_API_SECRET]
```

**Save these in a secure location!**

Click **"Continue"**

### Step 1.4: Information

Fill in additional information:

```
Short Description: Manages live educational sessions and recordings
Long Description: This app enables SkillDad platform to create Zoom meetings for live classes, manage recordings, and provide seamless educational experiences.

Developer Contact Information:
- Name: [Your Name]
- Email: [Your Email]
```

Click **"Continue"**

### Step 1.5: Feature (Scopes)

Add the following scopes by clicking **"+ Add Scopes"**:

**Required Scopes:**
- ✅ `meeting:read:admin` - View and manage all user meetings
- ✅ `meeting:write:admin` - Create meetings on behalf of users
- ✅ `recording:read:admin` - View all user recordings
- ✅ `user:read:admin` - View all user information

Click **"Continue"**

### Step 1.6: Activation

Review your app settings and click **"Activate your app"**

✅ **App 1 Complete!** Save your credentials:
```
ZOOM_ACCOUNT_ID=[Account ID from Step 1.3]
ZOOM_API_KEY=[Client ID from Step 1.3]
ZOOM_API_SECRET=[Client Secret from Step 1.3]
```

---

## App 2: Meeting SDK App

**Purpose**: Allows embedding Zoom meetings directly in your web application

### Step 2.1: Create the App

1. Go back to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click **"Develop"** → **"Build App"**
3. Select **"Meeting SDK"**
4. Click **"Create"**

### Step 2.2: Basic Information

Fill in the app details:

```
App Name: SkillDad Embedded Meetings
Short Description: Meeting SDK for embedding live sessions in SkillDad platform
Company Name: [Your Company Name]
Developer Name: [Your Name]
Developer Email: [Your Email]
```

Click **"Continue"**

### Step 2.3: App Credentials

You'll see two important credentials. **Copy these immediately**:

```
SDK Key (Client ID): [Copy this - you'll need it as ZOOM_SDK_KEY]
SDK Secret (Client Secret): [Copy this - you'll need it as ZOOM_SDK_SECRET]
```

**Save these in a secure location!**

Click **"Continue"**

### Step 2.4: Features

Select the features you need:

**Required Features:**
- ✅ In-meeting chat
- ✅ Screen sharing
- ✅ Recording (local and cloud)
- ✅ Participant video
- ✅ Participant audio

Click **"Continue"**

### Step 2.5: Activation

Review your app settings and click **"Activate your app"**

✅ **App 2 Complete!** Save your credentials:
```
ZOOM_SDK_KEY=[SDK Key from Step 2.3]
ZOOM_SDK_SECRET=[SDK Secret from Step 2.3]
```

---

## App 3: Webhook App

**Purpose**: Receives notifications when recordings are ready

### Step 3.1: Create the App

1. Go back to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click **"Develop"** → **"Build App"**
3. Select **"Webhook Only"**
4. Click **"Create"**

### Step 3.2: Basic Information

Fill in the app details:

```
App Name: SkillDad Recording Webhooks
Short Description: Webhook app for receiving recording completion notifications
Company Name: [Your Company Name]
Developer Name: [Your Name]
Developer Email: [Your Email]
```

Click **"Continue"**

### Step 3.3: Feature - Event Subscriptions

This is the most important part!

#### 3.3.1: Add Event Subscription

1. Click **"+ Add Event Subscription"**
2. Enter subscription name: `Recording Notifications`

#### 3.3.2: Event Notification Endpoint URL

**IMPORTANT**: This must be your production HTTPS URL

```
Event notification endpoint URL: https://your-domain.com/api/webhooks/zoom
```

**Replace `your-domain.com` with your actual domain!**

Examples:
- `https://api.skilldad.com/api/webhooks/zoom`
- `https://skilldad.com/api/webhooks/zoom`

**Note**: 
- Must use HTTPS (not HTTP)
- Your server must be running and accessible
- Zoom will send a validation request to verify the endpoint

#### 3.3.3: Validate Endpoint

When you enter the URL, Zoom will send a validation request. Your server must respond correctly.

**If validation fails:**
1. Make sure your server is running
2. Verify the URL is correct and accessible
3. Check that your webhook endpoint is implemented
4. Look at server logs for errors

#### 3.3.4: Subscribe to Events

Click **"Add events"** and select:

**Required Event:**
- ✅ `recording.completed` - All Recordings have completed

This event is triggered when Zoom finishes processing a cloud recording.

Click **"Done"**

### Step 3.4: Secret Token

After adding the event subscription, you'll see a **Secret Token**. **Copy this immediately**:

```
Secret Token: [Copy this - you'll need it as ZOOM_WEBHOOK_SECRET]
```

**Save this in a secure location!**

### Step 3.5: Activation

Click **"Continue"** and then **"Activate your app"**

✅ **App 3 Complete!** Save your credential:
```
ZOOM_WEBHOOK_SECRET=[Secret Token from Step 3.4]
```

---

## Summary: All Credentials

You should now have **7 credentials**:

```bash
# From App 1 (Server-to-Server OAuth)
ZOOM_ACCOUNT_ID=abc123...
ZOOM_API_KEY=xyz789...
ZOOM_API_SECRET=secret123...

# From App 2 (Meeting SDK)
ZOOM_SDK_KEY=sdk456...
ZOOM_SDK_SECRET=sdksecret789...

# From App 3 (Webhook)
ZOOM_WEBHOOK_SECRET=webhook_secret_abc...

# Generate this yourself (see below)
ZOOM_ENCRYPTION_KEY=...
```

---

## Generate Encryption Key

Run this command to generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output as your `ZOOM_ENCRYPTION_KEY`.

---

## Update Your .env File

Now update your `server/.env` file with all the credentials:

```bash
# Zoom API Credentials (from App 1)
ZOOM_API_KEY=your_client_id_here
ZOOM_API_SECRET=your_client_secret_here
ZOOM_ACCOUNT_ID=your_account_id_here

# Zoom SDK Credentials (from App 2)
ZOOM_SDK_KEY=your_sdk_key_here
ZOOM_SDK_SECRET=your_sdk_secret_here

# Zoom Webhook Secret (from App 3)
ZOOM_WEBHOOK_SECRET=your_webhook_secret_here

# Zoom Encryption Key (generated)
ZOOM_ENCRYPTION_KEY=your_32_character_key_here

# Disable mock mode for production
ZOOM_MOCK_MODE=false
```

---

## Troubleshooting

### Webhook Validation Fails

**Problem**: Zoom says "Validation failed" when adding webhook URL

**Solutions**:
1. Ensure your server is running and accessible from the internet
2. Verify the URL is correct (check for typos)
3. Make sure you're using HTTPS (not HTTP)
4. Check server logs for incoming requests
5. Verify your webhook endpoint is implemented correctly

**Test your endpoint manually**:
```bash
curl -X POST https://your-domain.com/api/webhooks/zoom \
  -H "Content-Type: application/json" \
  -d '{"event":"endpoint.url_validation","payload":{"plainToken":"test"}}'
```

### Can't Find Credentials

**Problem**: Can't find where to copy credentials

**Solution**: 
- For Server-to-Server OAuth: Go to app → "App Credentials" tab
- For Meeting SDK: Go to app → "App Credentials" tab
- For Webhook: Go to app → "Feature" tab → View secret token

### App Not Activating

**Problem**: Can't activate the app

**Solution**:
1. Make sure all required fields are filled
2. For Server-to-Server OAuth: Ensure scopes are added
3. For Webhook: Ensure event subscription is validated
4. Check for any error messages on the page

---

## Next Steps

After completing this setup:

1. ✅ Update your `.env` file with all credentials
2. ⏭️ Move to Step 2: Configure Environment Variables
3. ⏭️ Move to Step 3: Create Database Indexes
4. ⏭️ Move to Step 4: Test the Integration

---

## Security Notes

⚠️ **IMPORTANT**:
- Never commit credentials to version control
- Keep `.env` file in `.gitignore`
- Use different credentials for development/staging/production
- Rotate credentials every 90 days
- Store production credentials in a secure vault

---

## Support Resources

- [Zoom Server-to-Server OAuth Docs](https://developers.zoom.us/docs/internal-apps/s2s-oauth/)
- [Zoom Meeting SDK Docs](https://developers.zoom.us/docs/meeting-sdk/)
- [Zoom Webhook Docs](https://developers.zoom.us/docs/api/rest/webhook-reference/)

---

**Setup Complete!** 🎉

You now have all three Zoom apps configured and ready to use.
