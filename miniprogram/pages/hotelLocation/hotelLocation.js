// pages/userConsole/userConsole.js
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
var city = "";
var hotel = "";

Page({

  data: {
    openid: ''
  },

  onShareAppMessage: function() {
    // return custom share data when user share.
    return {
      title:"查看酒店地址",
      desc:city+":"+hotel,
      path:"pages/hotelLocation/hotelLocation?city="+city+"&keyword="+hotel
    }
  },


  onLoad: function(options) {
    this.mapCtx = wx.createMapContext('myMap')
    var _this = this;
    qqmapsdk = new QQMapWX({
      key: 'RDDBZ-MJACF-OK5JC-NCRJI-4QAFE-LFFMS'
    });

    console.log(options.city)
    console.log(options.keyword)
    city = options.city;
    hotel = options.keyword;
    qqmapsdk.search({            
      keyword: options.keyword,
      region: options.city,
      success: function(res) {                
        console.log(res);   
        if(res.data.length<=0){
          wx.showToast({
            title: '亲~手动查下吧',
          }) ;
          return 
        }
        var mks = [];
        var points = [];        
        for (var i = 0; i < res.data.length; i++) {          
          points.push({
            longitude: res.data[i].location.lng,
            latitude: res.data[i].location.lat,
          })
          mks.push({ // 获取返回结果，放到mks数组中          
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../images/location2.png", //图标路径
            width: 40,
            height: 40          
          })  
        }  
        _this.setData({ //设置markers属性，将搜索结果显示在地图中    
          markers: mks        
        }) 
        _this.mapCtx.includePoints({
          padding: [10],points:points});          
      },
      fail: function(res) {                
        console.log(res);  
        wx.showToast({
          title: '亲~手动查下吧',
        })          
      },
    })

    console.log("页面载入")
  }
})