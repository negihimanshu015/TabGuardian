// Save Button Functionality
const save = document.getElementById("Save"); // Save button element
save.onclick = async () => {
    const tabs = await chrome.tabs.query({}); // Query all open tabs
    const tabData = tabs
        .filter(tab => tab.url && tab.url.trim() && tab.url !== "chrome://newtab/") // Filter out empty tabs
        .map(tab => ({
            url: tab.url,
            id: tab.id,
            windowId: tab.windowId,
        }));

    // Save the tab data to local storage
    await chrome.storage.local.set({ tabdata: tabData });
    console.log("Tabs saved:", tabData);
};

// Recover Button Functionality
const recover = document.getElementById("Recover");
recover.onclick = () => {
    restore();    
};

let restore = async () => {
    const result = await chrome.storage.local.get("tabdata");
    const storedTabs = result.tabdata || [];
  
    // Filter out duplicates based on URL
    const tabData = storedTabs.reduce((acc, tab) => {
        const existingIndex = acc.findIndex(existingTab => existingTab.url === tab.url);
        if (existingIndex === -1) {
            acc.push(tab);
        } else {
            // Prioritize the tab with windowId
            if (tab.windowId && !acc[existingIndex].windowId) {
                acc[existingIndex] = tab;
            }
        }
        return acc;
    }, []);
  
    createWindowsAndTabs(tabData);
};

function createWindowsAndTabs(tabData) {
  // Group tabs by windowId
  const tabsByWindowId = Object.values(tabData).reduce((acc, tab) => {
      const windowId = tab.windowId || chrome.windows.WINDOW_ID_CURRENT;
      if (!acc[windowId]) {
          acc[windowId] = [];
      }
      acc[windowId].push(tab);
      return acc;
  }, {});

  // Create windows and tabs
  for (const windowId in tabsByWindowId) {
      const tabs = tabsByWindowId[windowId];
      if (windowId !== chrome.windows.WINDOW_ID_CURRENT) {
          // Create a new window if it doesn't exist
          chrome.windows.create({ focused: true }, (newWindow) => {
              // Create tabs in the new window
              tabs.forEach(tab => {
                  chrome.tabs.create({ url: tab.url, windowId: newWindow.id });
              });

              // Close the blank tab created by default in the new window
              setTimeout(() => {
                  chrome.tabs.query({ windowId: newWindow.id }, (tabsInNewWindow) => {
                      const blankTab = tabsInNewWindow.find(tab => tab.url === "chrome://newtab/");
                      if (blankTab) {
                          chrome.tabs.remove(blankTab.id);
                      }
                  });
              }, 500); // Delay to ensure new window initialization
          });
      } else {
          // Create tabs in the current window
          tabs.forEach(tab => {
              chrome.tabs.create({ url: tab.url, windowId });
          });
      }
  }
}

