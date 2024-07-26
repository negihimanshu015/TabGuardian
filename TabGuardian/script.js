//Element
const recover= document.getElementById("Recover")
const startbutton= document.getElementById("Start")
const stopbutton= document.getElementById("Stop")


recover.onclick = () => {
    let tab = chrome.storage.local.get("tabdata", (result) => {
        const tabdata = result.tabdata || [];
        if (tabdata.length > 0){
            for(let i =0; i < tabdata.length;i++){
                chrome.tabs.create({ url: tabdata[i].url });                
            }
        }
    });     
}   

