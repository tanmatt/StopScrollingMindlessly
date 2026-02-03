# Stop Scrolling Mindlessly

A Chrome extension that helps you stop mindless scrolling by showing an intervention popup when you scroll too much on any website.

## Chrome Web Store Description

**Summary:**
Stop mindless scrolling with smart intervention popups, productivity tips, and TODOs.

**Detailed Description:**
Do you find yourself scrolling endlessly on social media, forgetting why you opened the tab in the first place?

"Stop Scrolling Mindlessly" is your intelligent scrolling guardian. It detects when you're scrolling too much and gently intervenes.

**Key Features:**
*   **Smart Interventions:** A friendly popup appears when you scroll excessively (customizable sensitivity).
*   **Productivity Tips:** Get a random productivity tip with every intervention to help you refocus.
*   **Built-in TODO List:** Manage your tasks directly within the extension to remind you of your priorities.
*   **Scrolls Per Minute (SPM) Overlay:** See your scrolling speed in real-time to build awareness.
*   **Domain Control:** Easily disable the extension on specific sites where you *need* to scroll.

**Privacy:** All data is stored locally. No tracking.

## ✨ Features

### 🛑 Smart Scrolling Detection
- **Gentle defaults**: 20 scrolls in 45 seconds (less sensitive)
- **Intelligent reset**: Scroll counts reset when popup appears or after 5 minutes of idle time
- **Half-Page Logic**: Counts a "scroll" only when you've navigated at least half a page height
- **Direction Aware**: Only counts downward scrolling to avoid false positives when reading back up
- **First-time setup wizard**: Choose your preferred sensitivity level
- **Three modes**: Relaxed, Balanced, or Strict

### 📊 Real-Time Feedback
- **Scrolls Per Minute (SPM) Overlay**: A subtle overlay appears when you start scrolling to show your current speed
- **Visual Cues**: Helps you become aware of your scrolling behavior in real-time

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

### 🚫 Domain Management
- **Exclude specific sites**: One-click "Disable on this site" button in intervention popup
- **Excluded domains list**: Add/remove domains where extension won't trigger
- **Early access**: Domain management available even before completing setup
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
4. Select the `Stop Scrolling Mindlessly` folder
5. The extension is now installed!

## Packaging for Chrome Web Store

To create a zip file for uploading to the Chrome Web Store, run the following command in your terminal:

```bash
zip -r StopScrollingMindlessly.zip . -x "node_modules/*" "tests/*" "screenshots/*" "test-reports/*" "package-lock.json" ".git/*" ".gitignore" ".DS_Store" "generate-icons.py" "package_extension.py"
```

This command creates `StopScrollingMindlessly.zip` containing all necessary files while excluding development artifacts.

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
- **Close button (X)** - in the top-right corner to dismiss (also: click overlay or press ESC)
- **"Disable on this site"** - one-click button to stop popups on current domain

**Smart Reset Behavior:**
- Scroll counts reset when popup appears
- Scroll counts reset after 30 seconds of no scrolling
- Scroll counts also reset after 5 minutes of idle time
- This prevents over-intervention while maintaining effectiveness

## Files

