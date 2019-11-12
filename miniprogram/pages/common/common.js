const db = wx.cloud.database();

function onGetHouseByCondition(condition) {
  return new Promise(function (resolve, reject){
  // 创建数据库实例
  const db = wx.cloud.database();
  const _ = db.command;
  // 2. 构造查询语句
  // collection 方法获取一个集合的引用
  // 可以使用where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等）
  // get 方法会触发网络请求，往数据库取数据

  let filterObj = {};
  var queryKey = condition.queryKey;
  // console.log("queryKey:" + queryKey);
  // console.log("condition.openId:" + condition.userId);
  
  switch(queryKey){
    case "openId":
      filterObj.openId = _.eq(condition.userId);
      break;
    case "hotelCity":
      filterObj.hotelCity = _.eq(condition.hotelCity);
      break;
  }
  filterObj.disable = _.neq(1);
  // console.log("filterObj:"+filterObj.openId);

  // if(condition.)
  //todo 分页查询
  db.collection('hotelCollection').where(filterObj).get({
    success: res => {
      // console.log(res);
      resolve(res)
      
    },
    fail:res =>{
      reject("系统异常，请重试！")
    }
  })
  })

  // this.
}

function getEnumValueByFilter(filter) {
  return new Promise(function (resolve, reject) {
    db.collection("EnumValue").where(filter).get({
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}

// 获得当前时间 2019-02-02 14:06:08
function getNowTime() {
  // 加0
  function add_10(num) {
    return ++num;    
  }
  var myDate = new Date();
  myDate.getYear(); //获取当前年份(2位)
  myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  myDate.getMonth(); //获取当前月份(0-11,0代表1月)
  myDate.getDate(); //获取当前日(1-31)
  myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
  myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
  myDate.getHours(); //获取当前小时数(0-23)
  myDate.getMinutes(); //获取当前分钟数(0-59)
  myDate.getSeconds(); //获取当前秒数(0-59)
  myDate.getMilliseconds(); //获取当前毫秒数(0-999)
  myDate.toLocaleDateString(); //获取当前日期
  var nowTime = myDate.getFullYear() + '-' + add_10(myDate.getMonth()) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + add_10(myDate.getMinutes()) + ':' + add_10(myDate.getSeconds());
  return nowTime;
}

function getNextYearDate(){
  // 加0
  function add_10(num) {
    return ++num;
  }
  var myDate = new Date();
  myDate.getYear(); //获取当前年份(2位)
  myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  myDate.getMonth(); //获取当前月份(0-11,0代表1月)
  myDate.getDate(); //获取当前日(1-31)
  myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
  myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
  myDate.getHours(); //获取当前小时数(0-23)
  myDate.getMinutes(); //获取当前分钟数(0-59)
  myDate.getSeconds(); //获取当前秒数(0-59)
  myDate.getMilliseconds(); //获取当前毫秒数(0-999)
  myDate.toLocaleDateString(); //获取当前日期
  var nextYear = myDate.getFullYear()+1
  var nowTime = nextYear + '-' + add_10(myDate.getMonth()) + '-' + myDate.getDate() ;
  return nowTime;
}

function getNowDate() {
  // 加0
  function add_10(num) {
    return ++num;
  }
  var myDate = new Date();
  myDate.getYear(); //获取当前年份(2位)
  myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  myDate.getMonth(); //获取当前月份(0-11,0代表1月)
  myDate.getDate(); //获取当前日(1-31)
  myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
  myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
  myDate.getHours(); //获取当前小时数(0-23)
  myDate.getMinutes(); //获取当前分钟数(0-59)
  myDate.getSeconds(); //获取当前秒数(0-59)
  myDate.getMilliseconds(); //获取当前毫秒数(0-999)
  myDate.toLocaleDateString(); //获取当前日期
  var nextYear = myDate.getFullYear() + 1
  var nowTime = myDate.getFullYear() + '-' + add_10(myDate.getMonth()) + '-' + myDate.getDate();
  return nowTime;
}

function getNextMonthDate() {
  // 加0
  function add_10(num) {
    return ++num;
  }
  var myDate = new Date();
  myDate.getYear(); //获取当前年份(2位)
  myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  myDate.getMonth(); //获取当前月份(0-11,0代表1月)
  myDate.getDate(); //获取当前日(1-31)
  myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
  myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
  myDate.getHours(); //获取当前小时数(0-23)
  myDate.getMinutes(); //获取当前分钟数(0-59)
  myDate.getSeconds(); //获取当前秒数(0-59)
  myDate.getMilliseconds(); //获取当前毫秒数(0-999)
  myDate.toLocaleDateString(); //获取当前日期
  var nextYear = myDate.getFullYear() + 1
  var nowTime = myDate.getFullYear() + '-' + (add_10(myDate.getMonth())+1) + '-' + myDate.getDate();
  return nowTime;
}

module.exports.onGetHouseByCondition = onGetHouseByCondition;
module.exports.getNowTime = getNowTime;
module.exports.getNextYearDate = getNextYearDate;
module.exports.getNowDate = getNowDate;
module.exports.getNextMonthDate = getNextMonthDate;
module.exports.getEnumValueByFilter = getEnumValueByFilter;