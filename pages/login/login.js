const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url: ''
  },
  onLoad: function(options) {
    var that = this;
    that.data.url = options.mark;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              that.queryUserInfo();
              //用户已经授权过
              wx.switchTab({
                url: options.mark
              })
            }
          });
        }
      }
    })
  },
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      e.detail.userInfo.openid = app.globalData.openid;
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        url: app.globalData.baseUrl + '/wx/wxLogin',
        data: e.detail.userInfo,
        method: "POST",
        header: {
          'Authorization': app.globalData.bearer + app.globalData.token + app.globalData.logType,
          'content-type': 'application/json',
        },
        success: function (res) {
          //从数据库获取用户信息
          that.queryUserInfo();
          console.log("插入小程序登录用户信息成功！");
        }
      });
      //授权成功后，跳转进入小程序首页
      console.log(that.data.url)
      wx.redirectTo({
        url: that.data.url
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },

  queryUserInfo: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/wx/queryUserByOpenId?openid=' + app.globalData.openid,
      method: "POST",
      header: {
        'Authorization': app.globalData.bearer + app.globalData.token + app.globalData.logType,
      },
      success: function (res) {
        var user = res.data.customer;
        app.globalData.userInfo = user;
        console.log(user)
      },
      fail: function (res) {

      }
    })
  }

})