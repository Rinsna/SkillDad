# Zoom Integration Setup Guide

## Quick Start - Get Your Zoom Credentials

This guide will help you set up real Zoom credentials for your SkillDad platform in **under 15 minutes**.

---

## Prerequisites

- A Zoom account (free or paid)
- Access to [Zoom App Marketplace](https://marketplace.zoom.us/)

---

## Step 1: Create Server-to-Server OAuth App (API Credentials)

This app allows your backend to create and manage Zoom meetings.

### 1.1 Create the App

1. Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click **"Develop"** in the top menu
3. Click **"Build App"**
4. Select **"Server-to-Server OAuth"**
5. Click **"Create"**

### 1.2 Configure Basic Information

1. **App Name**: `SkillDad Live Sessions` (or any name you prefer)
2. **Short Description**: `Backend API for managing live educational sessions`
3. **Company Name**: Your company name
4. **Developer Contact**: Your email
5. Click **"Continue"**

### 1.3 Get Your API Credentials

You'll see three important values:

- **Account ID**: Copy this value
- **Client ID**: Copy this value (this is your `ZOOM_API_KEY`)
- **Client Secret**: Copy this value (this is your `ZOOM_API_SECRET`)

**Save these values - you'll need them for your .env file!**

### 1.4 Add Scopes

1. Click **"Scopes"** tab
2. Add the following scopes:
   - `meeting:write:admin` - Create meetings
   - `meeting:read:admin` - Read meeting details
   - `recording:read:admin` - Access recordings
   - `user:read:admin` - Read user information

3. Click **"Continue"**

### 1.5 Activate the App

1. Click **"Activation"** tab
2. Toggle **"Activate your app"** to ON
3. Click **"Continue"**

✅ **Done!** You now have your API credentials.

---

## Step 2: Create Meeting SDK App (SDK Credentials)

This app allows your frontend to embed Zoom meetings directly in the browser.

### 2.1 Create the App

1. Go back to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click **"Develop"** → **"Build App"**
3. Select **"Meeting SDK"**
4. Click **"Create"**

### 2.2 Configure Basic Information

1. **App Name**: `SkillDad Meeting Embed` (or any name you prefer)
2. **Short Description**: `Frontend SDK for embedding live sessions`
3. **Company Name**: Your company name
4. **Developer Contact**: Your email
5. Click **"Continue"**

### 2.3 Get Your SDK Credentials

You'll see two important values:

- **SDK Key**: Copy this value (this is your `ZOOM_SDK_KEY`)
- **SDK Secret**: Copy this value (this is your `ZOOM_SDK_SECRET`)

**Save these values - you'll need them for your .env file!**

### 2.4 Configure App Features

1. Click **"Features"** tab
2. Enable the following features:
   - ✅ Video
   - ✅ Audio
   - ✅ Screen Share
   - ✅ Chat
   - ✅ Recording (if you have a paid plan)

3. Click **"Continue"**

✅ **Done!** You now have your SDK credentials.

---

## Step 3: Set Up Webhooks (Optional but Recommended)

Webhooks notify your backend when recordings are ready.

### 3.1 Configure Webhook in Zoom

1. Go to your **Server-to-Server OAuth app** (from Step 1)
2. Click **"Feature"** tab
3. Click **"Add Event Subscription"**
4. **Event Subscription Name**: `Recording Notifications`
5. **Event notification endpoint URL**: `https://your-domain.com/api/webhooks/zoom`
   - Replace `your-domain.com` with your actual domain
   - For local development, use a tool like [ngrok](https://ngrok.com/) to expose your local server

6. **Event types**: Select the following:
   - `recording.completed` - When a recording is ready
   - `recording.transcript_completed` - When transcript is ready (optional)

7. **Verification Token**: Copy this value (this is your `ZOOM_WEBHOOK_SECRET`)

8. Click **"Save"**

✅ **Done!** Webhooks are configured.

---

## Step 4: Update Your .env File

Now that you have all your credentials, update your `server/.env` file:

```bash
# ============================================
# ZOOM INTEGRATION (Live Sessions)
# ============================================

# Zoom API Credentials (from Server-to-Server OAuth app)
ZOOM_API_KEY=<paste your Client ID here>
ZOOM_API_SECRET=<paste your Client Secret here>
ZOOM_ACCOUNT_ID=<paste your Account ID here>

# Zoom SDK Credentials (from Meeting SDK app)
ZOOM_SDK_KEY=<paste your SDK Key here>
ZOOM_SDK_SECRET=<paste your SDK Secret here>

# Zoom Webhook Secret (from webhook configuration)
ZOOM_WEBHOOK_SECRET=<paste your Verification Token here>

# Zoom Encryption Key (generate a random 32+ character string)
ZOOM_ENCRYPTION_KEY=<generate a random 32+ character string>
```

### Generate Encryption Key

You can generate a secure encryption key using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `ZOOM_ENCRYPTION_KEY`.

---

## Step 5: Restart Your Server

After updating the `.env` file:

1. Stop your server (Ctrl+C)
2. Restart it:
   ```bash
   cd server
   npm start
   ```

3. Check the logs for any Zoom-related errors

---

## Step 6: Test Your Integration

### 6.1 Create a Test Session

1. Log in to your SkillDad platform as a university user
2. Navigate to **"Live Sessions"** → **"Schedule Class"**
3. Fill in the session details:
   - Topic: `Test Zoom Session`
   - Start Time: Select a future date/time
   - Duration: `60` minutes
4. Click **"Schedule Session"**

### 6.2 Verify Meeting Creation

Check your server logs. You should see:

```
[Zoom] Session: <session_id>, Operation: create_meeting, Attempt: 1/3
[Zoom] Meeting created successfully: <meeting_id>
```

If you see errors, check the [Troubleshooting](#troubleshooting) section below.

### 6.3 Join the Meeting

1. Navigate to the session you just created
2. Click **"Join Session"**
3. The Zoom meeting should load in your browser

---

## Troubleshooting

### Error: "Zoom API configuration error"

**Cause**: Missing or invalid API credentials

**Solution**:
1. Verify `ZOOM_API_KEY`, `ZOOM_API_SECRET`, and `ZOOM_ACCOUNT_ID` are set correctly
2. Ensure there are no extra spaces or quotes around the values
3. Verify your Server-to-Server OAuth app is activated

### Error: "Failed to generate Zoom SDK signature"

**Cause**: Missing or invalid SDK credentials

**Solution**:
1. Verify `ZOOM_SDK_KEY` and `ZOOM_SDK_SECRET` are set correctly
2. Ensure you're using credentials from a **Meeting SDK app**, not Server-to-Server OAuth

### Error: "Invalid signature"

**Cause**: SDK Secret mismatch

**Solution**:
1. Double-check your `ZOOM_SDK_SECRET` matches the value in your Zoom Meeting SDK app
2. Restart your server after updating the `.env` file

### Error: "Meeting not found" or "Invalid meeting number"

**Cause**: Meeting creation failed or meeting ID is incorrect

**Solution**:
1. Check server logs for meeting creation errors
2. Verify your API credentials have the `meeting:write:admin` scope
3. Ensure your Zoom account is active

### Webhook Not Working

**Cause**: Webhook URL not accessible or verification failed

**Solution**:
1. Ensure your webhook URL is publicly accessible (use ngrok for local development)
2. Verify `ZOOM_WEBHOOK_SECRET` matches the verification token in your Zoom app
3. Check webhook logs in your Zoom app dashboard

---

## Security Best Practices

1. **Never commit credentials to Git**
   - Ensure `.env` is in your `.gitignore`
   - Use `.env.example` as a template

2. **Use different credentials for development and production**
   - Create separate Zoom apps for dev and prod
   - Never use production credentials in development

3. **Rotate credentials regularly**
   - Update SDK credentials every 90 days
   - Regenerate secrets if compromised

4. **Restrict API scopes**
   - Only enable the scopes you actually need
   - Review and remove unused scopes

5. **Monitor usage**
   - Check Zoom app dashboard for unusual activity
   - Set up alerts for API rate limits

---

## Additional Resources

- [Zoom Server-to-Server OAuth Documentation](https://developers.zoom.us/docs/internal-apps/s2s-oauth/)
- [Zoom Meeting SDK Documentation](https://developers.zoom.us/docs/meeting-sdk/web/)
- [Zoom Webhook Documentation](https://developers.zoom.us/docs/api/rest/webhook-reference/)
- [Zoom API Rate Limits](https://developers.zoom.us/docs/api/rest/rate-limits/)

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [Zoom Developer Forum](https://devforum.zoom.us/)
2. Review server logs for detailed error messages
3. Verify all credentials are correctly copied (no extra spaces)
4. Ensure your Zoom account is active and in good standing

---

**Setup Time**: ~10-15 minutes
**Last Updated**: February 2026
