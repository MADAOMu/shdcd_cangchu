// 用于显示物料管理的数据
function displayWuliaoData(data) {
    // 获取用于显示数据的DOM元素
    const wuliaoDisplayArea = document.getElementById('wuliaoTableDisplay');

    // 如果数据为空，则显示提示信息
    if (data.length === 0) {
        wuliaoDisplayArea.innerHTML = '<p>无物料数据.</p>';
        return;
    }

    // 构建表格显示数据
    let displayHTML = '<table class="styled-table">';
    displayHTML += `
        <tr>
            <th>规格型号</th>
            <th>部件名称</th>
            <th>适用车型</th>
        </tr>`;

    // 遍历数据生成表格行
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        displayHTML += `
            <tr>
                <td>${item.规格型号}</td>
                <td>${item.部件名称}</td>
                <td>${item.适用车型}</td>
            </tr>`;
    }
    displayHTML += '</table>';

    // 清空显示区域的现有内容并更新HTML内容
    wuliaoDisplayArea.innerHTML = displayHTML;
}

// 用于获取物料数据并显示的函数
function fetchAndDisplayWuliaoData() {
    // 获取数据
    fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-wuliao.json')
        .then(response => response.json())
        .then(data => {
			// 存储物料数据到全局变量
			            wuliaoData = data;
            // 显示所有物料数据
            displayWuliaoData(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    // 添加筛选项的输入事件监听器
    document.getElementById('wuliaoGuige').addEventListener('input', updateWuliaoTable);
    document.getElementById('wuliaoBujian').addEventListener('input', updateWuliaoTable);
    document.getElementById('wuliaoChexing').addEventListener('input', updateWuliaoTable);
    // 添加按钮点击事件监听器
    document.getElementById('uploadDataButton').addEventListener('click', addnewDatabase);
    fetchAndDisplayWuliaoData();
    // ... 其他初始化代码
});

// 更新物料表格的函数
function updateWuliaoTable() {
    // 获取输入框的值
    const wuliaoGuigeValue = document.getElementById('wuliaoGuige').value;
    const wuliaoBujianValue = document.getElementById('wuliaoBujian').value;
    const wuliaoChexingValue = document.getElementById('wuliaoChexing').value;

    // 过滤数据
    const filteredWuliaoData = window.wuliaoData.filter(item =>
        (!wuliaoGuigeValue || item.规格型号.includes(wuliaoGuigeValue)) &&
        (!wuliaoBujianValue || item.部件名称.includes(wuliaoBujianValue)) &&
        (!wuliaoChexingValue || item.适用车型.includes(wuliaoChexingValue))
    );

    // 更新表格显示
    displayWuliaoData(filteredWuliaoData);
}

async function fetchWuliaoData(url) {
    console.log('Fetching data from:', url);  // Log URL being accessed
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Data fetched:', data);  // Log data fetched
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);  // Log any error occurred
    }
}

// 上传数据到服务器的函数
async function uploadWuliaoData(url, newData) {
    console.log('Uploading data to:', url);  // Log URL being accessed
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });
        if (response.ok) {
            console.log('Data uploaded successfully');
        } else {
            console.error('Failed to upload data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error uploading data:', error);  // Log any error occurred
    }
}

// 在添加新数据后调用此函数
async function addnewDatabase() {
    console.log('addnewDatabase called');

    const newGuigeValue = document.getElementById('newGuige').value;
    const newBujianValue = document.getElementById('newBujian').value;
    const newChexingValue = document.getElementById('newChexing').value;

    console.log('Values retrieved:', {
        newGuigeValue,
        newBujianValue,
        newChexingValue
    });

    if (!newGuigeValue || !newBujianValue || !newChexingValue) {
        console.error('请填写所有必要的字段：规格型号、部件名称和适用车型');
        return;
    }

    try {
        // 创建新的物料对象
        const newWuliaoData = {
            规格型号: newGuigeValue,
            部件名称: newBujianValue,
            适用车型: newChexingValue
        };

        // 获取现有数据
        const dataUrl = 'https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-wuliao.json';
        const existingData = await fetchWuliaoData(dataUrl);

        // 将新的物料对象添加到数据库
        existingData.push(newWuliaoData);

        // 上传更新后的数据到服务器
        await uploadWuliaoData(dataUrl, existingData);
        console.log('新物料已添加');

        // 重新加载和显示数据
        await fetchAndDisplayWuliaoData();
    } catch (error) {
        console.error('添加物料失败:', error);
    }
}
