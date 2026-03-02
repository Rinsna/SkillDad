# Zoom Meeting Connection Debug Guide

## Issue
Both "Host Link" and "Enter Studio" buttons show "Connecting to meeting..." but never connect to the Zoom meeting.

## Current Status
- Host Link generates correct URL: `http://localhost:5173/host-room/{sessionId}?token={jwt}`
- HostRoom page loads successfully and shows session title
- ZoomMeeting component is stuck on "Connecting to meeting..."
- Zoom SDK is not connecting

## Diagnosis Steps

### Step 1: Check Browser Console
Open the browser console (F12) and look for:
1. JavaScript errors when "Connecting to meeting..." appears
2. Network requests to `/api/sessions/:id/zoom-config`
3. Any Zoom SDK errors

### Step 2: Check Server Logs
Look for:
1. Requests to `/api/sessions/:id/zoom-config` endpoint
2. Any errors in signature generation
3. Zoom API authentication errors

### Step 3: Verify Zoom App Configuration
In Zoom Marketplace (https://marketplace.zoom.us/):
1. Go to your Meeting SDK app
2. Check "App Credentials" section:
   - SDK Key should match `ZOOM_SDK_KEY` in `.env`
   - SDK Secret should match `ZOOM_SDK_SECRET` in `.env`
3. Check "Feature" section → "Embedded" → "Add domain":
   - Add `localhost:5173` (for local development)
   - Add your production domain (for production)

### Step 4: Test SDK Config Endpoint Manually
Use curl or Postman to test the endpoint:

```bash
# Get the token from the host link URL
TOKEN="your_jwt_token_here"

# Test the endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3030/api/sessions/{sessionId}/zoom-config
```

Expected response:
```json
{
  "sdkKey": "QO98odr6TXuwlblSifxyzg",
  "meetingNumber": "123456789",
  "passWord": "decrypted_passcode",
  "signature": "jwt_signature",
  "userName": "User Name",
  "userEmail": "user@example.com",
  "role": 1,
  "leaveUrl": "http://localhost:5173/sessions/{sessionId}"
}
```

## Potential Issues

### Issue 1: Token Not Being Passed Correctly
**Problem**: ZoomMeeting component gets token from localStorage, but HostRoom passes token via URL

**Solution**: Update ZoomMeeting to accept token as prop from HostRoom

### Issue 2: Zoom SDK Domain Not Whitelisted
**Problem**: Zoom Meeting SDK app doesn't have `localhost:5173` in allowed domains

**Solution**: Add domain in Zoom Marketplace → Meeting SDK app → Feature → Embedded → Add domain

### Issue 3: SDK Signature Generation Failing
**Problem**: Signature generation might be failing silently

**Solution**: Add debug logging to see signature generation process

### Issue 4: CORS Issues
**Problem**: Browser blocking requests to Zoom SDK

**Solution**: Check browser console for CORS errors

## Quick Fixes to Try

### Fix 1: Update ZoomMeeting Component to Accept Token Prop
The HostRoom component has the token from URL, but ZoomMeeting tries to get it from localStorage.

### Fix 2: Add Debug Logging
Add console.log statements to see where the connection is failing:
- Before fetching SDK config
- After receiving SDK config
- Before SDK initialization
- After SDK initialization
- Before joining meeting
- After joining meeting

### Fix 3: Check Zoom SDK CDN
Verify that the Zoom SDK is loading correctly from CDN. Check network tab for:
- `@zoom/meetingsdk` package loading
- Any 404 or network errors

## Next Steps
1. Check browser console for errors
2. Check server logs for `/zoom-config` requests
3. Verify Zoom app domain whitelist
4. Test SDK config endpoint manually
5. Add debug logging to ZoomMeeting component
