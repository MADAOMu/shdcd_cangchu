// 定义一个函数用于显示总库管理的数据
function displayZongkuData(data) {
    // 获取用于显示数据的DOM元素
    const displayArea = document.getElementById('zongkuTableDisplay');

    // 如果数据为空，则显示提示信息
    if (data.length === 0) {
        displayArea.innerHTML = '<p>无数据.</p>'; 
        return;
    }

    // 构建表格显示数据
    let displayHTML = '<table class="styled-table">';
    displayHTML += `
        <tr>
            <th>维修状态</th>
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
			<th>出库日期</th>
			<th>出库人员</th>
			<th>出货地</th>
        </tr>`;

    // 遍历数据生成表格行
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        displayHTML += `
            <tr>
                <td>${item.维修状态}</td>
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
				<td>${item.出库日期}</td>
				<td>${item.出库人员}</td>
				<td>${item.出货地}</td>
            </tr>`;
    }
    displayHTML += '</table>';

    // 清空显示区域的现有内容并更新HTML内容
    displayArea.innerHTML = displayHTML;
}

// 用于获取数据并显示的函数
function fetchAndDisplayZongkuData() {
    // 获取数据
    fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json')
    .then(response => response.json())
    .then(data => {
        // 将获取到的数据存储为全局变量
        window.zongkuData = data;
        // 首次显示所有数据
        displayZongkuData(window.zongkuData);
    })
    .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('zongkuxuliehao').addEventListener('input', updateZongkuTable);
    document.getElementById('zongkuguige').addEventListener('input', updateZongkuTable);
    document.getElementById('zongkulaiyuandi').addEventListener('input', updateZongkuTable);
    document.getElementById('zongkuzhuangtai').addEventListener('input', updateZongkuTable);
    fetchAndDisplayZongkuData();
	// 当用户点击导出按钮时调用 exportToExcel 函数
	    document.getElementById('zongkudaochu').addEventListener('click', () => {
	        fetchZongkuDataFromServer().then(zongkuData => {
	            exportToExcel(zongkuData);  // 使用从服务器获取的数据
	        });
	    });
    // ... 其他初始化代码
});

function updateZongkuTable() {
    // 获取输入框的值
    const zongkuxuliehaoValue = document.getElementById('zongkuxuliehao').value;
    const zongkuguigeValue = document.getElementById('zongkuguige').value;
    const zongkulaiyuandiValue = document.getElementById('zongkulaiyuandi').value;
    const zongkuzhuangtaiValue = document.getElementById('zongkuzhuangtai').value;

    // 过滤数据
    const zongkuTableData = window.zongkuData.filter(item =>
        (!zongkuxuliehaoValue || item.序列号.includes(zongkuxuliehaoValue)) &&
        (!zongkuguigeValue || item.规格型号.includes(zongkuguigeValue)) &&
        (!zongkulaiyuandiValue || item.来源地.includes(zongkulaiyuandiValue)) &&
        (!zongkuzhuangtaiValue || item.维修状态.includes(zongkuzhuangtaiValue))
    );

    // 更新表格显示
    displayZongkuData(zongkuTableData);
}

// 定义导出到Excel的函数
function exportToExcel(zongkuData) {
    const workbook = XLSX.utils.book_new();  // 创建一个新的工作簿
    const worksheet = XLSX.utils.json_to_sheet(zongkuData);  // 从你的数据创建一个工作表
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");  // 将工作表添加到工作簿中
    XLSX.writeFile(workbook, "总库数据库.xlsx");  // 将工作簿保存为文件
}

// 用于从服务器获取数据的函数
async function fetchZongkuDataFromServer() {
    try {
        const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json');
        const zongkuData = await response.json();
        return zongkuData;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}