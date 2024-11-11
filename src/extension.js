"use strict";
import * as tf from '@tensorflow/tfjs';
import { TokenizerModel } from '@xenova/transformers';
let vocab = null;
import '@tensorflow/tfjs-backend-webgpu';

tf.setBackend('webgpu').then(() => main());

const loaderId = setInterval(() => {
    if (!window._gmailjs) return;
    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

const policy = window.trustedTypes.createPolicy("myExtensionPolicy", {
    createScript: (input) => input,
    createScriptURL: (input) => input
});

async function startExtension(gmail) {
    //console.log("Extension loading...");
    try {
        const tokenizer = await loadTokenizer();
        const model = await loadTFJSModel();

       // console.log("Extension loaded successfully.");
        window.gmail = gmail;

        gmail.observe.on("load", () => {
            const userEmail = gmail.get.user_email();
        //    console.log("Hello, " + userEmail + ". This is your extension talking!");

            gmail.observe.on("view_email", async (domEmail) => {
                console.log("Looking at email:", domEmail);
                const emailSubject = gmail.get.email_subject();
                const emailData = gmail.new.get.email_data(domEmail);
                const emailBody = emailData.content_html;

                const isSpam = await checkSpamInChunks(emailSubject + " " + emailBody, tokenizer, model);
                // console.log(isSpam ? "Spam" : "Not Spam");
                showNotification(isSpam);
            });
        });
    } catch (error) {
        console.error("Error loading extension:", error);
    }
}

async function loadTFJSModel() {
    const resource = await getResourceURLs("getModelURL");
    return await tf.loadGraphModel(resource.modelUrl);
}

async function loadTokenizer() {
    const resources = await getResourceURLs("getTokenizerResources");

    const vocabResponse = await fetch(resources.vocabUrl);
    const mergesResponse = await fetch(resources.mergesUrl);

    vocab = await vocabResponse.json();

    const rawMerges = (await mergesResponse.text()).split("\n").map(line => line.trim().split(" "));
    const merges = rawMerges.map(mergeArray => mergeArray.join(''));

    const tokenizerConfig = {
        type: "BPE",
        vocab: vocab,
        merges: merges,
        unk_token: "<unk>"
    };
    return TokenizerModel.fromConfig(tokenizerConfig);
}

function getResourceURLs(action) {
    return new Promise((resolve) => {
        window.postMessage({ action }, "*");

        window.addEventListener("message", function listener(event) {
            if (event.source === window && event.data.response) {
                resolve(event.data.response);
                window.removeEventListener("message", listener);
            }
        });
    });
}

async function checkSpamInChunks(text, tokenizer, model) {
    const chunkSize = 512; // Define a manageable chunk size
    const tokens = tokenizer.encode(text);

    // Process each chunk and accumulate results
    let spamScoreSum = 0;
    let chunkCount = 0;

    for (let i = 0; i < tokens.length; i += chunkSize) {
        const chunkTokens = tokens.slice(i, i + chunkSize);
        const { inputIds, attentionMask } = await tokenizeChunk(chunkTokens, tokenizer);

        const result = await runInference(model, inputIds, attentionMask);
        spamScoreSum += result;
        chunkCount++;
    }

    // Average spam score across chunks and classify as spam if above threshold
    const avgSpamScore = spamScoreSum / chunkCount;
 //   console.log("Average spam score:", avgSpamScore);
    if (avgSpamScore > 2.77) return "Spam";
    else return "Not Spam";
}

async function tokenizeChunk(tokens, tokenizer) {
    const inputIds = tokens.map(token =>
        vocab[token] !== undefined && vocab[token] < 514 ? vocab[token] : tokenizer.unk_token_id
    );
    const attentionMask = new Array(inputIds.length).fill(1);
    return { inputIds, attentionMask };
}

async function runInference(model, inputIds, attentionMask) {
    const clippedInputIds = inputIds.map(id => Math.min(id, 513));

    const inputIdsTensor = tf.tensor2d([clippedInputIds], [1, clippedInputIds.length], 'int32');
    const attentionMaskTensor = tf.tensor2d([attentionMask], [1, attentionMask.length], 'int32');
    const tokenTypeIdsTensor = tf.zeros([1, inputIds.length], 'int32');

    const prediction = model.predict([inputIdsTensor, attentionMaskTensor, tokenTypeIdsTensor]);
    const result = prediction.arraySync()[0][0];

    inputIdsTensor.dispose();
    attentionMaskTensor.dispose();
    tokenTypeIdsTensor.dispose();
    prediction.dispose();

    return result;
}

function showNotification(result) {
    const message = result === "Spam" ? "⚠️ This email may be phishing" : "✅ This email appears safe";
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.top = "10px";
    notification.style.right = "10px";
    notification.style.padding = "10px";
    notification.style.backgroundColor = result === "Spam" ? "red" : "green";
    notification.style.color = "white";
    notification.style.fontSize = "16px";
    notification.style.zIndex = "1000";
    notification.innerText = message;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}
