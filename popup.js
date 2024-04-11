async function downJson(url) {
    console.log(url);
    const response = await fetch(url)

    // text: 返回文本数据
    response.text().then(text => {
        // 解析json数据
        const startIndex = text.indexOf('(');
        const endIndex = text.lastIndexOf(')');
        const json = JSON.parse(text.substring(startIndex + 1, endIndex));
        console.log(json);
    });

    // blob: 返回二进制数据流，适合图片等二进制数据
    // response.blob().then(blob => {
    //     const url = URL.createObjectURL(blob);  
    //     console.log(url);
    // });

    // json: 返回json数据
    // response.json().then(json => {  
    //     console.log(json);
    // });

    // arrayBuffer: 返回二进制数据流，适合音频等二进制数据
    // response.arrayBuffer().then(buffer => {
    //     console.log(buffer);
    // });

    // formData: 返回表单数据
    // response.formData().then(data => {
    //     console.log(data);
    // });
}

chrome.storage.sync.get("url", ({ url }) => {
    document.querySelector('button').onclick = () => {
        window.open('./picture.html')
    };
});