const app = getApp()
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url: '',
    param: {}
  },
  onLoad: function(options) {
    var that = this;
    let param = JSON.parse(options.param)
    that.setData({
      param: param
    })
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function (res) {
    //           //从数据库获取用户信息
    //           that.queryUserInfo();
    //           //用户已经授权过
    //           wx.switchTab({
    //             url: options.mark
    //           })
    //         }
    //       });
    //     }
    //   }
    // })
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      e.detail.userInfo.openid = wx.getStorageSync('openid')
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      http('/api-web/customer/updateCustomer', e.detail.userInfo, '', 'post').then(res => {
        if (res.success) {
          //从数据库获取用户信息
          that.queryUserInfo();
        } else {
          dialog.dialog('警告', res.message, false, '确定')
        }
      })
      //授权成功后，跳转进入小程序首页
      // wx.switchTab({
      //     url: '/pages/my/my'  
      // })
    } else {
      //用户按了拒绝按钮
      dialog.dialog('警告', '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!', false, '返回授权')
    }
  },

  queryUserInfo: function () {
    var that = this;
    http('/api-web/customer/queryUserByOpenId?openid=' + wx.getStorageSync('openid'),'', '', 'post').then(res => {
      if (!res.success) {
        dialog.dialog('警告', '授权失败!!!', false, '返回授权')
        return
      }
      var user = res.object;
      if (undefined == user) {
        dialog.dialog('警告', '授权失败!!!', false, '返回授权')
        return
      }
      app.globalData.userInfo = user;
      //授权成功后，跳转进入小程序首页
      var page = that.data.param.page
      var url = that.data.param.url + '?id=' + escape(app.globalData.userInfo.id)
      if ('order' == page) {
        url = url + '&type=' + that.data.param.type
      }
      wx.redirectTo({
        url: url
      })
    })
  }

})