// pages/my/my.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
                                url: '/pages/my/my'
                            })
                        }
                    });
                }
            }
        })
  },

  getUserInfo: function (e) {
      if (e.detail.userInfo) {
          e.detail.userInfo.openid = app.globalData.openid;
          //用户按了允许授权按钮
          var that = this;
          //插入登录的用户的相关信息到数据库
          wx.request({
            url:'https://localhost:8080/wx/wxLogin',
              data: e.detail.userInfo,
              method: "POST",
              header: {
                'Authorization': 'Bearer ' + app.globalData.token,
                'content-type': 'application/json',
              },
              success: function (res) {
                  //从数据库获取用户信息
                  that.queryUserInfo();
                  console.log("插入小程序登录用户信息成功！");
              }
          });
          //授权成功后，跳转进入小程序首页
          wx.switchTab({
              url: '/pages/my/my'  
          })
      } else {
          //用户按了拒绝按钮
          wx.showModal({
              title:'警告',
              content:'您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
              showCancel:false,
              confirmText:'返回授权',
              success:function(res){
                  if (res.confirm) {
                      console.log('用户点击了“返回授权”')
                  } 
              }
          })
      }
  },

  queryUserInfo:function(){
    var that = this;
    wx.request({
      url: 'https://localhost:8080/wx/queryUserByOpenId?openid=' + app.globalData.openid,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.token,
      },
      success: function (res) {
        console.log(res.data);
        app.globalData.userInfo = res.data.customer;
        console.log(app.globalData.userInfo);
        that.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
        console.log(that.data.canIUse);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})