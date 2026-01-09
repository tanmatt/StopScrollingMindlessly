# StopScrollingMindlessly

A Chrome extension that helps you stop mindless scrolling by showing an intervention popup when you scroll too much on any website.

## Features

### 🛑 Mindless Scrolling Detection
- **Gentle defaults**: 20 scrolls in 45 seconds (less sensitive)
- **First-time setup wizard**: Choose your preferred sensitivity level
- **Three modes**: Relaxed, Balanced, or Strict
- All settings configurable in options

### 📝 Todo Management
- Add, complete, and delete TODOs
- Priority levels (High/Medium/Low)
- Automatic sorting by priority
- Persistent storage using Chrome storage

### 💡 Productivity Tips
- Random productivity tip shown each time the popup appears
- 20 curated tips covering time management, focus, and wellness

### 🚫 Domain Ignore List (FREE)
- Disable the extension on specific websites (e.g., youtube.com, twitter.com)
- Completely silent on domains you choose
- Available to all users for free!

### 🎨 Monetization (Freemium Model)
- **Free**: 5 TODOs limit, ads in popup, full sensitivity control, domain ignore
- **Premium**: Unlimited TODOs, no ads, priority levels, dark mode

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `StopScrollingMindlessly` folder
5. The extension is now installed!

## Usage

### First-Time Setup
When you first install, you'll see a setup wizard to choose your sensitivity:
- 🧘 **Relaxed**: 30 scrolls in 60 seconds (least interruptions)
- ⚖️ **Balanced**: 20 scrolls in 45 seconds (recommended)
- 🎯 **Strict**: 10 scrolls in 20 seconds (more reminders)

### Main Popup
Click the extension icon to open the main popup where you can:
- View and manage your TODOs
- See a random productivity tip
- Upgrade to Premium

### Settings
Click "Settings" in the popup footer to configure:
- **Scroll Sensitivity**: How many scrolls trigger the popup
- **Time Window**: How quickly you need to scroll to trigger
- **Domain Ignore List**: Add/remove domains where extension is disabled

### Intervention Popup
When you scroll mindlessly, a friendly popup appears with:
- "Time for a quick break?" - friendly message
- Your current TODOs
- Quick add todo form
- Productivity tip
- Two clear buttons:
  - "I'm just browsing" - shows again later
  - "Back to work" - closes popup

## Files

```
StopScrollingMindlessly/
├── manifest.json           # Extension configuration
├── background.js           # Service worker - state management
├── content.js             # Scroll detection on web pages
├── popup.html/css/js      # Main extension popup
├── intervention.html/css/js  # Intervention popup
├── options.html/css/js    # Settings page with setup wizard
├── icons/                 # Extension icons
└── README.md              # This file
```

## Configuration

### Sensitivity Options
| Mode | Scrolls | Time Window | Best For |
|------|---------|-------------|----------|
| Relaxed | 30 | 60 seconds | Casual browsing |
| Balanced | 20 | 45 seconds | Most users |
| Strict | 10 | 20 seconds | Maximum focus |

### Free Tier
- 5 TODOs max
- Domain ignore list
- Configurable sensitivity
- Ads in popup

### Premium Features (Coming Soon)
- Unlimited TODOs
- No advertisements
- Dark mode
- Priority sorting

## Development

To modify the extension:
1. Make changes to the source files
2. Reload the extension in Chrome (`chrome://extensions/` → click refresh)
3. Test your changes

## Privacy

This extension:
- Stores your TODOs locally using Chrome's storage API
- Does not collect or transmit any personal data
- Does not track your browsing history beyond scroll detection

## License

MIT License - Feel free to modify and distribute.

---

Made with ❤️ to help you be more productive
