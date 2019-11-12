//index.js
const app = getApp()
const db = wx.cloud.database()
var a = -1;
var b = -1;
var searchKey = "";
var pageSize = 20;
var common = require("../common/common.js");
var c = -1;
var d = -1;
var chooseCity = '';
var city = 'all'; //默认全部，条件：所有的城市
var states = null;
const _ = db.command;
var common = require("../common/common.js");
var nextMonth = common.getNextMonthDate();;
var filterObj = {
  disable: _.neq(1),
  expireDate: _.gt(nextMonth)
};
var transRoad = 'all'; //默认全部 枚举值 1、线上代订，2、线下邮寄
Page({
  data: {
    barbottom: "建议&合作 微信:15071476193",
    intervalTime: 2000,
    theShowCity: "全部",
    searchValue: "",
    announcementHidden: true,
    announcementContent: [],
    pageChooseHidden: true,
    loginButton: "登录查看我的房券",
    totalPage: 0,
    currentPage: 0,
    // local  :,
    cityHidden: "false",
    allHotelInfo: [],
    detailHotel: {
      city: "",
      name: "",
      price: "",
      count: "",
      contact: "",
      unUseTime: "",
      transRoad: "",
      bz: ""
    },
    all_list: [{
      num: "21",
      name: "全部"
    }],
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    hotelData: [],
    hiddenDetailModal: true
  },

  onPullDownRefresh() {
    filterObj = {
      disable: _.neq(1),
      expireDate: _.gt(nextMonth)
    };
    searchKey = "";
    this.setData({
      searchValue: ""
    })
    this.getAllHotelInfo();
    this.getAllCityInfo();
    wx.stopPullDownRefresh();
    this.popSuccessTest()
  },

  onGetOpenid: function() {
    // 调用云函数
    let res = wx.cloud.callFunction({
      name: 'login',
      data: {},

      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        console.log("[云函数] [login] user", res.result)
        
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)


        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
    console.log("res" + res)
  },

  popSuccessTest: function() {
    wx.showToast({
      title: '加载成功',
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 500, //停留时间
    })
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        } else {
          console.log("用户未授权")
        }
      }
    })
    this.onGetOpenid();
    // 创建数据库实例

    this.getAllHotelInfo();
    this.getAllCityInfo();
    this.popSuccessTest();
    this.getAnnouncementInfo();
    this.getBottomBarInfo();
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



  getAnnouncementInfo() {
    db.collection('announcement')
      .where({
        disable: _.neq(1)
      }).orderBy("priority", "desc").get({
        success: res => {
          console.log("公告获取成功", res)
          if (res.data.length > 0) {
            this.setData({
              announcementHidden: false,
              announcementContent: res.data
            })
            this.getIntervalTime();
          }
        },
        fail: res => {
          console.log("公告获取失败")
        }
      })
  },

  getIntervalTime() {
    var filter = {
      key: _.eq("intervalTime")
    };
    common.getEnumValueByFilter(filter).then(res => {
      console.log("getIntervalTime get success", res);
      if (res.data[0].value != null && res.data[0].value != "") {
        this.setData({
          intervalTime: res.data[0].value
        })
      }
    }).catch(res => {
      console.log("getIntervalTime get fail", res);
    })
  },



  getAllCityInfo() {
    app.globalData.city = [];
    this.data.all_list = [{
      num: "21",
      name: "全部"
    }];
    var cityCount = 0;
    //查询城市总数
    db.collection('City')
      .where({
        _id: _.neq(10)
      })
      .count({
        success: res => {
          cityCount = res.total;

          var queryTimes = Math.ceil(cityCount / pageSize);
          for (var i = 0; i < queryTimes; i++) {
            //查询城市信息
            db.collection('City').orderBy("priority", "desc").field({
              name: true
            }).skip(pageSize * i).limit(pageSize).get({
              success: res => {
                console.log(res)
                this.setData({
                  all_list: this.data.all_list.concat(res.data)
                })
                for (var i in this.data.all_list) {
                  app.globalData.city.push(this.data.all_list[i].name)
                }
              }
            })
          }
        },
        fail: res => {
          console.log("查询城市总数失败：" + res)
        }
      })



  },

  getHotelCountByCondition(filterObj) {
    return new Promise((resolve, reject) => {
      filterObj.disable = _.neq(1);
      db.collection('hotelCollection').where(filterObj).count({
        success: res => {
          resolve(res)
        },
        fail: error => {
          reject(error)
        }
      })
    })
  },

  prePage() {
    if (this.data.currentPage < 1) {
      return
    }
    this.setData({
      currentPage: this.data.currentPage - 1
    })
    this.getHotelInfoByPageAndFilter(this.data.currentPage);
  },

  nextPage() {
    if (this.data.totalPage - this.data.currentPage <= 1) {
      return
    }
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    this.getHotelInfoByPageAndFilter(this.data.currentPage);
  },

  getHotelInfoByPageAndFilter(currentPage) {
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // 可以使用where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等）
    // get 方法会触发网络请求，往数据库取数据
    db.collection('hotelCollection').where(filterObj).orderBy("priority", "desc").skip(pageSize * currentPage).limit(pageSize).get({
      success: res => {
        console.log(res)
        this.setData({
          allHotelInfo: res.data
        })
      }
    })
  },

  getAllHotelInfo() {
    this.getHotelCountByCondition(filterObj).then(res => {
      console.log("查询结果", res),
        console.log("总数" + res.total);
      var hotelCount = res.total;

      var temp = Math.ceil(hotelCount / pageSize)
      var hiddenTemp = true;
      if (temp > 1) {
        hiddenTemp = false;
      }
      this.setData({
        pageChooseHidden: hiddenTemp,
        totalPage: temp,
        currentPage: 0
      });
      //查首页page
      this.getHotelInfoByPageAndFilter(0);
    }).catch(error => {
      console.log("查询结果", error);
    })
  },

  onShareAppMessage: function () {
    // return custom share data when user share.
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        loginButton: "查看我的房券",
      })
      app.globalData.username = e.detail.userInfo.nickName
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: '../myHouse/myHouse'
      });
    } else if (this.data.logged) {
      this.setData({
        loginButton: "查看我的房券",
      })

      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: '../myHouse/myHouse',

        success: function(res) {
          console.log("跳转成功", res)
        },
        fail: function(res) {
          console.log("跳转失败", res)
        },
        complete: function(res) {
          console.log("跳转完成", res)
        },

      });
    } else {
      wx.showToast({
        title: '登录后才可继续操作',
      })
    }
  },


  onClickMyHouse: function() {
    console.log("test")
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  selectByCity: function(e) {
    if (e.target.dataset.city === "全部") {
      chooseCity = '';
    } else {
      chooseCity = e.target.dataset.city;
    }
    if (searchKey != "") {
      filterObj = _.or([{
          hotelName: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        },
        {
          hotelCity: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        },
        {
          hotelContact: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        }
      ]).and([{
        disable: _.neq(1),
        expireDate: _.gt(nextMonth),
        hotelCity: db.RegExp({
          regexp: '.*' + chooseCity,
          options: 'i',
        })
      }]);
    } else {
      filterObj = {
        disable: _.neq(1),
        expireDate: _.gt(nextMonth),
        hotelCity: db.RegExp({
          regexp: '.*' + chooseCity,
          options: 'i',
        })
      };
    }
    this.getAllHotelInfo();
    states = 6;
    this.setData({
      states: states,
      theShowCity: e.target.dataset.city
    })
    // this.onGetHouseByCondition(queryCondition);
    // this.addCityPriorityByName();
  },

  changeBoxBtn: function(e) {
    // console.log(e.target.dataset.num);

    // var num = e.target.dataset.num;

    if (states == 0) {
      states = 6;
    } else {
      states = 0;
    }

    console.log("states:" + states)

    this.setData({
      states: states
    })
  },


  showDetailInfoById(e) {
    console.log(e.target.dataset.id);
    var toShowId = e.target.dataset.id
    var hotelInfo = this.data.allHotelInfo
    for (var i in hotelInfo) {
      if (hotelInfo[i]._id === toShowId) {
        this.setData({
          detailHotel: hotelInfo[i],
          hiddenDetailModal: false
        })
        return
      }
    }
    wx.showToast({
      title: '详情查询失败',
      icon: '',
      duration: 500, //停留时间
    })
  },


  showHotelMap(e){
    console.log('start to show map',e)
    var toShowId = e.currentTarget.dataset.id
    var hotelInfo = this.data.allHotelInfo
    for (var i in hotelInfo) {
      if (hotelInfo[i]._id === toShowId) {
        wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
          url: '../hotelLocation/hotelLocation?city=' + hotelInfo[i].hotelCity+"&keyword="+hotelInfo[i].hotelName
        });
        return
      }
    } 
  },

  modalCancel() {
    this.setData({
      hiddenDetailModal: true
    })
  },

  modalConfirm() {
    this.setData({
      hiddenDetailModal: true
    })
  },

  searchInput(e) {
    searchKey = e.detail.value;
  },

  searchByKey() {
    if (searchKey == "" && this.data.searchValue == "") {
      return
    }
    this.setData({
      searchValue: searchKey
    })
    if (chooseCity == "") {
      filterObj = _.or([{
          hotelName: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        },
        {
          hotelCity: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        },
        {
          hotelContact: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        }
      ]).and([{
        disable: _.neq(1),
        expireDate: _.gt(nextMonth)
      }]);
    } else {
      filterObj = _.or([{
          hotelName: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        },
        {
          hotelCity: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        },
        {
          hotelContact: db.RegExp({
            regexp: '.*' + searchKey,
            options: 'i',
          })
        }
      ]).and([{
        disable: _.neq(1),
        expireDate: _.gt(nextMonth),
        hotelCity: db.RegExp({
          regexp: '.*' + chooseCity,
          options: 'i',
        })
      }]);
    }

    this.getHotelCountByCondition(filterObj).then(res => {
      console.log("查询结果", res),
        console.log("总数" + res.total);
      var hotelCount = res.total;

      var temp = Math.ceil(hotelCount / pageSize)
      var hiddenTemp = true;
      if (temp > 1) {
        hiddenTemp = false;
      }
      this.setData({
        pageChooseHidden: hiddenTemp,
        totalPage: temp,
        currentPage: 0
      });
      //查首页page
      this.getHotelInfoByPageAndFilter(0);
      wx.showToast({
        title: '查询成功',
        duration: 500,
      })
    }).catch(error => {
      console.log("查询结果", error);
      wx.showToast({
        icon: "",
        title: '查询失败',
      })
    })
  }


})