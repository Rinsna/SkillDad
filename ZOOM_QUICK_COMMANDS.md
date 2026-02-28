# Zoom Integration - Quick Commands

## 🚀 One-Command Solutions

### Enable Mock Mode (Testing Only)

```bash
# Windows (PowerShell)
(Get-Content server\.env) -replace 'ZOOM_MOCK_MODE=false', 'ZOOM_MOCK_MODE=true' | Set-Content server\.env

# Linux/Mac
sed -i 's/ZOOM_MOCK_MODE=false/ZOOM_MOCK_MODE=true/g' server/.env
```

### Disable Mock Mode (Use Real Zoom)

```bash
# Windows (PowerShell)
(Get-Content server\.env) -replace 'ZOOM_MOCK_MODE=true', 'ZOOM_MOCK_MODE=false' | Set-Content server\.env

# Linux/Mac
sed -i 's/ZOOM_MOCK_MODE=true/ZOOM_MOCK_MODE=false/g' server/.env
```

### Generate Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Check Current Zoom Mode

```bash
# Windows (PowerShell)
Select-String -Path server\.env -Pattern "ZOOM_MOCK_MODE"

# Linux/Mac
grep "ZOOM_MOCK_MODE" server/.env
```

### Restart Server

```bash
cd server
npm start
```

### Test Zoom Configuration

```bash
# Check if credentials are set (Windows PowerShell)
Select-String -Path server\.env -Pattern "ZOOM_" | Select-String -NotMatch "your_zoom"

# Check if credentials are set (Linux/Mac)
grep "ZOOM_" server/.env | grep -v "your_zoom"
```

---

## 📝 Quick Setup Workflow

### For Testing (Mock Mode):

```bash
# 1. Enable mock mode
(Get-Content server\.env) -replace 'ZOOM_MOCK_MODE=false', 'ZOOM_MOCK_MODE=true' | Set-Content server\.env

# 2. Restart server
cd server
npm start
```

### For Production (Real Zoom):

```bash
# 1. Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Edit .env and paste your credentials
notepad server\.env  # Windows
nano server/.env     # Linux/Mac

# 3. Disable mock mode
(Get-Content server\.env) -replace 'ZOOM_MOCK_MODE=true', 'ZOOM_MOCK_MODE=false' | Set-Content server\.env

# 4. Restart server
cd server
npm start
```

---

## 🔍 Verification Commands

### Check Server Logs for Zoom Errors

```bash
# Windows (PowerShell) - watch logs in real-time
Get-Content server\logs\app.log -Wait | Select-String "Zoom"

# Linux/Mac - watch logs in real-time
tail -f server/logs/app.log | grep "Zoom"
```

### Test Zoom API Connection

```bash
# Create a test script
node -e "
const axios = require('axios');
const token = 'YOUR_JWT_TOKEN_HERE';
axios.get('http://localhost:3030/api/sessions', {
  headers: { Authorization: 'Bearer ' + token }
}).then(r => console.log('✅ API working')).catch(e => console.log('❌ Error:', e.message));
"
```

---

## 🛠️ Troubleshooting Commands

### Clear Redis Cache (if Zoom config is cached)

```bash
# Connect to Redis
redis-cli

# Clear all cache
FLUSHALL

# Exit
exit
```

### Check Environment Variables are Loaded

```bash
# Windows (PowerShell)
node -e "console.log('ZOOM_MOCK_MODE:', process.env.ZOOM_MOCK_MODE)"

# Linux/Mac
node -e "console.log('ZOOM_MOCK_MODE:', process.env.ZOOM_MOCK_MODE)"
```

### Validate .env File Format

```bash
# Check for common issues (Windows PowerShell)
Select-String -Path server\.env -Pattern "ZOOM_" | ForEach-Object { 
  if ($_.Line -match '\s=\s') { 
    Write-Host "⚠️ Warning: Space around = in line: $($_.Line)" 
  }
}

# Check for common issues (Linux/Mac)
grep "ZOOM_" server/.env | grep " = " && echo "⚠️ Warning: Spaces around ="
```

