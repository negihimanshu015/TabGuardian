let tabdata = [];

chrome.storage.local.get('tabdata' , (result) => {
  tabdata = result.tabData || [];

  chrome.tabs.query({
    url: [
        "http://*/*",
        "https://*/*"
    ]
  })

.then(tabs => {
    tabdata = tabdata.concat(tabs.map(tab =>({ url:tab.url, id: tab.id })));
    
    //on updating current tab
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        const index = tabdata.findIndex(item => item.id === tabId);
        if (index !== -1) {
          tabdata[index].url = changeInfo.url;          ;
        } else {
          console.log('Tab not found in data list:', tabId);
        }
      }
    });
    
    //pushing newly opened tab.
    chrome.tabs.onCreated.addListener((tab) => {      
        tabdata.push({ url: tab.url, id: tab.id });
        chrome.storage.local.set({ tabdata });                
        }       
      )
    
    //Removing closed tabs from array.
    
    chrome.tabs.onRemoved.addListener(
        (tabId) => { 
            const remIndex = tabdata.findIndex(item => item.id === tabId);

            if (remIndex !== -1) { // Check if tab found
                tabdata.splice(remIndex, 1); // Remove object at the index 
                chrome.storage.local.set({ tabdata });              
              } else {
                console.log('Tab not found in data list:', tabId);
              }                     
            
        }
    ) 
    
    }
	
   )
}) 