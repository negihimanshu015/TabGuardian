const recover = document.getElementById("Recover");
const startButton = document.getElementById("Start");
const stopButton = document.getElementById("Stop");

recover.onclick = () => {
    chrome.storage.local.get("tabdata", async (result) => {
        const tabdata = result.tabdata || [];
        if (tabdata.length > 0) {
            const windowMap = new Map();            
            
            for (let tab of tabdata) {
                if (!windowMap.has(tab.windowId)) {
                    const win = await chrome.windows.create({ url: "about:blank" });
                    windowMap.set(tab.windowId, win.id);
                }
            }
           
            for (let tab of tabdata) {
                const winId = windowMap.get(tab.windowId);
                chrome.tabs.create({ windowId: winId, url: tab.url });
            }
            
            for (let winId of windowMap.values()) {
                const tabs = await chrome.tabs.query({ windowId: winId });
                if (tabs.length > 0 && tabs[0].url === "about:blank") {
                    chrome.tabs.remove(tabs[0].id);
                }
            }
        }
    });
};

startButton.onclick = () => {
    console.log('Start button clicked');    
};

stopButton.onclick = () => {
    console.log('Stop button clicked');    
};
