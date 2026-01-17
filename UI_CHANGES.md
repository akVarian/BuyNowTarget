# UI Changes - Visual Guide

## Options Page - New Elements Added

### Location: Options → General Settings → Scheduled Pre-Login Section

---

## 1. Test Auto-Login Button

**New Element:**
```
┌────────────────────────────────────────────────────┐
│ [Test Auto-Login Now]                              │
│ Opens Target.com/account in a new tab to test     │
│ the login process                                  │
└────────────────────────────────────────────────────┘
```

**Appearance:**
- Button style: Secondary (gray)
- Location: Below the "Scheduled login times" display
- Help text: "Opens Target.com/account in a new tab to test the login process"

**Function:**
- Click to immediately test login
- Opens new background tab
- Completes full login flow
- Shows success/error message

---

## 2. Interval-Based Auto-Login Section

**New Elements:**
```
────────────────────────────────────────────────────────

☐ Enable Interval-Based Auto-Login
  Automatically login every X minutes

Login Interval (minutes) [     60     ]
  How often to automatically trigger login (1-1440 minutes)
```

**Components:**
- Checkbox: "Enable Interval-Based Auto-Login"
- Number input: "Login Interval (minutes)"
  - Min: 1 minute
  - Max: 1440 minutes (24 hours)
  - Default: 60 minutes
- Help text for both elements

**Location:**
- Below "Random Hourly Pre-Login" section
- Above "Scheduled login times" display

---

## 3. Enhanced Scheduled Login Times Display

**Updated Display:**
```
┌────────────────────────────────────────────────────┐
│ Scheduled login times: Jan 15, 2:45 AM (Daily) |  │
│ Random hourly: 3:15 PM, 4:27 PM, 5:43 PM |       │
│ Every 60 minutes                                   │
└────────────────────────────────────────────────────┘
```

**Shows:**
- Scheduled times (if enabled)
- Random hourly schedule (if enabled)
- Interval setting (if enabled)
- All three can display simultaneously

---

## Complete Section Layout

```
┌─────────────────────────────────────────────────────────┐
│ Scheduled Pre-Login                                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ℹ Pre-emptive Login: Schedule times to automatically   │
│   log in to Target before high-demand drops. This      │
│   ensures your session is active when items become     │
│   available, eliminating login delays during checkout. │
│                                                          │
│ ☑ Enable Scheduled Pre-Login                           │
│                                                          │
│ Login Times (24-hour format, comma-separated)          │
│ [ 02:45, 04:00, 18:30                            ]     │
│   Example: 02:45, 04:00, 18:30 (for 2:45 AM, etc.)    │
│                                                          │
│ ☑ Repeat daily                                          │
│   Automatically schedule logins every day at the       │
│   specified times                                       │
│                                                          │
│ ─────────────────────────────────────────────────────  │
│                                                          │
│ ☑ Enable Random Hourly Pre-Login                       │
│   Login once per hour at a random minute (0-59) to     │
│   avoid looking suspicious                              │
│                                                          │
│ ─────────────────────────────────────────────────────  │
│                                                          │
│ ☑ Enable Interval-Based Auto-Login                     │
│   Automatically login every X minutes                   │
│                                                          │
│ Login Interval (minutes) [   60   ]                    │
│   How often to automatically trigger login             │
│   (1-1440 minutes)                                      │
│                                                          │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Scheduled login times: Jan 15, 2:45 AM (Daily) │   │
│ │ | Random hourly: 3:15 PM, 4:27 PM, 5:43 PM |    │   │
│ │ Every 60 minutes                                │   │
│ └─────────────────────────────────────────────────┘   │
│                                                          │
│ [Test Auto-Login Now]                                   │
│   Opens Target.com/account in a new tab to test the    │
│   login process                                         │
│                                                          │
│ [Save Settings]                                         │
└─────────────────────────────────────────────────────────┘
```

---

## User Interaction Flow

### Testing Login:
1. User clicks "Test Auto-Login Now"
2. Success message appears: "Opening Target.com/account for login test..."
3. New tab opens in background
4. Login completes automatically
5. Tab closes after 10 seconds
6. Message updates: "Test login initiated! Check the new tab."

### Setting Up Interval Login:
1. User checks "Enable Interval-Based Auto-Login"
2. User enters number in "Login Interval (minutes)" (e.g., 60)
3. User clicks "Save Settings"
4. Success message: "Global settings saved successfully!"
5. Display updates: "Every 60 minutes"
6. Background script schedules first login

### Viewing Active Schedules:
The "Scheduled login times" display shows all active schedules:
- **Scheduled times**: Shows next scheduled time(s)
- **Random hourly**: Shows next 5 predicted times
- **Interval**: Shows "Every X minutes"

---

## Color Scheme

- **Blue (#2196F3)**: Active/scheduled information
- **Gray (#666)**: Help text and "Not scheduled"
- **Green**: Success messages
- **Red**: Error messages
- **Standard button colors**: Follow existing theme

---

## Responsive Behavior

- All elements stack vertically
- Help text appears below controls
- Display box adjusts to content width
- Button is full-width on mobile

---

## Accessibility

- All inputs have labels
- Help text associated with controls
- Keyboard navigation supported
- Screen reader friendly
- Clear visual hierarchy

---

## States

### Test Button States:
- **Default**: "Test Auto-Login Now"
- **Disabled**: When no credentials saved (grayed out)
- **Active**: When clicked (shows loading state briefly)

### Interval Input States:
- **Enabled**: When checkbox is checked
- **Disabled**: When checkbox is unchecked (grayed out)
- **Invalid**: Red border when value out of range

### Display States:
- **Not scheduled**: Gray text, no schedules active
- **Active**: Blue text, shows schedule information
- **Multiple active**: Shows all separated by |

---

## Before and After Comparison

### BEFORE (Old UI):
```
☐ Enable Random Hourly Pre-Login
  Login once per hour at a random minute

Scheduled login times: Not scheduled

[Save Settings]
```

### AFTER (New UI):
```
☐ Enable Random Hourly Pre-Login
  Login once per hour at a random minute

──────────────────────────────────────

☐ Enable Interval-Based Auto-Login      ← NEW
  Automatically login every X minutes   

Login Interval (minutes) [ 60 ]         ← NEW

Scheduled login times: Every 60 minutes ← ENHANCED

[Test Auto-Login Now]                   ← NEW

[Save Settings]
```

---

## Error Messages

When clicking test button:
- ✅ Success: "Test login initiated! Check the new tab."
- ❌ Error: "Error triggering test login: [error message]"
- ⚠️ Warning: "No credentials saved. Please enter email and password first."

When saving with invalid interval:
- ❌ "Interval login minutes must be between 1 and 1440."

---

This completes the UI changes documentation!
