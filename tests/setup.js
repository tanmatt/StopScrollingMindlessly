module.exports = function() {
  // Mock Chrome API
  global.chrome = {
    storage: {
      local: {
        get: jest.fn((keys, callback) => callback({})),
        set: jest.fn((items, callback) => callback && callback()),
      },
    },
    runtime: {
      sendMessage: jest.fn(),
      onMessage: {
        addListener: jest.fn(),
      },
      openOptionsPage: jest.fn(),
    },
    tabs: {
      query: jest.fn(),
      sendMessage: jest.fn(),
    },
    action: {
      onClicked: {
        addListener: jest.fn(),
      },
    },
    windows: {
      create: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      onRemoved: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    },
  };

  // Mock DOM elements
  document.body.innerHTML = `
    <div id="todoList"></div>
    <input id="todoInput" />
    <select id="prioritySelect">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <button id="addTodoBtn"></button>
    <div id="tipText"></div>
    <button id="refreshTip"></button>
    <div id="promoSection"></div>
    <a id="settingsLink"></a>
    <input id="scrollThreshold" />
    <span id="scrollThresholdValue"></span>
    <input id="timeWindow" />
    <span id="timeWindowValue"></span>
    <span id="sensitivityNote"></span>
    <span id="timeNote"></span>
    <input id="domainInput" />
    <button id="addDomainBtn"></button>
    <div id="domainList"></div>
    <span id="premiumBadge"></span>
    <a id="resetSettings"></a>
    <div id="setupSection"></div>
    <div id="sensitivitySection"></div>
    <div id="domainSection"></div>
    <button id="saveSetupBtn"></button>
    <div id="adSection"></div>
    <button id="modalCloseBtn"></button>
    <button id="disableDomainBtn"></button>
    <div id="scrollsPerMinuteOverlay"></div>
    <span id="scrollsPerMinuteValue"></span>
  `;
};
