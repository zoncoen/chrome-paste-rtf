chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("recieve");
    document.execCommand("paste");
    return true;
});
