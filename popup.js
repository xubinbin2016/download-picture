chrome.storage.sync.get("url", ({ url }) => {
    localStorage.setItem("qzoneurl", url);
    document.querySelector('button').onclick = () => {
        window.open('./dist/index.html')
    };
});