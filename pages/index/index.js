//index.js
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
//获取应用实例
const app = getApp()

// 导入js
Page({
  data: {
    banner: [],
    swiperCurrent: 0
  },

  scanClick:function(){
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res);
        wx.showToast({
          title: res.result,
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  onLoad: function () {
    var that = this
    this.getData()
  },

  getData: async function() {
    var that = this
    var param = {
      adType: 'SW2601',
      msgType: 'SW2702'
    };
    // 通知
    // await that.getMessages(param)
    // 轮播
    await that.getAds(param)
  },

  getMessages: function(param) {
    var that = this
    return new Promise((resolve, reject) => {
      http('/api-web/message/getMessageListByType', param, '', 'post').then(res => {
        if (res.code === '100000') {
          that.setData({
            notices: res.data.messageList
          })
        } else {
          dialog.dialog('错误', '获取通知失败，请联系管理员!', false, '确定');
        }
        resolve(res)
      });
    })
  },

  getAds: function(param) {
    var that = this
    return new Promise((resolve, reject) => {
      http('/api-web/ad/getAdList', param, '', 'post').then(res => {
        if (res.code === '100000') {
          that.setData({
            banner: res.data.adList
          })
        } else {
          dialog.dialog('错误', '获取轮播图失败，请联系管理员!', false, '确定');
        }
        resolve(res)
      });
    })
  },

  gotoGoods: function() {
    var that = this;
    if (app.globalData.userInfo === null) {
      var url = '/pages/goods/goods'
      var query = {
        url: url,
        type: '',
        page: 'goods'
      }
      wx.navigateTo({
        url: '/pages/login/login?param=' + JSON.stringify(query),
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/goods',
      })
    }
  },

  navigateToMiniProgram(){
    wx.navigateToMiniProgram({
     appId: 'wx95a6a02397595ace',
     path: 'pages/index/index',
     extraData: {
      from: 'sweb_wx'
     },
     envVersion: 'trial',
     success(res) {
      // 打开其他小程序成功同步触发
      wx.showToast({
       title: '跳转成功'
      })
     }
    })
   },

  //轮播图的切换事件
  swiperchange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  }
  
})
