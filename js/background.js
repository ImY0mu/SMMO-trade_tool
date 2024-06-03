var user_agent = navigator.userAgent + " | CHROME EXTENSION - trade tool";

const rules = {
  removeRuleIds: [1],
  addRules: [
    {
      id: 1,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          {
            header: 'user-agent',
            operation: 'set',
            value: user_agent,
          },
        ],
      },
      condition: {
        urlFilter: "https://web.simple-mmo.com/*"
      },
    },
  ],
}
chrome.declarativeNetRequest.updateDynamicRules(rules);
