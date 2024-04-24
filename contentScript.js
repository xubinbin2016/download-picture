console.log("开始加载内容脚本了");
// 在页面上插入一个按钮
const buttonElement = document.createElement("button");
buttonElement.style.position = "fixed";
buttonElement.style.width = "100px";
buttonElement.style.height = "100px";
buttonElement.style.top = "100px";
buttonElement.style.right = "0px";
buttonElement.style.zIndex = "1000";
buttonElement.style.padding = "0";
buttonElement.style.fontSize = "20px";
buttonElement.style.cursor = "pointer";
buttonElement.innerText = "下载当前相册照片";
document.body.appendChild(buttonElement);


// 在页面中插入一个下载中的弹窗提示
const loadingElement = document.createElement("div");
loadingElement.style.position = "fixed";
loadingElement.style.width = "100%";
loadingElement.style.height = "100%";
loadingElement.style.top = "0";
loadingElement.style.left = "0";
loadingElement.style.backgroundColor = "rgba(0,0,0,0.5)";
loadingElement.style.color = "#ffffff";
loadingElement.style.fontSize = "50px";
loadingElement.style.textAlign = "center";
loadingElement.style.verticalAlign = "middle";
loadingElement.style.zIndex = "1000";
loadingElement.innerText = "正在下载中...";


// 多张调用方法
function getFile(url) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: url,
            responseType: 'blob'
        }).then(response => {
            resolve(response.data)
        }).catch(error => {
            reject(error.toString())
        })
    })
}
function downLoad(photoList = []) {
    if (photoList.length <= 0) {
      alert("无可导出图片");
    } else {
      let zip = new JSZip()
      let promises = []
      let cache = {}
      let promise
      for (let i = 0; i < photoList.length; i++) {
        promise = getFile(photoList[i]).then(data => {
          // 下载文件, 并存成ArrayBuffer对象
          zip.file(`${i+1}.jpg`, data, { binary: true })
          cache[i] = data
        })
        promises.push(promise)
      }
      console.log(promises);

      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(res => {
          // 生成二进制流
          saveAs(res, "相册图片.zip")
          // 利用file-saver保存文件  自定义文件名
        })
      }).catch(error => {
        console.log(error);
        alert("文件下载失败，请刷新页面并按F12,然后重新下载");
      }).finally(()=>{
        // 删除loading元素
        document.body.removeChild(loadingElement);
      })
    }
}
// 获取图片链接
function downJson(url) {
    const newUrl = url
    .replace(/(h5.qzone.qq.com)/, 'user.qzone.qq.com')
    .replace(/(pageStart=)\d+/, 'pageStart=0')
    .replace(/(pageNum=)\d+/, 'pageNum=10000')
    .replace(/(mode=)\d+/, 'mode=0');  

    fetch(newUrl)  
    .then(response => {
        // 检查响应是否成功 (状态码 200-299)  
        if (!response.ok) {  
            throw new Error('Network response was not ok');  
        }
        return response.text();  
    })  
    .then(text => { 
        // 解析json数据
        const startIndex = text.indexOf('(');
        const endIndex = text.lastIndexOf(')');
        const json = JSON.parse(text.substring(startIndex + 1, endIndex));
        if(json.data.photoList){
            const photoList = json.data.photoList.map(item => item.url);

            // 加载loading元素
            document.body.appendChild(loadingElement);
            downLoad(photoList)
        }else{
            alert(json.message)
        }
    })  
    .catch(error => {  
        // 在这里处理错误  
        console.error('There has been a problem with your fetch operation:', error);  
    });

}



async function getSyncDataAndNotify() {  
    try {  
        const items = await chrome.storage.sync.get("url");
        console.log(items);  
        if (items.url !== undefined) {  
            downJson(items.url) 
        } else { 
            alert('当前相册的url未获取到，请稍后再试。');
        }  
    } catch (error) {  
        console.error('获取url出错：', error);
    }  
}

// 监听按钮的点击事件
buttonElement.addEventListener("click", function() {
    getSyncDataAndNotify();
});
