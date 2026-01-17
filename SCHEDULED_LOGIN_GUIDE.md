# Scheduled Pre-Login Guide

## Overview
The Scheduled Pre-Login feature allows you to automatically log in to Target at a specific time before high-demand drops, eliminating login delays during critical checkout moments.

---

## Why Use Scheduled Pre-Login?

### The Problem
When high-demand items drop (e.g., limited edition items at 3:00 AM), Target may require you to log in during checkout, causing critical delays that can cost you the item.

### The Solution
**Schedule a pre-emptive login 15-30 minutes before the drop:**
- Your session is already active when items become available
- Zero login delays during checkout
- Maximum speed for securing high-demand items

---

## How to Set Up

### 1. Navigate to Options Page
- Click the extension icon
- Click "Settings" or navigate to Options page
- Go to "General Settings" tab

### 2. Enable Scheduled Pre-Login
Find the **"Scheduled Pre-Login"** section (below Target Account Credentials)

**Required Settings:**
```
☑ Enable Scheduled Pre-Login
```

### 3. Set Your Login Time
```
Login Time: [02:45] (24-hour format)
```
**Examples:**
- `02:45` = 2:45 AM
- `14:30` = 2:30 PM
- `23:55` = 11:55 PM

### 4. Choose Repeat Option
```
☑ Repeat daily (Optional)
```
- **Checked**: Login happens every day at the specified time
- **Unchecked**: Login happens once, then you need to re-enable

### 5. Verify Schedule
Look at the **"Next scheduled login"** display:
```
Next scheduled login: Jan 15, 2:45 AM (Daily)
```

### 6. Save Settings
Click **"Save Settings"** button at the bottom

---

## How It Works

### Timeline Example: Drop at 3:00 AM

```
Time        Action                          Status
────────────────────────────────────────────────────────────
2:45 AM     Scheduled login triggers        ⚡
2:45:00     Extension opens login page      🔄
2:45:02     Auto-fills credentials          🔑
2:45:03     Clicks sign in                  ✓
2:45:05     "Keep me signed in" checked     ✓
2:45:10     Login tab closes                ✓
            Your session is now active!     🎯

3:00 AM     Items drop                      🚨
3:00:00     You click "Add to Cart"         ⚡
3:00:00     Checkout starts INSTANTLY       ⚡
            No login required!              ✓
3:00:02     Order placed!                   🎉
```

### What Happens at Scheduled Time:

1. **Extension activates** at your scheduled time
2. **Opens login page** in a background tab (won't disrupt you)
3. **Auto-fills credentials** using your saved Target account
4. **Completes login** in ~5 seconds
5. **Closes the tab** automatically after 10 seconds
6. **Shows notification** to confirm login completed
7. **Your session persists** for hours (thanks to "Keep me signed in")

---

## Requirements

✅ **Auto-login must be enabled**
   - General Settings → Auto-Login checkbox

✅ **Target credentials must be saved**
   - General Settings → Target Email/Username
   - General Settings → Target Password

✅ **Browser must be running**
   - At the scheduled time
   - Can be minimized/background
   - Cannot be completely closed

---

## Best Practices

### For Single Drops
```
Drop Time:      3:00 AM
Schedule Login: 2:45 AM (15 minutes before)
Repeat Daily:   ☐ Unchecked
```

### For Daily Drops (Same Time)
```
Drop Time:      3:00 AM daily
Schedule Login: 2:45 AM
Repeat Daily:   ☑ Checked
```

### Multiple Drops Same Day
```
If drops occur at different times, schedule for the EARLIEST drop.
Example:
  - Drop 1: 3:00 AM
  - Drop 2: 12:00 PM
  - Schedule: 2:45 AM (your session will still be active at noon)
```

---

## Timing Recommendations

| Drop Time | Recommended Schedule | Reason |
|-----------|---------------------|--------|
| 3:00 AM | 2:45 AM | 15 min buffer |
| 12:00 PM | 11:45 AM | 15 min buffer |
| 6:00 PM | 5:50 PM | 10 min buffer (less critical) |

**Why 15 minutes before?**
- Ensures session is fully established
- Provides buffer for any delays
- Target's sessions typically last hours

---

## Troubleshooting

### Schedule Not Working?

**Check 1: Browser Running?**
- Browser must be open (can be minimized)
- Extension needs to be active

**Check 2: Credentials Saved?**
- Go to General Settings
- Verify email and password are filled

**Check 3: Auto-Login Enabled?**
- Check the auto-login setting in options
- Must be enabled for scheduled login to work

**Check 4: Time Format Correct?**
- Use 24-hour format
- Example: 2:45 AM = `02:45`, not `2:45`

### Login Failed?

**Possible Causes:**
- Incorrect credentials
- Target requires CAPTCHA
- Network issues
- Target website down

**Solution:**
- Verify credentials in options
- Test manual login on Target.com
- Check internet connection
- Try scheduling 5 minutes later

### No Notification?

**Normal Behavior:**
- Some browsers block extension notifications
- Check browser notification settings
- Check system notification settings

**Not a Problem:**
- Login still happens even without notification
- Check Target.com to verify you're logged in

---

## Privacy & Security

### Your Credentials
- ✅ Stored locally in your browser only
- ✅ Never transmitted to any third party
- ✅ Same security as manual login
- ✅ Encrypted by Chrome's storage

### The Login Process
- ✅ Uses Target's official login page
- ✅ Same as manually logging in
- ✅ Respects Target's security policies
- ✅ "Keep me signed in" for persistence

---

## Advanced Tips

### Multiple High-Demand Drops

**Strategy 1: Daily Schedule**
```
Set daily login at 2:45 AM
Session remains active all day
Covers any drops throughout the day
```

**Strategy 2: Manual Trigger**
```
Use scheduled login for overnight drops
Manually log in for daytime drops
Best for unpredictable drop times
```

### Testing Your Schedule

**Before a real drop, test it:**
1. Set schedule for 2 minutes from now
2. Wait and verify:
   - Notification appears
   - Login tab opens and closes
   - You're logged in on Target.com
3. Reset to your actual drop time

### Maximum Efficiency

**Combine with other optimizations:**
- ✅ Fast Mode enabled (default)
- ✅ Auto-submit order enabled
- ✅ Profile configured
- ✅ Discord monitor (if available)
- ✅ Scheduled pre-login

**Result: Sub-3-second checkouts** 🚀

---

## Real-World Example

### Scenario: Limited Edition Drop

**Product:** Limited edition sneakers (100 units, 1000 people competing)
**Drop Time:** January 15, 2025 at 3:00 AM EST

**Your Setup:**
```
Scheduled Login:     2:45 AM
Daily Repeat:        ☑ Yes (in case of surprise restocks)
Auto-Login:          ☑ Enabled
Profile Saved:       ✓ Payment info ready
Fast Mode:           ✓ Enabled
Auto-Submit:         ✓ Enabled
```

**What Happens:**

**2:45 AM:**
- Extension logs you in automatically
- You're still asleep 😴
- Session is active and ready

**3:00 AM:**
- You wake up
- Navigate to product page
- Extension is ON (no delays)
- Click "Add to Cart" → Instant
- Checkout fills automatically
- Order placed in ~2 seconds
- You're in the top 50 (likely secured!) 🎉

**Without Scheduled Login:**
- Login required during checkout
- Even with auto-login: +5 seconds
- Might be rank #100-150 (risky)

---

## FAQ

**Q: Will this drain my battery?**
A: No. Chrome Alarms are lightweight and designed for battery efficiency.

**Q: What if I change my schedule?**
A: Just update the time and save. The extension will reschedule automatically.

**Q: Can I schedule multiple login times?**
A: Currently supports one scheduled time. Use daily repeat for consistency.

**Q: What if Target updates their login page?**
A: The extension uses standard form-filling, which is resilient to minor changes.

**Q: Does this work with 2FA?**
A: Not recommended if you have 2FA enabled. Consider disabling 2FA for this account or manually logging in.

**Q: Can I test without waiting?**
A: Yes! Set a time 2-3 minutes from now, save, and wait for it to trigger.

---

## Summary

### Benefits
✅ **Zero login delays** during checkout
✅ **Set and forget** with daily scheduling
✅ **Automatic session management**
✅ **Maximum competitive advantage**

### Setup Time
⏱️ **2 minutes** to configure

### Maintenance
🔄 **None** - runs automatically

### Result
🎯 **Best possible chance** at securing high-demand items

---

**Remember:** This feature works best when combined with all the speed optimizations already in the extension. Together, they provide the fastest possible checkout experience.

**Good luck with your drops!** 🚀
