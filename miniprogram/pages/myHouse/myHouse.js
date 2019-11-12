// pages/myHouse/myHouse.js
var app = getApp()
var userId;
var common = require("../common/common.js");
var success = false;
const regeneratorRuntime = require('../../lib/runtime')
var cityName = '';
var hotelName = '';
var insertStatus = 0;
var contact = {
  name: "",
  tel: ""
};
var transRoad = '线上代订';
var unUseTime = '无';
var price = '';
var count = -1;
var beizhu = '';
const db = wx.cloud.database();
const _ = db.command;

Page({
  data: {
    barbottom: "建议&合作 微信:15071476193",
    editUpdateFlag:false,
    editUnUseTimePicker: [],
    editTransRoadPicker: [],
    transRoadPicker:[],
    transRoadIndex:0,
    
    unUseTimePicker: [],
    unUseTimeIndex: 0,
    userInfo: {},
    openId: '',
    myAllHotelInfo: [],
    showModalStatus: false,
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['1', '2', '3'], //下拉列表的数据
    editTransRoadIndex: 0, //选择的下拉列表下标
    editUnUseTimeIndex: 0,
    expireDate: "",
    editExpireDate: "",
    editDetailInfo: {},
    editModalHidden: true,
    unUseChooseShow: false,
    unUseTime: [{
      "id": "2001",
      "text": "无",
      "field": "unUseTime"
    }, {
      "id": "2002",
      "text": "五一、十一、春节",
      "field": "unUseTime"

    }, {
      "id": "2003",
      "text": "法定节假日均不可用",
      "field": "unUseTime"
    }, {
      "id": "2004",
      "text": "参考备注",
      "field": "unUseTime"
    }],
    transRoad: [{
      "id": "1000",
      "text": "线上代订",
      "field": "transRoad"
    }, {
      "id": "1001",
      "text": "线下邮寄",
      "field": "transRoad"
    }, {
      "id": "1002",
      "text": "电子券",
      "field": "transRoad"
    }, {
      "id": "2004",
      "text": "参考备注",
      "field": "unUseTime"
    }],
    hiddenCondition: true,
    errorInfo: ''

  },

  onPullDownRefresh() {
    this.getMyHotelInfo();
    wx.stopPullDownRefresh();
    this.popSuccessTest()

  },

  cityInput(e) {
    this.setData({
      hiddenCondition: false,
      errorInfo: ""
    })
    cityName = e.detail.value.trim()
    // console.log(cityName);
  },

  hotelNameInput(e) {
    this.setData({
      hiddenCondition: false,
      errorInfo: ""
    })
    hotelName = e.detail.value.trim()
  },

  contactInput(e) {
    this.setData({
      hiddenCondition: false,
      errorInfo: ""
    })
    contact.name = e.detail.value.trim()
  },

  contactTelInput(e) {
    this.setData({
      hiddenCondition: false,
      errorInfo: ""
    })
    contact.tel = e.detail.value.trim()
  },

  priceInput(e) {
    this.setData({
      hiddenCondition: false,
      errorInfo: ""
    })
    price = e.detail.value.trim()
  },

  countInput(e) {
    this.setData({
      hiddenCondition: false,
      errorInfo: ""
    })
    count = e.detail.value.trim()
  },

  beizhuInput(e) {
    this.setData({
      hiddenCondition: false,
      errorInfo: ""
    })
    beizhu = e.detail.value.trim()
  },

  getBottomBarInfo() {
    var filter = {
      key: _.eq("bottomBar")
    };
    common.getEnumValueByFilter(filter).then(res => {
      console.log("bottomBar get success", res);
      if (res.data[0].value != null && res.data[0].value != "") {
        this.setData({
          barbottom: res.data[0].value
        })
      }
    }).catch(res => {
      console.log("bottomBar get fail", res);
    })
  },

  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    // Do something when page show.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
  },

  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  
  onPageScroll: function() {
    // Do something when page scroll
  },
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // this.onGetOpenid()
    // while(success==false){}

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                user: res,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    this.getMyHotelInfo()
    this.getTransRoadEnum();
    this.getUnUseTimeEnum();
    this.getBottomBarInfo();
  },

  getTransRoadEnum(){
    var filter = {key:_.eq("transRoad")};
    this.getEnumValueByFilter(filter).then(res=>{
      console.log("transRoad get success", res);
      this.setData({
        transRoadPicker: res.data[0].value,
        editTransRoadPicker: res.data[0].value
      })
    }).catch(res=>{
      console.log("transRoad get fail",res);
    })
  },

  getUnUseTimeEnum() {
    var filter = { key: _.eq("unUseTime") };
    this.getEnumValueByFilter(filter).then(res => {
      console.log("unUseTimePicker get success", res);
      this.setData({
        unUseTimePicker: res.data[0].value,
        editUnUseTimePicker: res.data[0].value
      })
    }).catch(res => {
      console.log("unUseTimePicker get fail", res);
    })
  },

  getEnumValueByFilter(filter){
    return new Promise(function (resolve, reject) {
      db.collection("EnumValue").where(filter).get({
        success:res=>{
          resolve(res)
        },
        fail:res=>{
          reject(res)
        }
      })})
  },

  getMyHotelInfo() {
    var queryCondition = {
      "userId": app.globalData.openid,
      "queryKey": "openId"
    };

    // var res = common.onGetHouseByCondition(queryCondition);
    common.onGetHouseByCondition(queryCondition).then((res) => {
      console.log(res)
      this.setData({
        myAllHotelInfo: res.data,
        // a:a+1,
        // states: states
      })
    }).catch((res) => {
      console.log(res)
    })
  },

  onGetOpenid: function() {
    // 调用云函数
    let res = wx.cloud.callFunction({
      name: 'login',
      data: {},

      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        userId = res.result.openid

        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
        this.popSuccessTest()
        success = true;

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)

        success = true;
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
    console.log("res" + res)
  },

  popSuccessTest: function() {
    wx.showToast({
      title: '调用成功',
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1000, //停留时间
    })
  },

  powerDrawer: function(e) {
    if(app.globalData.openid==""){
      wx.showToast({
        icon:'',
        title: '请先点击左上角头像登录',
      })
      return
    }
    this.setData({
      hiddenCondition:true
    })
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    // this.selectModel()
  },
  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200, //动画时长  
      timingFunction: "linear", //线性  
      delay: 0 //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function() {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },

  transRoadInput(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        transRoadIndex: e.detail.value
      })
      transRoad = this.data.transRoadPicker[e.detail.value]
  },


  unUseTimeInput(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      unUseTimeIndex: e.detail.value
    })
    unUseTime = this.data.unUseTimePicker[e.detail.value]
  },

  submitInfoCheck() {

    //若联系方式为空 根据openId查询是否已填写联系方式
    //校验必填字段非空
    var pass = "false";
    if (count <= 0 || count.length > 2 || count > 99) {
      this.setData({
        hiddenCondition: false,
        errorInfo: "房券数量未填写或数量超过99或填写有误"
      })
      wx.showToast({
        title: '房券数量有误',
      })
      return pass;
      // return
    }
    if (unUseTime == "" || transRoad == "") {
      var error = transRoad == "" ? "请选择交易模式" : "请选择不可用时段"
      wx.showToast({
        title: error,
      })
      return pass;
      // return
    }
    if (hotelName.length == 0 || hotelName.length > 20) {
      this.setData({
        hiddenCondition: false,
        errorInfo: "酒店名未填写或长度超过20字符"
      })
      wx.showToast({
        title: '酒店名有误',
      })
      // return
      return pass;
    }
    if (cityName.length == 0 || cityName.length > 6) {
      this.setData({
        hiddenCondition: false,
        errorInfo: "城市未填写或城市字段超过6字符"
      })
      wx.showToast({
        title: '城市有误',
      })
      return pass;
      // return
    }
    if (price.length == 0 || price.length > 10) {
      this.setData({
        hiddenCondition: false,
        errorInfo: "价格未填写或价格字段超过10字符"
      })
      wx.showToast({
        title: '价格有误',
      })
      return pass;
      // return
    }
    //校验字段长度
    if (contact.name.length > 5 ) {
      this.setData({
        hiddenCondition: false,
        errorInfo: "联系人信息填写超过5字符，请重新提交"
      })
      return pass;
    }
    if (contact.tel != "" && contact.tel.length >15  ) {
      this.setData({
        hiddenCondition: false,
        errorInfo: "联系方式输入过长，请勿超过15个字符"
      })
      return pass;
    }
    
    if (beizhu.length  > 20) {
      this.setData({
        hiddenCondition: false,
        errorInfo: "备注填写超过20字符，请精简"
      })
      return pass;
    }
    
    return "pass";
  },

  submitHouseInfo() {
    var pass = this.submitInfoCheck();
    if (pass === "false") {
      return
    }
    if(insertStatus==1){
      wx.showToast({
        title: '正在提交',
      })
      return
    }
    insertStatus = 1;//正在insert
    //先查出数据库有没有该用户信息，若有，则视情况更新，若没有
    var dbName = '';
    var dbTel = '';
    this.getContactByUserId().then((res) => {
      dbName = res.contactName;
      dbTel = res.contactTel;
      if ((dbName == "" && contact.name == "") || (dbTel == "" && contact.tel == "")) {
        //线上没有且线下没有
        this.setData({
          hiddenCondition: false,
          errorInfo: "云端无您的联系信息，请填写联系方式"
        })
        return;
      } else if (dbName == "" && dbTel == "") {
        //线上没有
        this.insertUserContact();
      } else if ((contact.tel != "" && contact.tel != dbTel) || (contact.name != "" && contact.name != dbName)) {
        //线上线下不一致，更新
        contact.tel = contact.tel == "" ? dbTel : contact.tel;
        contact.name = contact.name == "" ? dbName : contact.name;
        //调用云函数更新
        wx.cloud.callFunction({
          name: 'updateUserInfo',
          data: {
            openid: app.globalData.openid,
            name: contact.name,
            tel: contact.tel
          },
        }).then(res => {
          console.log("更新用户数据成功：" + res)
        }).catch(error => {
          console.log("更新用户数据失败：" + error)
          //保证可用性，继续执行
        });
        // this.updateUserContact();
        //将不会更新历史数据
      }
      contact.tel = contact.tel == "" ? dbTel : contact.tel;
      contact.name = contact.name == "" ? dbName : contact.name;

      this.secCheckAndInsert();
      insertStatus = 0;
    }).catch((res) => {
      console.log(res)
      if (contact.tel == "" || contact.name == "") {
        this.setData({
          hiddenCondition: false,
          errorInfo: "云端无您的联系信息，请填写联系方式"
        })
        return
      }
      insertStatus = 0;
    })

  },

  secCheckAndInsert() {
    var now = common.getNowTime();
    //内容安全审查
    cityName = cityName.replace("市", "");

    var toCheck = cityName + hotelName + contact.name + contact.tel + price + count + beizhu;
    wx.cloud.callFunction({
      name: 'msgSecCheck',
      data: {
        content: toCheck
      },
    }).then(res => {
      console.log("内容安全审查结果：" ,res);
      if (res.result.code == "200") {
        //检测通过
        if (app.globalData.city.indexOf(cityName) == -1) {
          console.log("添加城市");
          //说明需要增加城市
          db.collection('City')
            .add({
              data: {
                name: cityName,
                createTime: now,
                priority: 0 //初始权重，均设置为0
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                app.globalData.city.push(cityName)
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
        } else {
          //TODO 该城市权重加1 优雅实现
          wx.cloud.callFunction({
            name: "updateByCondition",
            data: {
              collection: "City",
              condition: "name",
              name: cityName,
            },
          }).then(res => {
            console.log("更新用户数据成功：" + res)
          }).catch(error => {
            console.log("更新用户数据失败：" + error)
            //保证可用性，继续执行
          });

        }
        //insert到hotelCollection
        // console.log(now);
        //上传云端酒店集
        var expireDate = this.data.expireDate == "" ? common.getNextYearDate() : this.data.expireDate;
        db.collection('hotelCollection')
          .add({
            data: {
              hotelContact: contact.name + contact.tel,
              contactTel: contact.tel,
              contactName: contact.name,
              hotelCount: count,
              hotelName: hotelName,
              hotelCity: cityName,
              hotelPrice: price,
              ext: beizhu,
              openId: app.globalData.openid,
              createTime: now,
              transRoad: transRoad,
              unUseTime: unUseTime,
              priority: 10, //权重默认为10
              expireDate: expireDate
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
              this.setData({
                counterId: res._id,
                count: 1
              })
              wx.showToast({
                title: '新增记录成功',
              })
              this.setData({
                showModalStatus: false
              });
              this.getMyHotelInfo();
              this.clearInputData();
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
      } else {
        //执行不通过
        var v_content = res.result.msg;
        this.setData({
          hiddenCondition: false,
          errorInfo: v_content

        })
        return wx.showModal({
          title: "提示",
          content: v_content,
          showCancel: false,
          confirmText: "确定",
        });
        //return false;
      }
    }).catch(res => {
      console.log(res)
    })


  },

  getContactByUserId() {
    return new Promise(function(resolve, reject) {
      db.collection("users").where({
        userId: _.eq(app.globalData.openid)
      }).get({
        success: res => {
          console.log(res);
          if (res.data != "") {
            resolve(res.data[0])
          } else {
            var k = {
              contactName: "",
              contactTel: ""
            }
            resolve(k);
          }
        },
        fail: error => {
          console.log(error);
          reject(error)
        }
      });
    })
  },

  insertUserContact() {
    var now = common.getNowTime();
    return new Promise(function(resolve, reject) {
      db.collection('users')
        .add({
          data: {
            userId: app.globalData.openid,
            userName: app.globalData.username,
            contactName: contact.name,
            contactTel: contact.tel,
            createTime: now

          },
          success: res => {
            resolve(res)
          },
          fail: error => {
            reject(error)
          }
        })
    })
  },

  updateUserContactOnlyTel() {
    var now = common.getNowTime();
    return new Promise(function(resolve, reject) {
      db.collection('users')
        .where({
          openid: app.globalData.openid
        })
        .update({
          data: {
            contactTel: contact.tel,
            contactName: contact.name
          },
          success: res => {
            resolve(res)
          },
          fail: error => {
            reject(error)
          }
        })


    })
  },

  updateUserContact() {
    //todo 是否要同步更新hotel表中的信息
    var now = common.getNowTime();
    return new Promise(function(resolve, reject) {
      db.collection('users')
        .where({
          openid: app.globalData.openid
        })
        .update({
          data: {
            contactTel: contact.tel,
            contactName: contact.name
          },
          success: res => {
            resolve(res)
          },
          fail: error => {
            reject(error)
          }
        })


    })
  },

  clearInputData() {
    cityName = '';
    hotelName = '';
    contact = {
      name: "",
      tel: ""
    };
    price = '';
    count = -1;
    beizhu = '';
    transRoad = '线上代订';
    unUseTime = '无';
    this.setData({
      transRoadIndex:0,
      unUseTimeIndex: 0
    })
  },


  selectModel() {
    var index = 0; //li角标
    var classArr = [".search-select-input input", ".search-select-list li", ".search-select-list"] //获取选择器数组
    //添加获得焦点事件
    $(classArr[0]).focus(function() {
      $(".search-select-list").slideDown()
    })
    //添加失去焦点事件
    $(classArr[0]).blur(function() {
      $(".search-select-list").slideUp()
      index = 0;
      $(classArr[1]).removeClass("active");
    })
    //添加键盘按键抬起事件
    $(classArr[0]).on("keyup", function(e) {
      // console.log(e)
      var arrLength = $(classArr[1]).length;
      // console.log(arrLength)
      switch (e.keyCode) {
        case 40: //监听键盘下键
          index++;
          if (index > arrLength) {
            index = 1;
            $(classArr[2]).scrollTop(0);
          }
          $(classArr[1]).removeClass("active")
          $(classArr[1] + ":nth-child(" + index + ")").addClass("active");
          var top = $(classArr[1] + ":nth-child(" + index + ")").offset().top;
          console.log($(classArr[2]).scrollTop());
          if (top > 200)
            $(classArr[2]).scrollTop((index - 5) * 40);
          break;
        case 38: //监听键盘上键
          index--;
          if (index < 1)
            index = arrLength;
          $(classArr[1]).removeClass("active")
          $(classArr[1] + ":nth-child(" + index + ")").addClass("active");
          console.log($(classArr[1] + ":nth-child(" + index + ")").offset());
          var top = $(classArr[1] + ":nth-child(" + index + ")").offset().top;
          if (top > 200) {
            $(classArr[2]).scrollTop((index - 5) * 40);
          } else if (top < 40) {
            $(classArr[2]).scrollTop((index - 5) * 40)
          }
          console.log(top);
          break;
        case 13: //监听键盘回车键
          $(classArr[0]).val($(".search-select-list .active").text());
          break;
        default: //默认
          var text = $(this).val().trim();
          // console.log(text)
          if (text == "") {
            $(classArr[1]).show();
            return;
          }
          $(classArr[1]).each(function() {
            if ($(this).text().trim().indexOf(text) == -1) {
              $(this).hide();
            } else {
              $(this).show();
            }
          })
          break;
      }

    })
    //添加点击事件
    $(classArr[1]).on("click", function() {
      $(classArr[0]).val($(this).text())
    })
  },

  bandDateChange(e) {
    this.setData({
      expireDate: e.detail.value
    })
  },


  editDetailInfoById(e) {
    this.data.editUpdateFlag=false;
    var toEditId = e.target.dataset.id
    var hotelInfo = this.data.myAllHotelInfo
    for (var i in hotelInfo) {
      if (hotelInfo[i]._id === toEditId) {

        this.setData({
          editDetailInfo: hotelInfo[i],
          editExpireDate: hotelInfo[i].expireDate,
          editUnUseTimeIndex: this.data.editUnUseTimePicker.indexOf(hotelInfo[i].unUseTime),
          editTransRoadIndex: this.data.editTransRoadPicker.indexOf(hotelInfo[i].transRoad),
          editModalHidden: false
        })
        return
      }
    }
    wx.showToast({
      title: '请重试',
      icon: '',
      duration: 500, //停留时间
    })
  },

  modalCancel() {
    this.setData({
      editModalHidden: true
    })
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      editUnUseTimeIndex: e.detail.value
    })
    this.data.editDetailInfo.unUseTime = this.data.editUnUseTimePicker[e.detail.value]
    this.data.editUpdateFlag = true

  },

  bindTransRoadPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      editTransRoadIndex: e.detail.value
    })
    this.data.editDetailInfo.transRoad = this.data.editTransRoadPicker[e.detail.value]
    this.data.editUpdateFlag = true

  },

  editCityInput(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.editDetailInfo.hotelCity = e.detail.value
    console.log(this.data.editDetailInfo)
  },

  edithotelNameInput(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.editDetailInfo.hotelName = e.detail.value
    console.log(this.data.editDetailInfo)
  },

  editcontactNameInput(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.editDetailInfo.contactName = e.detail.value
    console.log(this.data.editDetailInfo)
  },

  eidtcontactTelInput(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.editDetailInfo.contactTel = e.detail.value
    this.data.editUpdateFlag = true
    console.log(this.data.editDetailInfo)
    
    this.hiddenEditError();

  },

  hiddenEditError(){
    this.setData({
      edithiddenCondition: true,
    })
  },

  editpriceInput(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.editDetailInfo.hotelPrice = e.detail.value.trim()
    this.data.editUpdateFlag = true
    console.log(this.data.editDetailInfo)
    this.hiddenEditError();
  },

  editcountInput(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.editDetailInfo.hotelCount = e.detail.value.trim()
    this.data.editUpdateFlag = true
    console.log(this.data.editDetailInfo)
    this.hiddenEditError();
  },

  editbeizhuInput(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.editDetailInfo.ext = e.detail.value.trim()
    this.data.editUpdateFlag = true
    console.log(this.data.editDetailInfo)
    this.hiddenEditError();
  },

  editBandDateChange(e) {
    this.setData({
      editExpireDate: e.detail.value
    })
    this.data.editDetailInfo.expireDate = e.detail.value
    this.data.editUpdateFlag = true
  },


  updateMyHouseDetail() {
    if (this.data.editUpdateFlag != true) {
      wx.showToast({
        icon: 'none',
        title: '未做修改',
      })
      this.setData({
        editModalHidden: true
      })
      this.data.editDetailInfo = null
      return
    }
    //内容校验
    var pass = this.inputInfoCheck()
    if (pass === "false") {
      return
    }
    //安全审核
    this.secCheckAndUpdate();
    //todo 刷新页面
  },

  secCheckAndUpdate() {
    var hotel = this.data.editDetailInfo;
    var toCheck = hotel.contactTel + hotel.hotelPrice + hotel.hotelCount + hotel.ext;
    wx.cloud.callFunction({
      name: 'msgSecCheck',
      data: {
        content: toCheck
      },
    }).then(res => {
        if (res.result.code == 200) {
          //云端更新操作
          hotel.updateTime = common.getNowTime();
          wx.cloud.callFunction({
            name: 'updateHotelById',
            data: {
              content: hotel
            },
            success:res=>{
              console.log("更新hotel信息成功"+res);
              this.setData({
                editModalHidden:true
              })
              wx.showToast({
                title: '更新成功',
              })
            },
            fail:res=>{
              console.log("更新hotel信息失败"+res);
              wx.showToast({
                title: '更新失败，call管理员',
              })
            }
          })
        } else {
          //执行不通过
          var v_content = res.result.msg;
          this.setData({
            edithiddenCondition: false,
            errorEditInfo: v_content
          })
          return wx.showModal({
            title: "提示",
            content: v_content,
            showCancel: false,
            confirmText: "确定",
          });
          //return false;
        }
      
    })
  .catch(res => {
    console.log(res)
  })
},

inputInfoCheck() {
  var pass = "false";
  var hotel = this.data.editDetailInfo;
  if (hotel.hotelPrice.length == 0 || hotel.hotelPrice.length > 10 || hotel.hotelPrice>2000) {
    this.setData({
      edithiddenCondition: false,
      errorEditInfo: "价格未填写或价格超过10字符或价格超过2000"
    })
    wx.showToast({
      title: '价格有误',
    })
    return pass;
    // return
  }
  //校验字段长度
  if (hotel.hotelCount > 99 || hotel.hotelCount.length == 0 || hotel.hotelCount.length > 2 ) {
    this.setData({
      edithiddenCondition: false,
      errorEditInfo: "房券数量未填写或超过99张，请重新提交"
    })
    return pass;
  }

  //校验字段长度
  if (hotel.contactTel.length > 15) {
    this.setData({
      edithiddenCondition: false,
      errorEditInfo: "联系方式填写超过15字符，请重新提交"
    })
    return pass;
  }
  if (hotel.ext.length>20) {
    this.setData({
      edithiddenCondition: false,
      errorEditInfo: "备注填写超过20字符，请精简"
    })
    return pass;
  }
  return "pass";
}

})