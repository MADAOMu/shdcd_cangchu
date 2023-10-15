// 格式化日期为 YYYY-MM-DD 的格式
function rukuDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 格式化日期为 YYMMDD
function rukuDateYYMMDD(date) {
    const year = date.getFullYear().toString().slice(-2);  // 获取年份的后两位
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// 显示入库日期
function showrukuDate() {
    const rukuedDate = rukuDate(new Date());
    document.getElementById('rukuDate').value = rukuedDate;
}

// 监听规格型号输入框变化事件
async function updaterukuguige() {
    const rukuguige = document.getElementById('rukuguige').value.toString();  // 获取规格型号输入值并强制转换为字符串

    try {
        const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-wuliao.json');
        if (!response.ok) throw new Error('网络错误: 无法加载数据库');
        const loadwuliaodata = await response.json();
        console.log('数据库加载成功:', loadwuliaodata);  // 输出加载的数据库

        // 在数据库中查找对应的部件名称和适用车型
        const matchwuliaoData = loadwuliaodata.find(item => String(item.规格型号) === rukuguige);
        console.log('匹配的数据:', matchwuliaoData);  // 输出匹配的数据

        const rukubujian = document.getElementById('rukubujian');
        const rukuchexing = document.getElementById('rukuchexing');

        // 更新部件名称和适用车型输入框的值
        if (matchwuliaoData) {
            rukubujian.value = matchwuliaoData.部件名称;
            rukuchexing.value = matchwuliaoData.适用车型;
        } else {
            rukubujian.value = '';
            rukuchexing.value = '';
        }

    } catch (error) {
        console.error('错误:', error);
    }
}

// 在DOM内容加载后执行的初始化代码
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('rukuguige').addEventListener('input', updaterukuguige);
    document.getElementById('rukuneikongma').addEventListener('click', shenchengneikongma);
    fetchAndDisplayrukuData();
    showrukuDate();
    // ... 其他初始化代码
});

// 获取已有的数据
async function getExistingrukuData() {
    try {
        const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json');
        if (!response.ok) throw new Error('网络错误: 无法加载数据库');
        const existingrukuData = await response.json();
        return existingrukuData;
    } catch (error) {
        console.error('错误:', error);
        return [];
    }
}

// 上传数据到数据库
async function uploadrukuDatabase(dataArray) {
    try {
        const existingrukuData = await getExistingrukuData(); // 获取已有的数据

        // 合并新数据和已有数据
        const combinedrukuData = existingrukuData.concat(dataArray);

        const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(combinedrukuData)
        });

        if (!response.ok) {
            throw new Error('网络错误: 无法上传到数据库');
        }

        console.log('数据上传成功');
    } catch (error) {
        console.error('错误:', error);
    }
}

