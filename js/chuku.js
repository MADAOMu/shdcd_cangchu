// 格式化日期为 YYYY-MM-DD 的格式
function chukuDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 显示维修日期
function showchukuDate() {
    const chukuedDate = chukuDate(new Date());
    document.getElementById('chukuDate').value = chukuedDate;
}

// 页面加载时显示当前日期
window.addEventListener('load', () => {
    showchukuDate();
});

// 定义一个函数用于显示出库管理的数据
function displayChukuData(data) {
    // 获取用于显示数据的DOM元素
    const displayArea = document.getElementById('chukuTableDisplay');

    // 如果数据为空，则显示提示信息
    if (data.length === 0) {
        displayArea.innerHTML = '<p>无待出库物料.</p>'; 
        return;
    }

    // 构建表格显示数据
    let displayHTML = '<table class="styled-table">';
    displayHTML += `
        <tr>
            <th>入库日期</th>
            <th>规格型号</th>
            <th>部件名称</th>
            <th>适用车型</th>
            <th>入库人员</th>
            <th>来源地</th>
            <th>序列号</th>
            <th>内控码</th>
            <th>维修日期</th>
            <th>维修人员</th>
            <th>维修结果</th>
            <th>软件信息</th>
            <th>硬件信息</th>
            <th>故障现象</th>
            <th>故障原因</th>
            <th>故障处理</th>
            <th>实际物资支出</th>
            <th>实际支出</th>
            <th>正常物资支出</th>
            <th>正常支出</th>
            <th>维修工时</th>
        </tr>`;

    // 遍历数据生成表格行
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        displayHTML += `
            <tr>
                <td>${item.入库日期}</td>
                <td>${item.规格型号}</td>
                <td>${item.部件名称}</td>
                <td>${item.适用车型}</td>
                <td>${item.入库人员}</td>
                <td>${item.来源地}</td>
                <td>${item.序列号}</td>
                <td>${item.内控码}</td>
                <td>${item.维修日期}</td>
                <td>${item.维修人员}</td>
                <td>${item.维修结果}</td>
                <td>${item.软件信息}</td>
                <td>${item.硬件信息}</td>
                <td>${item.故障现象}</td>
                <td>${item.故障原因}</td>
                <td>${item.故障处理}</td>
                <td>${item.实际物资支出}</td>
                <td>${item.实际支出}</td>
                <td>${item.正常物资支出}</td>
                <td>${item.正常支出}</td>
                <td>${item.维修工时}</td>
            </tr>`;
    }
    displayHTML += '</table>';

    // 清空显示区域的现有内容并更新HTML内容
    displayArea.innerHTML = displayHTML;
}

// 用于获取数据并显示的函数
function fetchAndDisplayChukuData() {
    // 获取数据
    fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json')
    .then(response => response.json())
    .then(data => {
        // 过滤出维修结果为合格的数据，并将其存储为全局变量
        window.chukuqualifiedData = data.filter(item => item.维修结果 === '合格' && item.维修状态 === '维修');
        // 首次显示过滤后的数据
        displayChukuData(window.chukuqualifiedData);
    })
    .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chukuxuliehao').addEventListener('input', updatechukuTable);
    document.getElementById('chukuguige').addEventListener('input', updatechukuTable);
	document.getElementById('chukulaiyuandi').addEventListener('input', updatechukuTable);
	document.getElementById('confirmChukuButton').addEventListener('click', confirmChuku);
    fetchAndDisplayChukuData();
    // ... 其他初始化代码
});

function updatechukuTable() {
    // 获取输入框的值
    const chukuxuliehaoValue = document.getElementById('chukuxuliehao').value;
    const chukuguigeValue = document.getElementById('chukuguige').value;
	const chukulaiyuandiValue = document.getElementById('chukulaiyuandi').value;

    // 过滤数据
    const chukuTableData = window.chukuqualifiedData.filter(item =>
        (!chukuxuliehaoValue || item.序列号.includes(chukuxuliehaoValue)) &&
		(!chukuguigeValue || item.规格型号.includes(chukuguigeValue)) &&
        (!chukulaiyuandiValue || item.来源地.includes(chukulaiyuandiValue))
    );

    // 更新表格显示
    displayChukuData(chukuTableData);
}

async function uploadchukuData(url, data) {
    console.log('Uploading data:', data);  // Log data being uploaded
    try {
        const response = await fetch(url, {
            method: 'PUT',  // Assume you are using POST method to upload data
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        console.log('Server response:', responseData);  // Log server response
    } catch (error) {
        console.error('Error uploading data:', error);  // Log any error occurred
    }
}

async function fetchchukuData(url) {
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

async function confirmChuku() {
    console.log('confirmChuku called');  // Log when function is called

    const chukuxuliehaoValue = document.getElementById('chukuxuliehao').value;
    const chukuguigeValue = document.getElementById('chukuguige').value;
	const chukulaiyuandiValue = document.getElementById('chukulaiyuandi').value;
    const chukuDateValue = document.getElementById('chukuDate').value;
    const chukuPersonValue = document.getElementById('chukuPerson').value; 
	const chukudiValue = document.getElementById('chukudi').value; 

    console.log('Values retrieved:', {  // Log the values retrieved
        chukuxuliehaoValue,
        chukuguigeValue,
		chukulaiyuandiValue,
        chukuDateValue,
        chukuPersonValue,
		chukudiValue
    });
	
    if (!chukuxuliehaoValue || !chukuDate || !chukuPerson || !chukudi ) {
        console.error('请填写序列号');
        return;
    }

    try {
            // 获取现有数据
            const dataUrl = 'https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json';
            const existingData = await fetchchukuData(dataUrl);
    
            // 查找与序列号匹配的数据项
            const index = existingData.findIndex(item => item.序列号 === chukuxuliehaoValue);
            if (index !== -1) {
                // 更新出库信息和显示属性
                existingData[index].出库日期 = chukuDateValue;
                existingData[index].出库人员 = chukuPersonValue;
				existingData[index].出货地 = chukudiValue;
                existingData[index].维修状态 = '出库';  // 设置显示属性为 true
    
                // 上传更新后的数据
                await uploadchukuData(dataUrl, existingData);
                console.log('出库成功，显示属性已更新为 true');
    
                // 重新加载和显示数据
                await fetchAndDisplayChukuData();
            } else {
                console.error('未找到与序列号匹配的数据项:', chukuxuliehaoValue);
            }
        } catch (error) {
            console.error('出库操作失败:', error);
        }
    }
	
