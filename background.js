let tabdata = [];

chrome.storage.local.get('tabdata' , (result) => {
  tabdata = result.tabdata || [];
});

chrome.tabs.query({
  url: [
      "http://*/*",
      "https://*/*"
  ]
})

.then(tabs => {
    tabdata = tabdata.concat(tabs.map(tab =>({ url:tab.url, id: tab.id, windowId: tab.windowId })));      
    
    //on updating current tab
    update_tab();
    
    //pushing newly opened tab.
    push_tab();
    
    //Removing closed tabs from array.    
    remove_tab();
    console.log(tabdata);
       
    }
	
   )


let update_tab = () => {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      const index = tabdata.findIndex(item => item.id === tabId);
      if (index !== -1) {
        tabdata[index].url = changeInfo.url;          
      }
    }
  });
}

let push_tab = () => {
  chrome.tabs.onCreated.addListener((tab) => {      
    tabdata.push({ url: tab.url, id: tab.id });
    chrome.storage.local.set({ tabdata });                
    }       
  )
}

let remove_tab =() => {
  chrome.tabs.onRemoved.addListener(
    (tabId) => { 
        const remIndex = tabdata.findIndex(item => item.id === tabId);

        if (remIndex !== -1) { 
            tabdata.splice(remIndex, 1); 
            chrome.storage.local.set({ tabdata });              
          }                    
        
    }
)
}