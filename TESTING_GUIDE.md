# Testing Guide for Auto-Login Enhancements

## Quick Test Steps

### 1. Test the Manual Login Button

**Steps:**
1. Open Chrome Extension Settings (click the extension icon → Settings)
2. Go to the "General Settings" tab
3. Scroll down to "Target Account Credentials" section
4. Enter your Target email and password
5. Scroll to "Scheduled Pre-Login" section
6. Click the **"Test Auto-Login Now"** button
7. A new tab will open with Target.com/account
8. Watch as the extension:
   - Checks the "Keep me signed in" checkbox
   - Enters your email
   - Clicks "Continue"
   - Enters your password
   - Clicks "Sign in with password"
9. The tab will close automatically after 10 seconds

**Expected Result:** You should be logged into Target.com

### 2. Test Interval-Based Auto-Login

**Steps:**
1. In Settings → General Settings → Scheduled Pre-Login
2. Check ✓ "Enable Interval-Based Auto-Login"
3. Set "Login Interval (minutes)" to a small number like **5** (for testing)
4. Click "Save Settings"
5. Check the "Scheduled login times" display shows "Every 5 minutes"
6. Wait 5 minutes
7. A new tab should automatically open and log you in

**Expected Result:** Login happens automatically every 5 minutes

**Note:** Change to a more reasonable interval like 60+ minutes for production use

### 3. Test Scheduled Login (Existing Feature with New Flow)

**Steps:**
1. In Settings → General Settings → Scheduled Pre-Login
2. Check ✓ "Enable Scheduled Pre-Login"
3. Set "Login Times" to 2 minutes from now (e.g., if it's 14:30, enter "14:32")
4. Click "Save Settings"
5. Wait for the scheduled time
6. A tab should open and log you in automatically

**Expected Result:** Login happens at the scheduled time

### 4. Test the Two-Step Login Flow

**To verify the new login flow is working:**

1. Clear your Target.com cookies first:
   - Open DevTools (F12)
   - Go to Application → Cookies
   - Delete all target.com cookies
2. Use the "Test Auto-Login Now" button
3. Watch the browser console for these log messages:
   ```
   Login page detected, checking auto-login settings
   Auto-login enabled and credentials found, proceeding with login
   Checking for Target.com account page login flow...
   Login flow detection: Step1=true, Step2=false
   Step 1: Entering email and clicking continue
   Checking 'Keep me signed in' checkbox
   Clicking continue button
   Waiting for password field...
   Password field appeared, proceeding to Step 2
   Step 2: Entering password and signing in
   Clicking 'Sign in with password' button
   Auto-login successful!
   ```

### 5. Test Multiple Login Methods Together

**You can enable all three at once:**
1. Scheduled times: "02:45, 14:30"
2. Random hourly: ✓ Enabled
3. Interval-based: ✓ Enabled, 60 minutes

**Expected Result:** All three methods work independently:
- Scheduled logins at 2:45 AM and 2:30 PM
- Random login once per hour
- Interval login every 60 minutes

## Troubleshooting

### Login Not Working?

**Check these items:**
1. ✓ Auto-login is enabled in Settings (Global Settings → "Auto-login to Target account")
2. ✓ Email and password are saved in Target Account Credentials
3. ✓ Browser is open when scheduled login should trigger
4. ✓ Extension is not disabled

### Check Console Logs

Open the extension's background console:
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Find "Polar Assist Bot v3.5 FREE"
4. Click "service worker" to open the background console
5. Look for login-related messages

### Password Field Not Appearing?

If Step 1 works but Step 2 doesn't:
- Check if Target.com changed their login flow
- Try manually clicking continue to see what happens
- Check browser console for errors

### Tab Doesn't Close?

The tab auto-closes after 10 seconds. If it doesn't:
- The login might have taken longer than expected
- You can close it manually
- Check if there were any errors in the console

## Success Indicators

**You'll know it's working when:**
1. ✓ "Test Auto-Login Now" button opens a tab and logs you in
2. ✓ Console shows "Auto-login successful!"
3. ✓ You see your name/account in Target.com header
4. ✓ "Keep me signed in" stays checked
5. ✓ Session persists across browser restarts

## Configuration Examples

### For Daily Drops at 3 AM
```
Scheduled Pre-Login: ✓ Enabled
Login Times: 02:45
Repeat daily: ✓ Checked
```

### For Frequent Checking Throughout Day
```
Interval-Based Auto-Login: ✓ Enabled
Login Interval: 120 minutes (every 2 hours)
```

### For Random/Stealthy Login Pattern
```
Random Hourly Pre-Login: ✓ Enabled
(Logs in once per hour at a random minute)
```

## Performance Notes

- Login takes 3-5 seconds on average
- Tab auto-closes after 10 seconds
- Session typically lasts several hours (Target.com dependent)
- "Keep me signed in" checkbox is critical for session persistence

## Privacy & Security

- Credentials are stored locally in your browser only
- Never transmitted to any third party
- Uses Target.com's official login page
- Same security as manual login
- Extension cannot access credentials from other sites

## Next Steps

1. Test the manual login button first
2. Verify the two-step flow works correctly
3. Set up your preferred schedule (interval, scheduled, or random)
4. Monitor for a day to ensure it works reliably
5. Adjust timing as needed for your use case

## Need Help?

If you encounter issues:
1. Check console logs for error messages
2. Verify credentials are correct
3. Try manually logging in to ensure Target.com is accessible
4. Clear cookies and try again
5. Report issues with console log screenshots
