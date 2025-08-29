console.log("Audio Manager extension loaded!");

let previouslyMutedTabs = new Set();  // Fixed name

async function muteOtherAudioTabs(keepTabId) {
    const allTabs = await chrome.tabs.query({});
    const audioTabs = allTabs.filter(tab => tab.audible === true);
    
    for(const tab of audioTabs){
        if(tab.id !== keepTabId){
            await chrome.tabs.update(tab.id, {muted: true});
            previouslyMutedTabs.add(tab.id);  // ADD THIS LINE!
            console.log("MUTED", tab.title);
        }
    }
}

async function unmuteTab(tabId) {
    if(previouslyMutedTabs.has(tabId)){  // Fixed name
        await chrome.tabs.update(tabId, {muted: false});
        previouslyMutedTabs.delete(tabId);  // Fixed name
        console.log("UNMUTED tab id", tabId);
    }
}

chrome.tabs.onActivated.addListener(async(activeInfo) => {
    try{
        const currentTab = await chrome.tabs.get(activeInfo.tabId);
        
        console.log("====SWITCHED TO====");
        console.log("Current tab", currentTab.title);
        
        await unmuteTab(activeInfo.tabId);
        
        if(currentTab.audible){
            console.log("This tab has audio, muting others");
            await muteOtherAudioTabs(activeInfo.tabId);  // Fixed case!
        }
        console.log("===========");
    }
    catch(error){
        console.log("Error", error);
    }
});