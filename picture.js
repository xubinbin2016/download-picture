// 设置全局变量
let resultList = []
async function downJson(url) {
    const response = await fetch(url);
    // text: 返回文本数据
    response.text().then(text => {
        // 解析json数据
        const startIndex = text.indexOf('(');
        const endIndex = text.lastIndexOf(')');
        const json = JSON.parse(text.substring(startIndex + 1, endIndex));
        console.log(json);
        // 将数据赋值给全局变量
        resultList = json.data.photoList.map(item => item.url);

        const photoList = json.data.photoList.map(item => {
            return `<img src="${item.url}" alt="">`
        });

        const str = photoList.join()

        // 渲染数据到页面中
        const container = document.querySelector('.container');
        container.innerHTML = str;

        const count = photoList.length;
        document.querySelector('.count').innerText = count;
    });  
}
chrome.storage.sync.get("url", ({ url }) => {
    const newUrl = url.replace(/(pageStart=)\d+/, 'pageStart=0').replace(/(pageNum=)\d+/, 'pageNum=10000');  
    downJson(newUrl);
});