// 生成内控码并上传数据
async function shenchengneikongma() {
    console.log('shenchengneikongma called');  // 记录函数调用

    // 获取选定的日期
    const selectedDateInput = document.getElementById('rukuDate');
    const selectedDate = new Date(selectedDateInput.value);
    const rukuDateValue = rukuDate(selectedDate);
	const rukuDateYYMMDDValue = rukuDateYYMMDD(selectedDate);

    // 获取其他输入框的值
    const rukuguigeValue = document.getElementById('rukuguige').value;
    const rukubujianValue = document.getElementById('rukubujian').value;
    const rukuchexingValue = document.getElementById('rukuchexing').value;
    const rukurenyuanValue = document.getElementById('rukurenyuan').value;
    const rukulaiyuandiValue = document.getElementById('rukulaiyuandi').value;
	// 获取选定的来源地文本内容
	const rukulaiyuandiSelect = document.getElementById('rukulaiyuandi');
	const selectedOption = rukulaiyuandiSelect.selectedOptions[0]; // 获取选定的选项
	const rukulaiyuandiString = selectedOption ? selectedOption.textContent : '';
    const rukuxuliehaoDisplay = document.getElementById('rukuxuliehaochongfu'); // 显示重复序列号的区域

    // 获取所有五个序列号输入框的值
    const rukuxuliehaos_gen = [
        document.getElementById('rukuxuliehao1').value,
        document.getElementById('rukuxuliehao2').value,
        document.getElementById('rukuxuliehao3').value,
        document.getElementById('rukuxuliehao4').value,
        document.getElementById('rukuxuliehao5').value,
    ].filter(xuliehao => xuliehao);  // 过滤掉空的序列号

    // 检查是否已填写规格型号、部件名称和适用车型
    if (!rukuguigeValue) {
        alert('请填写正确的规格型号');
        return;  // 如果有任何未填写的字段，则退出函数
    }

    // 检查是否提供了至少一个序列号
    if (rukuxuliehaos_gen.length === 0) {
        alert('请填写至少一个序列号');
        return;  // 如果没有提供序列号，则退出函数
    }

    // 初始化内控码显示为一个空字符串
    rukuneikongmaDisplay.innerText = '';

    // 初始化重复序列号提示信息
    rukuxuliehaoDisplay.innerText = '';

    // 为每个序列号生成一个内控码
    for (const xuliehao of rukuxuliehaos_gen) {
        // 在数据库中检查是否存在相同的序列号
        const isDuplicate = await checkDuplicateSequenceNumber(xuliehao);

        if (isDuplicate) {
            // 如果序列号重复，显示提示信息
            rukuxuliehaoDisplay.innerText += `序列号 ${xuliehao} 重复\n`;
        }

        const rukuneikongma = `${rukuDateYYMMDDValue}-${rukulaiyuandiValue}-${rukuguigeValue}-${xuliehao}`;
        rukuneikongmaDisplay.innerText += `${rukuneikongma}\n`;
    }

    // 创建数据对象数组并调用函数上传数据
    const rukudataArray = rukuxuliehaos_gen.map(xuliehao => {
        return {
            维修状态: '入库',
            入库日期: rukuDateValue,
            规格型号: rukuguigeValue,
            部件名称: rukubujianValue,
            适用车型: rukuchexingValue,
            入库人员: rukurenyuanValue,
			来源地: rukulaiyuandiString,
            序列号: xuliehao,
            内控码: `${rukuDateYYMMDDValue}-${rukulaiyuandiValue}-${rukuguigeValue}-${xuliehao}`,
            维修日期: '',
            维修人员: '',
            维修结果: '',
            软件信息: '',
            硬件信息: '',
            故障现象: '',
            故障原因: '',
            故障处理: '',
            实际物资支出: '',
            实际支出: '',
            正常物资支出: '',
            正常支出: '',
            维修工时: '',
            出库日期: '',
            出库人员: '',
            出货地: ''
        };
    });

    // 调用函数上传数据
    uploadrukuDatabase(rukudataArray);
}

// 检查数据库中是否存在相同的序列号
async function checkDuplicateSequenceNumber(sequenceNumber) {
    try {
        const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json');
        if (!response.ok) throw new Error('网络错误: 无法加载数据库');
        const existingrukuData = await response.json();

        // 检查是否存在相同的序列号
        return existingrukuData.some(item => item.序列号 === sequenceNumber);
    } catch (error) {
        console.error('错误:', error);
        return false;
    }
}

// 定义一个函数用于显示报废管理的数据
function displayrukuData(data) {
    // 获取用于显示数据的DOM元素
    const rukudisplayArea = document.getElementById('rukuTableDisplay');

    // 如果数据为空，则显示提示信息
    if (data.length === 0) {
        rukudisplayArea.innerHTML = '<p>无入库物料.</p>'; 
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
    rukudisplayArea.innerHTML = displayHTML;
}

// 用于获取数据并显示的函数
function fetchAndDisplayrukuData() {
    // 获取数据
    fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json')
    .then(response => response.json())
    .then(data => {
        // 过滤出维修结果为报废的数据，并将其存储为全局变量
        window.rukuQualifiedData = data.filter(item => item.维修状态 === '入库');
        // 首次显示过滤后的数据
        displayrukuData(window.rukuQualifiedData);
    })
    .catch(error => console.error('Error fetching data:', error));
}