"use strict";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTokenizerResources") {
        sendResponse({
            vocabUrl: chrome.runtime.getURL("model/vocab.json"),
            mergesUrl: chrome.runtime.getURL("model/merges.txt")
        });
    } else if (request.action === "getModelURL") {
        sendResponse({
            modelUrl: chrome.runtime.getURL("model/model.json")
        });
    }
});
