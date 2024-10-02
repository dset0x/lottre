browser.contextMenus.create({
  id: "lottreMenu",
  title: "lottre",
  contexts: ["page"],
  documentUrlPatterns: ["*://*.trello.com/*"]
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createMenuItem") {
    browser.contextMenus.create({
      parentId: "lottre",
      id: message.name,
      title: message.name + (message.shortcut ? ` (Ctrl+Alt+${message.shortcut})` : ""),
      contexts: ["page"],
      documentUrlPatterns: ["*://*.trello.com/*"]
    });
  }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== "lottre") {
        browser.tabs.sendMessage(tab.id, {
            action: "executeMenuCommand",
            name: info.menuItemId
        });
    }
});