```
Stop Scrolling Mindlessly/
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
- [ ] **Scroll Detection**: Extension must detect rapid scrolling patterns (configurable threshold: 10-40 scrolls within 20-90 seconds)
- [ ] **Intervention Popup**: Modal must appear when scroll threshold is exceeded with proper positioning and styling
- [ ] **Popup Positioning**: Modal should appear at top of viewport with overlay background
- [ ] **Close Button**: X button in top-right corner must close popup and reset scroll count
- [ ] **Domain Exclusion**: "Disable on this site" button must add current domain to excluded domains list
- [ ] **Scroll Reset**: Scroll count must reset when popup appears and after 30 seconds of no scrolling
- [ ] **Idle Reset**: Scroll count must reset after 5 minutes of no scrolling activity
- [ ] **Domain Isolation**: Scroll count must be specific to each domain and not carry over between tabs/sites
- [ ] **Cooldown Period**: Extension should not show multiple popups within 5 seconds

#### Todo Management
- [ ] **Add Todo**: Must accept text input (max 80 chars) and create new todo with medium priority default
- [ ] **Complete Todo**: Checkbox must toggle completion status and update sorting
- [ ] **Delete Todo**: Delete button must remove todo item from list and storage
- [ ] **Priority Sorting**: Todos must sort incomplete first, then by priority (High > Medium > Low)
- [ ] **Priority Levels**: Must support High/Medium/Low priorities with visual indicators
- [ ] **Persistent Storage**: Todos must persist across browser sessions and extension reloads
- [ ] **Todo Limits**: Free users limited to 5 active todos, premium users unlimited
- [ ] **Input Validation**: Must prevent empty todos and handle special characters

#### Productivity Tips
- [ ] **Tip Display**: Random tip must show in both popup and intervention with refresh capability
- [ ] **Tip Visibility**: Tip section must be immediately visible without scrolling popup content
- [ ] **Tip Content**: Must display one of 20 curated productivity tips with proper formatting
- [ ] **Tip Refresh**: New Tip button must show different tip each click
- [ ] **Tip Persistence**: Same tip should persist during popup session but refresh on new popup

#### Domain Management
- [ ] **Excluded Domains List**: Must maintain persistent list of domains where extension won't trigger
- [ ] **Domain Detection**: Must extract clean domain name (remove www., protocol, paths)
- [ ] **Domain Validation**: Must validate domain format and prevent duplicates/invalid entries
- [ ] **Exclusion Logic**: Must skip scroll detection completely on excluded domains
- [ ] **Early Access**: Domain management must be available before setup completion
- [ ] **Domain Removal**: Must allow removal of domains from excluded list
- [ ] **Domain Display**: Must show clean domain names in settings list

#### Settings & Configuration
- [ ] **Sensitivity Settings**: Scroll threshold (10-40) and time window (20-90s) must be adjustable
- [ ] **Setup Wizard**: First-time setup must offer Relaxed/Balanced/Strict presets
- [ ] **Settings Persistence**: All configuration changes must persist across browser sessions
- [ ] **Settings Validation**: Must prevent invalid values and provide sensible defaults
- [ ] **Reset Functionality**: Reset to defaults must clear all settings and show setup wizard

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
- [ ] **Fresh Install**: Extension loads without errors on first install, icon appears in toolbar
- [ ] **Permission Request**: Appropriate permissions (storage, activeTab, all_urls) requested during install
- [ ] **Setup Wizard**: First-time setup flow works correctly with three sensitivity options
- [ ] **Default Settings**: Sensible defaults applied (20 scrolls, 45 seconds, empty domain list)
- [ ] **Setup Skip**: Extension functions without completing setup wizard
- [ ] **Setup Completion**: Settings saved and applied after setup completion
- [ ] **Icon Click Behavior**: Clicking extension icon opens setup if not completed, popup if completed

#### Scroll Detection Core Functionality
- [ ] **Basic Scroll Detection**: Scrolling triggers popup after reaching threshold
- [ ] **Threshold Accuracy**: Popup appears exactly after configured scroll count (test with different values)
- [ ] **Time Window Accuracy**: Scroll timing window works correctly (test 20s, 45s, 90s windows)
- [ ] **Scroll Direction**: Both up and down scrolling counted toward threshold
- [ ] **Scroll Speed**: Rapid scrolling vs slow scrolling both counted equally
- [ ] **Mouse Wheel**: Mouse wheel scrolling detected
- [ ] **Touchpad**: Touchpad scrolling detected
- [ ] **Keyboard Scrolling**: Spacebar/page up/down scrolling detected
- [ ] **Scrollbar Dragging**: Manual scrollbar dragging detected

#### Domain Isolation & Exclusion
- [ ] **Domain Isolation**: Scroll counts reset when navigating to different domains
- [ ] **Subdomain Handling**: www.example.com treated same as example.com
- [ ] **HTTPS/HTTP**: Protocol doesn't affect domain detection
- [ ] **Port Numbers**: Port numbers properly stripped from domain
- [ ] **Query Parameters**: URL parameters don't affect domain detection
- [ ] **Excluded Domain Skip**: No scroll detection on domains in excluded list
- [ ] **Domain Exclusion Timing**: Exclusion takes effect immediately without reload
- [ ] **Multiple Exclusions**: Multiple domains can be excluded simultaneously

#### Intervention Popup Behavior
- [ ] **Modal Positioning**: Popup appears at top of viewport with proper overlay
- [ ] **Modal Sizing**: Popup maintains consistent dimensions across screen sizes
- [ ] **Content Loading**: All sections (todos, tip, ad) load within 300ms
- [ ] **Close Button**: X button closes popup and resets scroll count
- [ ] **Background Click**: Clicking overlay background closes popup
- [ ] **ESC Key**: ESC key closes popup
- [ ] **Disable Domain**: "Disable on this site" button adds current domain to excluded list
- [ ] **Domain Already Excluded**: Proper message when trying to exclude already excluded domain
- [ ] **Popup Persistence**: Popup stays open until explicitly closed

#### Todo Management - Popup
- [ ] **Add Todo**: Text input creates todo with medium priority default
- [ ] **Add Todo Enter Key**: Enter key in input field adds todo
- [ ] **Add Todo Button Click**: Plus button adds todo
- [ ] **Empty Todo Prevention**: Cannot add empty todos
- [ ] **Todo Length Limit**: 80 character limit enforced
- [ ] **Priority Selection**: High/Medium/Low priorities work correctly
- [ ] **Todo Limits**: Free users blocked at 5 active todos
- [ ] **Premium Override**: Premium users can add unlimited todos

#### Todo Management - Extension Popup
- [ ] **Todo Display**: All todos display in extension popup
- [ ] **Todo Completion**: Checkbox toggles completion status
- [ ] **Todo Deletion**: Delete button removes todo
- [ ] **Priority Indicators**: Visual priority indicators (🔴🟡🟢) display correctly
- [ ] **Sorting Logic**: Incomplete todos appear before completed, sorted by priority
- [ ] **Sorting Updates**: Sorting updates immediately after completion/deletion
- [ ] **Persistence**: Todos persist across popup opens/closes

#### Productivity Tips
- [ ] **Tip Display**: Random tip shows in both intervention and extension popups
- [ ] **Tip Visibility**: Tip immediately visible without scrolling
- [ ] **Tip Content**: All 20 tips display correctly formatted
- [ ] **Tip Randomization**: Different tips show on each popup appearance
- [ ] **Tip Refresh**: "New Tip" button shows different tip
- [ ] **Tip Persistence**: Same tip persists during popup session
- [ ] **Tip Variety**: All tips eventually show over multiple popup appearances

#### Settings & Configuration
- [ ] **Scroll Threshold Slider**: Range 10-40 works correctly
- [ ] **Time Window Slider**: Range 20-90 seconds works correctly
- [ ] **Settings Preview**: Live preview of threshold/time window values
- [ ] **Settings Persistence**: Settings survive browser restart
- [ ] **Settings Validation**: Invalid values prevented
- [ ] **Domain Addition**: Add domain with various formats (example.com, www.example.com, https://example.com)
- [ ] **Domain Validation**: Invalid domains rejected (empty, malformed)
- [ ] **Domain Duplicates**: Duplicate domains prevented
- [ ] **Domain Removal**: Remove button deletes domains from list
- [ ] **Domain Persistence**: Excluded domains persist across sessions

#### Reset & Recovery
- [ ] **Scroll Reset on Popup**: Scroll count resets when intervention popup appears
- [ ] **Idle Reset**: Scroll count resets after 5 minutes of no activity
- [ ] **Short Reset**: Scroll count resets after 30 seconds of no scrolling
- [ ] **Tab Switch Reset**: Scroll count maintains per tab
- [ ] **Domain Change Reset**: Scroll count resets when navigating to different domain
- [ ] **Cooldown Period**: Multiple popups prevented within 5 seconds

#### Edge Cases & Error Handling
- [ ] **Rapid Scrolling**: Very fast scrolling doesn't break detection
- [ ] **Very Slow Scrolling**: Very slow scrolling still counts toward threshold
- [ ] **Mixed Scroll Types**: Mouse wheel + keyboard scrolling counted together
- [ ] **Tab Closure**: Extension handles tab closure gracefully
- [ ] **Window Resize**: Popup positioning maintains during window resize
- [ ] **Multiple Monitors**: Extension works across multiple monitors
- [ ] **Incognito Mode**: Extension functions in incognito windows
- [ ] **Extension Reload**: State maintained after extension reload
- [ ] **Browser Crash Recovery**: Extension recovers gracefully from browser crashes

#### Performance & Resource Usage
- [ ] **Memory Usage**: Extension doesn't cause excessive memory usage
- [ ] **CPU Usage**: Scroll detection doesn't spike CPU usage
- [ ] **Storage Usage**: Minimal Chrome storage space used
- [ ] **Popup Load Time**: Popups appear within 300ms of trigger
- [ ] **Animation Smoothness**: Slide-in animations are smooth
- [ ] **Multiple Tabs**: Performance maintained with multiple tabs open
- [ ] **Long Sessions**: No performance degradation over extended use

#### Security & Privacy
- [ ] **Data Isolation**: All data stored only in Chrome storage
- [ ] **No External Calls**: No network requests made by extension
- [ ] **Content Security**: No unsafe script execution
- [ ] **Domain Data**: Only domain names stored, no URLs or content
- [ ] **Todo Security**: Todos stored securely in local storage
- [ ] **Settings Security**: Configuration data properly isolated

#### Browser Compatibility
- [ ] **Chrome Stable**: Works on current stable Chrome version
- [ ] **Chrome Beta**: Compatible with Chrome beta versions
- [ ] **Extension APIs**: Only documented Chrome extension APIs used
- [ ] **Manifest V3**: Properly implements Manifest V3 requirements
- [ ] **Service Worker**: Background script functions as service worker
- [ ] **Permissions**: Only necessary permissions requested

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
