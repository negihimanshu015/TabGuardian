//Element
chrome.tabs.query({
    url: [
        "http://*/*",
        "https://*/*"
    ]
  })

.then(tabs => {
    let URL =[];
    for (let i = 0 ; i < tabs.length ; i++) {
    URL.push(tabs[i].url);
    }
    console.log(URL);
    }

)