---

## 📊 Status Check Commands

### Quick Status Check

```bash
# Windows (PowerShell)
Write-Host "=== Zoom Configuration Status ===" -ForegroundColor Cyan
$mockMode = Select-String -Path server\.env -Pattern "ZOOM_MOCK_MODE=(\w+)" | ForEach-Object { $_.Matches.Groups[1].Value }
Write-Host "Mock Mode: $mockMode" -ForegroundColor $(if ($mockMode -eq "true") { "Yellow" } else { "Green" })

$hasRealCreds = (Select-String -Path server\.env -Pattern "ZOOM_API_KEY=(?!your_zoom)" -Quiet)
Write-Host "Real Credentials: $(if ($hasRealCreds) { '✅ Configured' } else { '❌ Not Configured' })" -ForegroundColor $(if ($hasRealCreds) { "Green" } else { "Red" })
```

### Detailed Configuration Check

```bash
# Check all Zoom variables (Windows PowerShell)
@(
  "ZOOM_MOCK_MODE",
  "ZOOM_API_KEY",
  "ZOOM_API_SECRET",
  "ZOOM_ACCOUNT_ID",
  "ZOOM_SDK_KEY",
  "ZOOM_SDK_SECRET",
  "ZOOM_WEBHOOK_SECRET",
  "ZOOM_ENCRYPTION_KEY"
) | ForEach-Object {
  $value = Select-String -Path server\.env -Pattern "$_=" | Select-Object -First 1
  $isPlaceholder = $value -match "your_zoom"
  $status = if ($isPlaceholder) { "❌ Placeholder" } else { "✅ Set" }
  Write-Host "$_`: $status"
}
```

---

## 🔄 Common Workflows

### Switch from Mock to Real Zoom

```bash
# 1. Disable mock mode
(Get-Content server\.env) -replace 'ZOOM_MOCK_MODE=true', 'ZOOM_MOCK_MODE=false' | Set-Content server\.env

# 2. Verify credentials are set
Select-String -Path server\.env -Pattern "ZOOM_API_KEY" | Select-String -NotMatch "your_zoom"

# 3. Restart server
cd server
npm start

# 4. Check logs for errors
Get-Content server\logs\app.log -Wait | Select-String "Zoom"
```

### Switch from Real Zoom to Mock

```bash
# 1. Enable mock mode
(Get-Content server\.env) -replace 'ZOOM_MOCK_MODE=false', 'ZOOM_MOCK_MODE=true' | Set-Content server\.env

# 2. Restart server
cd server
npm start

# 3. Verify mock mode is active (should see this in logs)
# [Zoom] ⚠️  MOCK MODE ENABLED - Using mock Zoom implementations for development
```

---

## 📦 Backup & Restore

### Backup Current Configuration

```bash
# Windows (PowerShell)
Copy-Item server\.env server\.env.backup

# Linux/Mac
cp server/.env server/.env.backup
```

### Restore Configuration

```bash
# Windows (PowerShell)
Copy-Item server\.env.backup server\.env

# Linux/Mac
cp server/.env.backup server/.env
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Enable mock mode | `(Get-Content server\.env) -replace 'ZOOM_MOCK_MODE=false', 'ZOOM_MOCK_MODE=true' \| Set-Content server\.env` |
| Disable mock mode | `(Get-Content server\.env) -replace 'ZOOM_MOCK_MODE=true', 'ZOOM_MOCK_MODE=false' \| Set-Content server\.env` |
| Generate encryption key | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| Check current mode | `Select-String -Path server\.env -Pattern "ZOOM_MOCK_MODE"` |
| Restart server | `cd server; npm start` |
| View Zoom logs | `Get-Content server\logs\app.log -Wait \| Select-String "Zoom"` |

---

**Note**: Commands shown are for Windows PowerShell. For Linux/Mac, use the bash equivalents shown in each section.
