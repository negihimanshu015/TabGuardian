//Element
const recover= document.getElementById("Recover")
const startbutton= document.getElementById("Start")
const stopbutton= document.getElementById("Stop")



recover.onclick = async() =>{
    const tabs = await chrome.tabs.query({
        url: [
            "http://*/*",
            "https://*/*"
        ]
      });
      
      for (let i = 0 ; i < tabs.length ; i++) {
        console.log(tabs[i].url)
      }
}

