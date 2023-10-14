document.addEventListener('DOMContentLoaded', function () {
  // 默认显示入库页面
  showPage('入库管理');
  refreshData();
});

function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
  });

  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.style.display = 'block';

    // 移除之前加载的脚本
    removeScript();

    // 加载新的脚本
    switch (pageId) {
      case '入库管理':
        loadScript('js/ruku.js');
        break;
      case '维修管理':
        loadScript('js/weixiu.js');
        break;
      case '物料管理':
        loadScript('js/wuliao.js');
        break;
      case '出库管理':
        loadScript('js/chuku.js');
        break;
      case '报废管理':
        loadScript('js/baofei.js');
        break;
      case '总库管理':
        loadScript('js/zongku.js');
        break;
      default:
        console.error('Invalid pageId:', pageId);
    }
  } else {
    console.error('Invalid pageId:', pageId);
  }
}

function loadScript(scriptName) {
  // 为脚本 URL 添加一个随机的查询参数以避免缓存
  const scriptUrl = scriptName + '?_=' + new Date().getTime();
  
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.id = 'dynamicScript';
  document.head.appendChild(script);
}

function removeScript() {
  const script = document.getElementById('dynamicScript');
  if (script) {
    script.parentNode.removeChild(script);
  }
}

function refreshData() {
    fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-wuliao.json')
        .then(response => response.json())
        .then(data => {
            // 更新您的数据和页面
            // 例如:
            // document.getElementById('someElement').innerText = data.someProperty;
        })
        .catch(error => console.error('Error fetching data:', error));
}

