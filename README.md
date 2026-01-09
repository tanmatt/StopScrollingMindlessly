# StopScrollingMindlessly

A Chrome extension that helps you stop mindless scrolling by showing an intervention popup when you scroll too much on any website.

## Features

### 🛑 Mindless Scrolling Detection
- Detects when you're scrolling mindlessly (configurable sensitivity)
- Shows an intervention popup with your TODOs and a productivity tip

### 📝 Todo Management
- Add, complete, and delete TODOs
- Priority levels (High/Medium/Low)
- Automatic sorting by priority
- Persistent storage using Chrome storage

### 💡 Productivity Tips
- Random productivity tip shown each time the popup appears
- 20 curated tips covering time management, focus, and wellness

### 🚫 Domain Ignore List
- Disable the extension on specific websites (e.g., youtube.com, twitter.com)
- Complete silence on domains you choose

### 🎨 Monetization (Freemium Model)
- **Free**: 5 TODOs limit, ads in popup, configurable sensitivity
- **Premium**: Unlimited TODOs, no ads, priority levels, dark mode

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `StopMindlesslyScrolling` folder
5. The extension is now installed!

## Usage

### Main Popup
Click the extension icon to open the main popup where you can:
- View and manage your TODOs
- See a random productivity tip
- Upgrade to Premium

### Settings
Click "Settings" in the popup footer to configure:
- **Scroll Sensitivity**: How many scrolls trigger the popup (5-30)
- **Time Window**: How quickly you need to scroll to trigger (10-120 seconds)
- **Domain Ignore List**: Add/remove domains where extension is disabled

### Intervention Popup
When you scroll mindlessly, a popup appears with:
- Warning message: "Stop scrolling mindlessly! Here are your top TODOs"
- Your current TODOs
- Quick add todo form
- Productivity tip
- Ad (free users) or upgrade prompt

## Files

```
stop-mindlessly-scrolling/
├── manifest.json           # Extension configuration
├── background.js           # Service worker - state management
├── content.js             # Scroll detection on web pages
├── popup.html/css/js      # Main extension popup
├── intervention.html/css/js  # Intervention popup
├── options.html/css/js    # Settings page
├── icons/                 # Extension icons (16px, 48px, 128px)
└── README.md              # This file
```

## Configuration

### Default Settings
- Scroll threshold: 10 scrolls
- Time window: 30 seconds
- Free tier: 5 TODOs max

### Premium Features
- Unlimited TODOs
- No advertisements
- Dark mode (coming soon)
- Priority sorting (coming soon)

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
