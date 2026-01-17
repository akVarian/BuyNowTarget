# Discord Monitor Guide

## Overview
The Discord Monitor feature allows the extension to automatically detect and open Target product links posted in specific Discord channels. This enables you to catch restocks and new items even when you're away from your computer.

**Important**: You must keep a Discord browser tab open for the monitoring to work. The tab can be minimized or in the background, but must remain open.

## New Features (Updated)
- ✅ **SKU Filtering**: Monitor only specific SKUs per channel
- ✅ **howl.link Support**: Automatically handles howl.link redirects
- ✅ **SKU Extraction**: Reads SKU from Discord embeds
- ✅ **Auto-Close Failed Tabs**: Closes tabs when checkout fails
- ✅ **Ultra-Fast Activation**: Extension activates in 50ms (was 800ms)

## How It Works

1. **Monitors Discord Channels**: The extension watches specific Discord channels for new messages
2. **Detects Target Links**: When a Target product link (target.com/p/) is posted, it's detected immediately
3. **Opens Automatically**: The link is opened in a new tab automatically
4. **Smart Cooldowns**: Prevents spam by using cooldowns for duplicate products

## Setup Instructions

### Step 1: Enable Discord Developer Mode
1. Open Discord (web or desktop app)
2. Go to User Settings (gear icon)
3. Navigate to Advanced settings
4. Enable "Developer Mode"

### Step 2: Get Channel IDs
1. Navigate to the Discord channel you want to monitor
2. Right-click on the channel name
3. Select "Copy ID"
4. The channel ID is now in your clipboard (it's a long number like `123456789012345678`)

### Step 3: Configure the Extension
1. Click the extension icon in your browser
2. Click the settings button (⚙️) next to "Discord Channel Monitor"
3. Toggle "Active" to ON
4. Paste the channel ID in the first input field
5. **(Optional)** Enter SKU filter in second field (comma-separated)
   - Example: `12345, 67890, 99999`
   - Leave blank to monitor all products
6. Click "Add Channel"
7. Repeat for any additional channels you want to monitor

**SKU Filtering**: If you only want to monitor specific products, enter their SKUs in the filter field. The extension will read SKUs from Discord embed messages and only open links for matching products.

### Step 4: Keep Discord Open
- Open Discord in a browser tab (discord.com)
- Navigate to one of your monitored channels
- You can minimize or background the tab, but keep it open
- The extension will monitor all configured channels

## Features

### SKU Filtering
Monitor specific products per channel:
- Enter comma-separated SKUs when adding a channel
- Extension extracts SKU from Discord embeds
- Only matching SKUs will be opened
- Edit SKU filter anytime by clicking ✎

### Link Types Supported
The extension handles multiple link formats:
- **Direct Target Links**: `target.com/p/product/-/A-12345`
- **howl.link**: `https://howl.link/xxxxx` (auto-resolved to Target)

### Auto-Close Failed Tabs
Prevents clutter from failed checkouts:
- Monitors opened tabs for errors
- Detects out-of-stock pages
- Automatically closes failed tabs
- Timeout after 60 seconds

### Cooldowns
The extension uses two types of cooldowns to prevent spam:
- **Global Cooldown (5 seconds)**: Minimum time between opening any tabs
- **SKU Cooldown (10 seconds)**: Minimum time before opening the same product again

You can adjust these in the General Settings if needed.

### Notifications
When a link is auto-opened, you'll receive a browser notification showing:
- That a Discord link was detected
- The SKU/TCIN of the product

### Multi-Channel Support
You can monitor multiple channels simultaneously:
- Add as many channel IDs as you want
- Each channel can have its own SKU filter
- Links from any monitored channel will be opened

## Tips

1. **Test First**: Add a test channel and post a Target link to verify it works
2. **Stay Logged In**: Make sure you're logged into Discord in your browser
3. **Link Support**: Works with target.com/p/ and howl.link URLs
4. **SKU Format**: Use numeric SKUs only (e.g., `12345, 67890`)
5. **Edit SKUs**: Click the ✎ button next to any channel to edit its SKU filter
6. **Fast Activation**: Extension now activates in 50ms for instant response

## Troubleshooting

### Links Not Opening
- Verify Discord Monitor is toggled to "Active"
- Check that you've added the correct channel ID
- Make sure a Discord tab is open in your browser
- Verify you're viewing a monitored channel in Discord

### Too Many Tabs Opening
- The extension has built-in cooldowns to prevent this
- If still happening, check if multiple channels are posting the same link
- Consider adjusting cooldowns in General Settings

### Channel ID Not Working
- Verify Discord Developer Mode is enabled
- Make sure you copied the channel ID, not the server ID
- Channel IDs should be purely numeric

## Privacy & Security

- Channel IDs are stored locally in your browser only
- The extension does not send any data externally
- Discord monitoring only works when a Discord tab is open
- You must be a member of the Discord server to monitor its channels

## Advanced Configuration

### Adjusting Cooldowns
In the General Settings tab:
- **Global Cooldown**: Controls time between ANY tab opens (default: 5 seconds)
- **SKU Cooldown**: Controls time between opening same product (default: 10 seconds)

Lower values = faster but more aggressive
Higher values = slower but safer from rate limits

## Uninstalling/Disabling

To temporarily disable:
- Toggle Discord Monitor to OFF in the popup

To remove channels:
- Click the X button next to any channel in the settings view

To completely remove the feature:
- Simply don't enable the Discord Monitor toggle
