// 监听declarativeNetRequest.onRuleMatchedDebug事件并打印URL
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(
    function (details) {
        // 打印图片的URL
        console.log(details.request.url);
        // 将url写入到本地文件
        chrome.storage.sync.set({ url: details.request.url });
    }
);