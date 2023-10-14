// 格式化日期为 YYYY-MM-DD 的格式
function weixiuDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 显示维修日期
function showWeixiuDate() {
    const weixiuedDate = weixiuDate(new Date());
    document.getElementById('weixiuDate').value = weixiuedDate;
}

// 页面加载时显示当前日期
window.addEventListener('load', () => {
    showWeixiuDate();
});

// 处理维修结果变更的函数
function handleRepairResultChange() {
    const repairResult = document.getElementById('weixiujieguo').value;
    const groupsToHide = document.querySelectorAll('.input-group');
    for (const group of groupsToHide) {
        if (repairResult === '报废') {
            group.style.display = 'none';
        } else {
            group.style.display = '';
        }
    }
}

// 定义一个函数用于显示维修管理的数据
function displayWeixiuData(data) {
    // 获取用于显示数据的DOM元素
    const displayArea = document.getElementById('weixiuTableDisplay');

    // 如果数据为空，则显示提示信息
    if (data.length === 0) {
        displayArea.innerHTML = '<p>无待维修物料.</p>';
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
            </tr>`;
    }
    displayHTML += '</table>';
    
    // 清空显示区域的现有内容并更新HTML内容
    displayArea.innerHTML = displayHTML;
}

// 用于获取数据并显示的函数
function fetchAndDisplayWeixiuData() {
    // 获取数据
    fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json')
    .then(response => response.json())
    .then(data => {
        // 过滤出维修状态为入库的数据，并将其存储为全局变量
        window.weixiuQualifiedData = data.filter(item => item.维修状态 === '入库');
        // 首次显示过滤后的数据
        displayWeixiuData(window.weixiuQualifiedData);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// 在文档加载完毕后执行
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirmWeixiuButton').addEventListener('click', confirmWeixiu);
    document.getElementById('weixiuxuliehao').addEventListener('input', updateweixiuTable);
    document.getElementById('weixiuguige').addEventListener('input', updateweixiuTable);
    document.getElementById('weixiulaiyuandi').addEventListener('input', updateweixiuTable);
    document.getElementById('weixiujieguo').addEventListener('change', handleRepairResultChange);
    fetchAndDisplayWeixiuData();
    // ... 其他初始化代码
});

function updateweixiuTable() {
    // 获取输入框的值
    const weixiuxuliehaoValue = document.getElementById('weixiuxuliehao').value;
    const weixiuguigeValue = document.getElementById('weixiuguige').value;
	const weixiulaiyuandiValue = document.getElementById('weixiulaiyuandi').value;

    // 过滤数据
    const WeixiuTableData = window.weixiuQualifiedData.filter(item =>
        (!weixiuxuliehaoValue || item.序列号.includes(weixiuxuliehaoValue)) &&
		(!weixiuguigeValue || item.规格型号.includes(weixiuguigeValue)) &&
        (!weixiulaiyuandiValue || item.来源地.includes(weixiulaiyuandiValue))
    );
    
    // 更新表格显示
    displayWeixiuData(WeixiuTableData);
}

async function uploadWeixiuData(url, data) {
    console.log('Uploading data:', data);  // Log data being uploaded
    try {
        const response = await fetch(url, {
            method: 'PUT',  // Assume you are using PUT method to upload data
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

async function fetchWeixiuData(url) {
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

async function confirmWeixiu() {
    console.log('confirmWeixiu called');  // Log when function is called
	const weixiuxuliehaoValue = document.getElementById('weixiuxuliehao').value;
    const weixiuDateValue = document.getElementById('weixiuDate').value;
    const weixiuPersonValue = document.getElementById('weixiuPerson').value;
	const weixiujieguoValue = document.getElementById('weixiujieguo').value;
	const ruanjianxinxiValue = document.getElementById('ruanjianxinxi').value;
	const yinjianxinxiValue = document.getElementById('yinjianxinxi').value;
	const guzhangxianxiangValue = document.getElementById('guzhangxianxiang').value;
	const guzhangyuanyinValue = document.getElementById('guzhangyuanyin').value;
	const guzhangchuliValue = document.getElementById('guzhangchuli').value;
	const shijiwuziValue = document.getElementById('shijiwuzi').value;
	const shijizhichuValue = document.getElementById('shijizhichu').value;
	const zhenchangwuziValue = document.getElementById('zhenchangwuzi').value;
	const zhenchangzhichuValue = document.getElementById('zhenchangzhichu').value;
	const weixiugongshiValue = document.getElementById('weixiugongshi').value;
    // ... 其他输入值

    console.log('Values retrieved:', {
        weixiuDateValue,weixiuPersonValue,weixiujieguoValue,
		ruanjianxinxiValue,yinjianxinxiValue,
		guzhangxianxiangValue,guzhangyuanyinValue,guzhangchuliValue,
		shijiwuziValue,shijizhichuValue,zhenchangwuziValue,zhenchangzhichuValue,weixiugongshiValue
        // ... 其他输入值
    });
    
    if (!weixiuDateValue || !weixiuPersonValue) {
        console.error('请填写维修日期和维修人员');
        return;
    }

    try {
        const dataUrl = 'https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json';
        const existingData = await fetchWeixiuData(dataUrl);

        const index = existingData.findIndex(item => item.序列号 === weixiuxuliehaoValue);
        if (index !== -1) {
            existingData[index].维修日期 = weixiuDateValue;
            existingData[index].维修人员 = weixiuPersonValue;
			existingData[index].维修结果 = weixiujieguoValue;
			existingData[index].软件信息 = ruanjianxinxiValue;
			existingData[index].硬件信息 = yinjianxinxiValue;
			existingData[index].故障现象 = guzhangxianxiangValue;
			existingData[index].故障原因 = guzhangyuanyinValue;
			existingData[index].故障处理 = guzhangchuliValue;
			existingData[index].实际物资支出 = shijiwuziValue;
			existingData[index].实际支出 = shijizhichuValue;
			existingData[index].正常物资支出 = zhenchangwuziValue;
			existingData[index].正常支出 = zhenchangzhichuValue;
			existingData[index].维修工时 = weixiugongshiValue;
			
            // ... 其他字段更新
            existingData[index].维修状态 = '维修';
    
            await uploadWeixiuData(dataUrl, existingData);
            console.log('维修信息更新成功');
    
            await fetchAndDisplayWeixiuData();
        } else {
            console.error('未找到与维修日期匹配的数据项:', weixiuDateValue);
        }
    } catch (error) {
        console.error('维修操作失败:', error);
    }
}

function testClick() {
    console.log('Button clicked');
}
