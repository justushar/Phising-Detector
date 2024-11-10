"use strict";

function addScript(src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = chrome.runtime.getURL(src);
    (document.body || document.head || document.documentElement).appendChild(script);
}

window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.action) return;

    const action = event.data.action;
    if (action === "getTokenizerResources" || action === "getModelURL" || action === "getTokenizerURL") {
        chrome.runtime.sendMessage({ action }, (response) => {
            window.postMessage({ response }, "*");
        });
    }
});



addScript("dist/gmailJsLoader.js");
addScript("dist/extension.js");
