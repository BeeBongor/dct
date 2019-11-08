const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

exports.main = async (event, context) => {


  console.log("云函数入口" + event.collection + event.condition+event.name);
  var key = event.condition
  const _ = db.command;
  try {
    return db.collection("City")
      .where({
        //先这么写TODO 以后有需求再优化
        name:event.name
      })
      .update({
        data: {
          priority: _.inc(1)
        },
        success: res => {
          resolve(res)
        },
        fail: error => {
          reject(error)
        }
      })
  } catch (error) {
    return error;
  }

}