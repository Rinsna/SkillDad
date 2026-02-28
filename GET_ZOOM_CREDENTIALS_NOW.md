# 🚀 Get Your Zoom Credentials - Step by Step

## ✅ Current Status

- ✅ Mock mode is ENABLED - you can test the UI now
- ✅ Server running on http://localhost:3030
- ✅ Client running on http://127.0.0.1:5174
- ⚠️ Mock mode only simulates Zoom - no real meetings

## 🎯 Next Step: Get Real Zoom Credentials

Follow this guide to get your real Zoom credentials in ~15 minutes.

---

## Part 1: Create Server-to-Server OAuth App (5 minutes)

### Step 1: Go to Zoom Marketplace

1. Open your browser
2. Go to: **https://marketplace.zoom.us/**
3. Sign in with your Zoom account (or create one if you don't have it)

### Step 2: Create the App

1. Click **"Develop"** in the top menu
2. Click **"Build App"**
3. Select **"Server-to-Server OAuth"**
4. Click **"Create"**

### Step 3: Fill Basic Information

1. **App Name**: `SkillDad Live Sessions API`
2. **Short Description**: `Backend API for managing live educational sessions`
3. **Company Name**: Your company name
4. **Developer Name**: Your name
5. **Developer Email**: Your email
6. Click **"Continue"**

### Step 4: Copy Your API Credentials ⭐ IMPORTANT

You'll see a page with three values. **COPY THESE NOW**:

```
Account ID: _______________________________________________
Client ID: ________________________________________________
Client Secret: ____________________________________________
```

**💡 Tip**: Keep this browser tab open or save these values in a text file!

### Step 5: Add Required Scopes

1. Click **"Scopes"** tab
2. Click **"+ Add Scopes"**
3. Search and add these scopes:
   - ✅ `meeting:write:admin` - Create meetings
   - ✅ `meeting:read:admin` - Read meeting details
   - ✅ `recording:read:admin` - Access recordings
   - ✅ `user:read:admin` - Read user information
4. Click **"Done"**
5. Click **"Continue"**

### Step 6: Activate the App

1. Click **"Activation"** tab
2. Toggle **"Activate your app"** to **ON** (it will turn blue)
3. Click **"Continue"**

✅ **Part 1 Complete!** You now have your API credentials.

---

## Part 2: Create Meeting SDK App (5 minutes)

### Step 1: Create Another App

1. Go back to: **https://marketplace.zoom.us/**
2. Click **"Develop"** → **"Build App"**
3. This time select **"Meeting SDK"** (NOT Server-to-Server OAuth)
4. Click **"Create"**

### Step 2: Fill Basic Information

1. **App Name**: `SkillDad Meeting Embed`
2. **Short Description**: `Frontend SDK for embedding live sessions`
3. **Company Name**: Your company name
4. **Developer Name**: Your name
5. **Developer Email**: Your email
6. Click **"Continue"**

### Step 3: Copy Your SDK Credentials ⭐ IMPORTANT

You'll see a page with two values. **COPY THESE NOW**:

```
SDK Key: __________________________________________________
SDK Secret: _______________________________________________
```

**💡 Tip**: Keep this browser tab open too!

### Step 4: Configure Features

1. Click **"Features"** tab
2. Enable these features:
   - ✅ Video
   - ✅ Audio
   - ✅ Screen Share
   - ✅ Chat
   - ✅ Recording (if you have a paid plan)
3. Click **"Continue"**

✅ **Part 2 Complete!** You now have your SDK credentials.

---

## Part 3: Generate Encryption Key (1 minute)

### Step 1: Open Terminal/PowerShell

1. Open a new terminal window
2. Navigate to your project folder:
   ```bash
   cd C:\Users\dell\Desktop\SkillDad
   ```

### Step 2: Generate the Key

Run this command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

You'll see output like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**COPY THIS VALUE** - this is your encryption key.

✅ **Part 3 Complete!** You have your encryption key.

---

## Part 4: Update Your .env File (3 minutes)

### Step 1: Open .env File

1. Open `server/.env` in your text editor
2. Find the Zoom section (around line 30-60)

### Step 2: Paste Your Credentials

Replace the placeholder values with your actual credentials:

```bash
# IMPORTANT: Set to false to use real Zoom
ZOOM_MOCK_MODE=false

# Paste your API credentials from Part 1
ZOOM_API_KEY=<paste your Client ID here>
ZOOM_API_SECRET=<paste your Client Secret here>
ZOOM_ACCOUNT_ID=<paste your Account ID here>

# Paste your SDK credentials from Part 2
ZOOM_SDK_KEY=<paste your SDK Key here>
ZOOM_SDK_SECRET=<paste your SDK Secret here>

# For now, you can use a placeholder for webhook secret
ZOOM_WEBHOOK_SECRET=placeholder_webhook_secret

# Paste your encryption key from Part 3
ZOOM_ENCRYPTION_KEY=<paste your generated key here>
```

### Step 3: Save the File

1. Save `server/.env`
2. Make sure there are NO spaces around the `=` sign
3. Make sure there are NO quotes around the values

✅ **Part 4 Complete!** Your credentials are configured.

---

## Part 5: Restart Server & Test (2 minutes)

### Step 1: Restart the Server

The server needs to be restarted to load the new credentials.

**I'll do this for you automatically after you update the .env file.**

### Step 2: Test Creating a Session

1. Go to http://127.0.0.1:5174 in your browser
2. Log in as a university user (Uni@gmail.com)
3. Navigate to **"Live Sessions"** → **"Schedule Class"**
4. Fill in:
   - **Topic**: `Test Real Zoom Session`
   - **Start Time**: Select a future date/time (e.g., tomorrow)
   - **Duration**: `60` minutes
5. Click **"Schedule Session"**

### Step 3: Verify Success

Check the server logs. You should see:

```
[Zoom] Meeting created successfully: <meeting_id>
```

If you see this, **congratulations!** Your Zoom integration is working! 🎉

---

## 🆘 Troubleshooting

### Error: "Zoom API configuration error"

**Cause**: Credentials are incorrect or app is not activated

**Fix**:
1. Double-check you copied the credentials correctly
2. Verify your Server-to-Server OAuth app is **activated** (toggle should be ON)
3. Make sure there are no extra spaces in the .env file

### Error: "Failed to generate Zoom SDK signature"

**Cause**: SDK credentials are incorrect

**Fix**:
1. Verify you copied SDK Key and SDK Secret from the **Meeting SDK app** (not the OAuth app)
2. Check for typos in the credentials

### Error: "Invalid signature"

**Cause**: SDK Secret doesn't match

**Fix**:
1. Go back to your Meeting SDK app
2. Copy the SDK Secret again
3. Paste it into ZOOM_SDK_SECRET in .env
4. Restart the server

### Still Having Issues?

1. Check that `ZOOM_MOCK_MODE=false` in your .env
2. Verify all 6 credentials are filled in (not placeholders)
3. Restart the server after making changes
4. Check server logs for detailed error messages

---

## 📋 Credentials Checklist

Use this to track what you've completed:

- [ ] Part 1: Server-to-Server OAuth app created
  - [ ] Account ID copied
  - [ ] Client ID copied
  - [ ] Client Secret copied
  - [ ] Scopes added
  - [ ] App activated

- [ ] Part 2: Meeting SDK app created
  - [ ] SDK Key copied
  - [ ] SDK Secret copied
  - [ ] Features enabled

- [ ] Part 3: Encryption key generated
  - [ ] Key copied

- [ ] Part 4: .env file updated
  - [ ] ZOOM_MOCK_MODE=false
  - [ ] All credentials pasted
  - [ ] File saved

- [ ] Part 5: Server restarted & tested
  - [ ] Server restarted
  - [ ] Test session created
  - [ ] Meeting ID appears in logs

---

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ You can create a session without errors
2. ✅ Server logs show: `[Zoom] Meeting created successfully`
3. ✅ Session details show a Zoom meeting ID
4. ✅ You can click "Join Session" and see the Zoom interface

---

## 📞 Need Help?

If you get stuck:

1. Check the server logs for error messages
2. Verify all credentials are correct (no typos)
3. Make sure both Zoom apps are activated
4. Ensure ZOOM_MOCK_MODE=false in .env

---

## ⏱️ Time Estimate

- Part 1: 5 minutes
- Part 2: 5 minutes
- Part 3: 1 minute
- Part 4: 3 minutes
- Part 5: 2 minutes

**Total: ~15 minutes**

---

## 🔐 Security Reminder

- ✅ Never commit your .env file to Git
- ✅ Keep your credentials secure
- ✅ Don't share your SDK Secret with anyone
- ✅ Use different credentials for dev and production

---

**Ready to start?** Open https://marketplace.zoom.us/ and begin with Part 1!

**Questions?** Let me know and I'll help you through any step.
