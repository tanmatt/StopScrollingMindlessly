# StopScrollingMindlessly

A Chrome extension that helps you stop mindless scrolling by showing an intervention popup when you scroll too much on any website.

## ✨ Features

### 🛑 Smart Scrolling Detection
- **Gentle defaults**: 20 scrolls in 45 seconds (less sensitive)
- **Intelligent reset**: Scroll counts reset when popup appears or after 5 minutes of idle time
- **First-time setup wizard**: Choose your preferred sensitivity level
- **Three modes**: Relaxed, Balanced, or Strict
- All settings configurable in options

### 📝 Todo Management (FREE & Unlimited)
- Add, complete, and delete TODOs
- Priority levels (High/Medium/Low)
- Automatic sorting by priority and completion status
- Persistent storage using Chrome storage
- No limits - completely free!

### 💡 Productivity Tips
- Random productivity tip shown each time the popup appears
- 20 curated tips covering time management, focus, and wellness
- Tips are immediately visible without scrolling

### 🚫 Domain Control
- **Disable on specific sites**: One-click button to stop popups on current domain
- **Domain ignore list**: Add/remove domains where extension is disabled
- **Granular control**: Choose exactly where you want intervention

### 🎨 Modern UI
- **Clean intervention popup**: Close button (X) in top-right corner
- **Top-aligned positioning**: Popup appears at top of screen for better visibility
- **Responsive design**: Works on different screen sizes
- **Smooth animations**: Polished user experience

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
- Access settings

### Settings
Click "Settings" in the popup footer to configure:
- **Scroll Sensitivity**: How many scrolls trigger the popup
- **Time Window**: How quickly you need to scroll to trigger
- **Domain Ignore List**: Add/remove domains where extension is disabled

### Intervention Popup
When you scroll mindlessly, a friendly popup appears with:
- **"Time for a quick break?"** - friendly message
- **Your current TODOs** - with add/complete/delete functionality
- **Productivity tip** - immediately visible at the top
- **Close button (X)** - in the top-right corner to dismiss
- **"Disable on this site"** - one-click button to stop popups on current domain

**Smart Reset Behavior:**
- Scroll counts reset when popup appears
- Scroll counts also reset after 5 minutes of idle time
- This prevents over-intervention while maintaining effectiveness

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

### All Features Free
✅ **Unlimited TODOs** - Add as many tasks as you want
✅ **Domain Control** - Disable extension on specific sites
✅ **Configurable Sensitivity** - Choose your preferred intervention level
✅ **Productivity Tips** - Random tips with each intervention
✅ **Priority Sorting** - High/Medium/Low priority levels
✅ **Persistent Storage** - Your data stays local and secure

## 📋 Requirements & Quality Testing

### Functional Requirements

#### Core Features
- [ ] **Scroll Detection**: Extension must detect rapid scrolling patterns (configurable threshold)
- [ ] **Intervention Popup**: Modal must appear when scroll threshold is exceeded
- [ ] **Popup Positioning**: Modal should appear at top of viewport, not center
- [ ] **Close Button**: X button in top-right corner must close popup
- [ ] **Domain Disable**: "Disable on this site" button must add current domain to ignore list
- [ ] **Scroll Reset**: Scroll count must reset when popup appears
- [ ] **Idle Reset**: Scroll count must reset after 5 minutes of no scrolling activity

#### Todo Management
- [ ] **Add Todo**: Must accept text input and create new todo item
- [ ] **Complete Todo**: Checkbox must toggle completion status
- [ ] **Delete Todo**: Delete button must remove todo item
- [ ] **Priority Sorting**: Todos must sort by completion status, then priority
- [ ] **Persistent Storage**: Todos must persist across browser sessions

#### Productivity Tips
- [ ] **Tip Display**: Random tip must show in intervention popup
- [ ] **Tip Visibility**: Tip section must be immediately visible without scrolling
- [ ] **Tip Content**: Must display one of 20 curated productivity tips

#### Domain Control
- [ ] **Ignore List**: Must maintain list of ignored domains
- [ ] **Domain Detection**: Must extract clean domain name (remove www.)
- [ ] **Ignore Logic**: Must skip scroll detection on ignored domains

### Non-Functional Requirements

#### Performance
- [ ] **Memory Usage**: Extension should not significantly impact browser performance
- [ ] **CPU Usage**: Scroll detection should not cause high CPU usage
- [ ] **Storage**: Should use minimal Chrome storage space

#### User Experience
- [ ] **Responsive Design**: Must work on different screen sizes
- [ ] **Accessibility**: Keyboard navigation and screen reader support
- [ ] **Loading Time**: Popup should appear within 300ms of trigger
- [ ] **Smooth Animations**: Modal slide-in animation should be smooth

#### Security & Privacy
- [ ] **Data Isolation**: User data must remain in Chrome storage only
- [ ] **No External Calls**: Must not make external network requests
- [ ] **Content Security**: Must not execute unsafe scripts or content

### Testing Scenarios

#### Installation & Setup
- [ ] **Fresh Install**: Extension loads without errors on first install
- [ ] **Permission Request**: Appropriate permissions requested during install
- [ ] **Setup Wizard**: First-time setup flow works correctly
- [ ] **Default Settings**: Sensible defaults applied on installation

#### Scroll Detection
- [ ] **Threshold Trigger**: Popup appears after configured scroll threshold
- [ ] **Time Window**: Scroll timing window works correctly
- [ ] **Multiple Tabs**: Detection works independently per tab
- [ ] **Ignored Domains**: No detection on domains in ignore list
- [ ] **Popup Reset**: Scroll count resets when popup is shown
- [ ] **Idle Reset**: Scroll count resets after 5 minutes idle

#### Intervention Popup
- [ ] **Modal Display**: Popup appears correctly positioned at top
- [ ] **Content Loading**: All sections (todos, tip, ad) load properly
- [ ] **Close Button**: X button closes popup
- [ ] **Disable Domain**: Domain added to ignore list when button clicked
- [ ] **Todo Interaction**: Add, complete, delete todos work in popup
- [ ] **Tip Visibility**: Productivity tip immediately visible

#### Todo Management
- [ ] **Add Todo**: New todos added with correct default priority
- [ ] **Complete Todo**: Checkbox toggles visual state and sorting
- [ ] **Delete Todo**: Todo removed from list and storage
- [ ] **Priority Display**: High/Medium/Low priorities shown correctly
- [ ] **Sorting Logic**: Incomplete todos first, then by priority
- [ ] **Persistence**: Todos survive browser restart

#### Settings & Configuration
- [ ] **Sensitivity Settings**: Scroll threshold and time window adjustable
- [ ] **Domain Management**: Add/remove domains from ignore list
- [ ] **Settings Persistence**: Configuration changes saved and applied
- [ ] **Validation**: Invalid inputs handled gracefully

#### Edge Cases
- [ ] **Rapid Clicking**: Multiple rapid scroll events handled correctly
- [ ] **Tab Switching**: Detection continues when switching tabs
- [ ] **Browser Restart**: State restored correctly after restart
- [ ] **Memory Pressure**: Extension handles low memory conditions
- [ ] **Network Issues**: No external dependencies fail gracefully

#### Browser Compatibility
- [ ] **Chrome Latest**: Works on current Chrome version
- [ ] **Chrome Beta**: Compatible with upcoming Chrome versions
- [ ] **Extension APIs**: Uses only documented Chrome extension APIs

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
