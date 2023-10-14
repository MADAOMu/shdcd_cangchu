(function() {
  const rukuxinxi = [];

// 格式化日期为 YYYY-MM-DD
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

function showCurrentDate() {
  const rukuedDate = rukuDate(new Date());
  document.getElementById('currentDate').value = rukuedDate;
}

// 页面加载时显示当前日期
window.addEventListener('load', () => {
  showCurrentDate();
  fetchRukuDataFromServer();
});

// 异步加载数据库数据
async function loadDatabase() {
  try {
    const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-wuliao.json');
    database = await response.json();
  } catch (error) {
    console.error('加载数据库出错:', error);
  }
}

// 监听规格型号输入框变化事件
async function handleguigexinghao() {
  const guigexinghao = document.getElementById('规格型号').value.toString();  // 获取规格型号输入值并强制转换为字符串
  
  try {
    const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-wuliao.json');
    if (!response.ok) throw new Error('网络错误: 无法加载数据库');
    const database = await response.json();
    console.log('数据库加载成功:', database);  // 输出加载的数据库
    
    // 在数据库中查找对应的部件名称和适用车型
    const matchingData = database.find(item => String(item.规格型号) === guigexinghao);
	console.log('匹配的数据:', matchingData);  // 输出匹配的数据

    const bujianmingcheng = document.getElementById('部件名称');
    const shiyongchexing = document.getElementById('适用车型');

    // 更新部件名称和适用车型输入框的值
    if (matchingData) {
      bujianmingcheng.value = matchingData.部件名称;
      shiyongchexing.value = matchingData.适用车型;
    } else {
      bujianmingcheng.value = '';
      shiyongchexing.value = '';
    }

  } catch (error) {
    console.error('错误:', error);
  }
}

// 直接监听规格型号输入框的变化事件
const guigexinghao = document.getElementById('规格型号');
guigexinghao.addEventListener('input', handleguigexinghao);

// 定义一个异步函数以上传数据至服务器
async function uploadDataToServer() {
  try {
    // 获取所需的数据
    const currentDate = document.getElementById('currentDate').value;
    const guige = document.getElementById('规格型号').value;
    const bujianmingcheng = document.getElementById('部件名称').value;
    const shiyongchexing = document.getElementById('适用车型').value;
    const tianbaoren = document.getElementById('入库人员').value;
    const laiyuandiSelect = document.getElementById('来源地');
    const laiyuandiOption = laiyuandiSelect.options[laiyuandiSelect.selectedIndex];
    const laiyuandiText = laiyuandiOption.text;
      // 获取所有五个序列号输入框的值
  const xuliehaos_upload = [
    document.getElementById('序列号1').value,
    document.getElementById('序列号2').value,
    document.getElementById('序列号3').value,
    document.getElementById('序列号4').value,
    document.getElementById('序列号5').value,
  ].filter(xuliehao => xuliehao);  // 过滤掉空的序列号
    const neikongmaDisplay = document.getElementById('neikongmaDisplay').innerText.split('\n');

    // 获取现有数据
    const responseGet = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json');
    if (!responseGet.ok) {
      throw new Error(`服务器错误: ${responseGet.statusText}`);
    }
    let existingData = await responseGet.json();

    // 检查 existingData 是否为数组，如果不是，初始化为一个空数组
    if (!Array.isArray(existingData)) {
      console.warn('Existing data is not an array, initializing a new array.');
      existingData = [];
    }

    // 为每个序列号和内控码创建一个数据对象，并添加到现有数据中
    xuliehaos_upload.forEach((xuliehao, index) => {
      const data = {
        维修状态: '入库',
		入库日期: currentDate,
        规格型号: guige,
        部件名称: bujianmingcheng,
        适用车型: shiyongchexing,
        入库人员: tianbaoren,
        来源地: laiyuandiText,
        序列号: xuliehao.trim(),
        内控码: neikongmaDisplay[index],
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
      existingData.push(data);
    });

    // 定义请求的选项
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(existingData)
    };

    // 发送请求
    const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json', requestOptions);

    // 检查响应是否成功
    if (!response.ok) {
      throw new Error(`服务器错误: ${response.statusText}`);
    }

    console.log('数据上传成功!');
    fetchRukuDataFromServer();  // 修改此行以在上传数据后获取并显示最新的数据

  } catch (error) {
    console.error('数据上传失败:', error);
  }
}

async function generateneikongma() {
    try {
        // 获取现有的数据
        const response = await fetch('https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json');
        if (!response.ok) {
            throw new Error(`服务器错误: ${response.statusText}`);
        }
        const existingData = await response.json();
			console.log('Existing data fetched:', existingData);

            const guige = document.getElementById('规格型号').value;
            const bujianmingcheng = document.getElementById('部件名称').value;
            const shiyongchexing = document.getElementById('适用车型').value;
            const xuliehaos_gen = [
                document.getElementById('序列号1').value,
                document.getElementById('序列号2').value,
                document.getElementById('序列号3').value,
                document.getElementById('序列号4').value,
                document.getElementById('序列号5').value,
            ].filter(xuliehao => xuliehao);  // 过滤掉空的序列号
            const selectedDate = document.getElementById('currentDate').value;
            const dateToUse = selectedDate ? new Date(selectedDate) : new Date();
            const rukuedDate = rukuDateYYMMDD(dateToUse);  // 使用新的函数
			const existingSerialNumbers = [];  // 创建一个数组来收集已存在的序列号

            // 检查是否已填写规格型号、部件名称和适用车型
            if (!guige || !bujianmingcheng || !shiyongchexing) {
                alert('请填写正确的规格型号');
                return;  // 如果有任何未填写的字段，则退出函数
            }

            // 检查是否提供了至少一个序列号
            if (xuliehaos_gen.length === 0) {
                alert('请填写至少一个序列号');
                return;  // 如果没有提供序列号，则退出函数
            }

            const laiyuandi = document.getElementById('来源地').value;
            const neikongmaDisplay = document.getElementById('neikongmaDisplay');

            // 初始化内控码显示为一个空字符串
            neikongmaDisplay.innerText = '';

            // 为每个序列号生成一个内控码
            xuliehaos_gen.forEach((xuliehao, index) => {
                        // 检查序列号是否已存在
                        const isExisting = existingData.some(item => item.序列号 === xuliehao.trim());
                        if (isExisting) {
                            existingSerialNumbers.push(xuliehao.trim());  // 如果序列号已存在，将其添加到数组中
                        }
            
                        const neikongma = `${rukuedDate}-${laiyuandi}-${guige.trim()}-${xuliehao.trim()}`;
            
                        // 在内控码显示区域添加新的内控码
                        neikongmaDisplay.innerText += `${neikongma}\n`;
                    });

            // 在函数末尾调用uploadDataToServer函数
                    uploadDataToServer();
            
                    // 检查是否有任何已存在的序列号，并显示消息
                    const existingSerialNumbersDisplay = document.getElementById('existingSerialNumbersDisplay');
                    if (existingSerialNumbers.length > 0) {
                        const existingMessage = `注意：以下序列号已存在：${existingSerialNumbers.join(', ')}`;
                        existingSerialNumbersDisplay.innerText = existingMessage;
                    } else {
                        existingSerialNumbersDisplay.innerText = '';  // 如果没有已存在的序列号，清空显示区
                    }
					
        } catch (error) {
            console.error('生成内控码时出错:', error);
        }
    }

// 定义一个函数以将数据显示在表格中
// 新增显示数据的函数
function displayRukuData(data) {
  const displayArea = document.getElementById('infoDisplay');
  // 过滤数据，只保留维修状态为“入库”的项目
  const filteredData = data.filter(item => item.维修状态 === '入库');

  if (filteredData.length === 0) {
    displayArea.innerHTML = '<p>无待入库物料.</p>';
    return;
  }

  // 构建表格
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

  for (let i = 0; i < filteredData.length; i++) {
    const item = filteredData[i];
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

  // 更新显示区域
  displayArea.innerHTML = displayHTML;
}

// 页面加载时调用从服务器获取数据的函数
window.addEventListener('load', () => {
  fetchRukuDataFromServer();
});

// 调用从服务器获取数据的函数
async function fetchRukuDataFromServer() {
  const url = 'https://dczbhcx.oss-cn-beijing.aliyuncs.com/DataBase-ruku.json';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Data from server:', data);

    // Store the data from server to savedData array
    rukuxinxi.length = 0;  // Clear the existing data
    Array.prototype.push.apply(rukuxinxi, data);  // Append the data from server

    // 调用显示数据的函数
    displayRukuData(rukuxinxi);

    return data;  // 返回数据以便在其他地方使用
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function exportToExcel(data) {
  const workbook = XLSX.utils.book_new();  // 创建一个新的工作簿
  const worksheet = XLSX.utils.json_to_sheet(data);  // 从你的数据创建一个工作表
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");  // 将工作表添加到工作簿中
  XLSX.writeFile(workbook, "入库数据库.xlsx");  // 将工作簿保存为文件
}

// 当用户点击导出按钮时调用 exportToExcel 函数
    document.getElementById('exportButton').addEventListener('click', () => {
        fetchRukuDataFromServer().then(data => {
            exportToExcel(rukuxinxi);  // 修改这里使用 rukuxinxi 代替 data
        });
    });

window.generateneikongma = generateneikongma;

})();