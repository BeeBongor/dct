const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

exports.main = async (event, context) => {


  console.log("云函数入口");

  try {
    return db.collection('users')
      .where({
        userId: event.openid
      })
      .update({
        data: {
          contactTel: event.tel,
          contactName: event.name
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