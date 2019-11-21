const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database(); 

exports.main = async (event, context) => {


  console.log("云函数入口" + event.content);
  var hotel = event.content;
  console.log("参数日志:id " + hotel._id + " hotel.contactTel: " + hotel.contactTel
    + "hotel.hotelPrice: " + hotel.hotelPrice + "hotelContact: " + hotel.contactName + " " + hotel.contactTel + "updateTime: " + hotel.updateTime + "hotelCount: " + hotel.hotelCount);

  try {
    return db.collection('hotelCollection')
      .where({
        _id: hotel._id
      })
      .update({
        data: {
          // hotel.contactTel + hotel.hotelPrice + hotel.hotelCount + hotel.ext
          contactTel: hotel.contactTel,
          hotelPrice: hotel.hotelPrice,
          hotelContact: hotel.contactName + " " + hotel.contactTel,
          updateTime: hotel.updateTime,
          hotelCount: hotel.hotelCount,
          ext: hotel.ext,
          transRoad: hotel.transRoad,
          unUseTime: hotel.unUseTime,
          expireDate: hotel.expireDate
        },
        success: res => {
          resolve(res)
        },
        fail: error => {
          reject(error)
        }
      })
  } catch (error) {
    console.log(error);
  }

}
