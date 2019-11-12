const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  console.log("云函数入口");

  try {
  console.log('待检测文本:' + event.content);
    const result = await cloud.openapi.security.msgSecCheck({
      // touser: cloud.getWXContext().OPENID, // 通过 getWXContext 获取 OPENID
        content: event.content
      
    });
    console.log("内容安全审查结果：", res);

  if (result && result.errCode.toString() === '87014') {
    return {
      code: 300,
      msg: '内容含有违法违规内容',
      data: result
    } //
  } else {
    return {
      code: 200,
      msg: 'ok',
      data: result
    }
  }

  } catch (err) {
    if (err.errCode.toString() === '87014') {
      return {
        code: 300,
        msg: '内容含有违法违规内容',
        data: err
      } //
    }
    return {
      code: 400,
      msg: '调用security接口异常',
      data: err.message,
      stack: err.stack
    }
  }

}