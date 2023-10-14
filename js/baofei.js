// 格式化日期为 YYYY-MM-DD 的格式
function baofeiDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 显示报废日期
function showBaofeiDate() {
    const baofeiedDate = baofeiDate(new Date());
    document.getElementById('baofeiDate').value = baofeiedDate;
}

// 页面加载时显示当前日期
window.addEventListener('load', () => {
    showBaofeiDate();
});

// 定义一个函数用于显示报废管理的数据
function displayBaofeiData(data) {
    // 获取用于显示数据的DOM元素
    const baofeidisplayArea = document.getElementById('baofeiTableDisplay');

    // 如果数据为空，则显示提示信息
    if (data.length === 0) {
        baofeidisplayArea.innerHTML = '<p>无待报废物料.</p>'; 
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
            </tr>`;
    }
    displayHTML += '</table>';
    
    // 清空显示区域的现有内容并更新HTML内容
    baofeidisplayArea.innerHTML = displayHTML;
}

// 用于获取数据并显示的函数
function fetchAndDisplayBaofeiData() {
    // 获取数据
    fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json')
    .then(response => response.json())
    .then(data => {
        // 过滤出维修结果为报废的数据，并将其存储为全局变量
        window.baofeiQualifiedData = data.filter(item => item.维修结果 === '报废' && item.维修状态 === '维修');
        // 首次显示过滤后的数据
        displayBaofeiData(window.baofeiQualifiedData);
    })
    .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('baofeixuliehao').addEventListener('input', updateBaofeiTable);
    document.getElementById('baofeiguige').addEventListener('input', updateBaofeiTable);
    document.getElementById('baofeilaiyuandi').addEventListener('input', updateBaofeiTable);
    document.getElementById('confirmBaofeiButton').addEventListener('click', confirmBaofei);
    fetchAndDisplayBaofeiData();
    // ... 其他初始化代码
});

function updateBaofeiTable() {
    // 获取输入框的值
    const baofeixuliehaoValue = document.getElementById('baofeixuliehao').value;
    const baofeiguigeValue = document.getElementById('baofeiguige').value;
	const baofeilaiyuandiValue = document.getElementById('baofeilaiyuandi').value;

    // 过滤数据
    const BaofeiTableData = window.baofeiQualifiedData.filter(item =>
        (!baofeixuliehaoValue || item.序列号.includes(baofeixuliehaoValue)) &&
		(!baofeiguigeValue || item.规格型号.includes(baofeiguigeValue)) &&
        (!baofeilaiyuandiValue || item.来源地.includes(baofeilaiyuandiValue))
    );
    
    // 更新表格显示
    displayBaofeiData(BaofeiTableData);
}

async function uploadbaofeiData(url, data) {
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

async function fetchbaofeiData(url) {
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

async function confirmBaofei() {
    console.log('confirmBaofei called');  // Log when function is called

    const baofeixuliehaoValue = document.getElementById('baofeixuliehao').value;
    const baofeiguigeValue = document.getElementById('baofeiguige').value;
	const baofeilaiyuandiValue = document.getElementById('baofeilaiyuandi').value;
    const baofeiDateValue = document.getElementById('baofeiDate').value;
    const baofeiPersonValue = document.getElementById('baofeiPerson').value; 
	const baofeidiValue = document.getElementById('baofeidi').value; 

    console.log('Values retrieved:', {
        baofeixuliehaoValue,
        baofeiguigeValue,
		baofeilaiyuandiValue,
        baofeiDateValue,
        baofeiPersonValue,
		baofeidiValue
    });
    
    if (!baofeixuliehaoValue || !baofeiDateValue || !baofeiPersonValue || !baofeidiValue) {
        console.error('请填写序列号、报废日期和报废人员');
        return;
    }

    try {
            // 获取现有数据
            const dataUrl = 'https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json';
            const existingData = await fetchbaofeiData(dataUrl);
    
            // 查找与序列号匹配的数据项
            const index = existingData.findIndex(item => item.序列号 === baofeixuliehaoValue);
            if (index !== -1) {
                // 更新出库信息和显示属性
                existingData[index].出库日期 = baofeiDateValue;
                existingData[index].出库人员 = baofeiPersonValue;
				existingData[index].出货地 = baofeidiValue;
                existingData[index].维修状态 = '报废';  // 设置显示属性为 true
    
                // 上传更新后的数据
                await uploadbaofeiData(dataUrl, existingData);
                console.log('出库成功，显示属性已更新为 true');
    
                // 重新加载和显示数据
                await fetchAndDisplayBaofeiData();
            } else {
                console.error('未找到与序列号匹配的数据项:', baofeixuliehaoValue);
            }
    } catch (error) {
        console.error('报废操作失败:', error);
    }
}