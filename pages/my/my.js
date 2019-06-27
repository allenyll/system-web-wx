// pages/my/my.js
//获取应用实例
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showPhone: false,
    phone: '',
    point: 0,
    balance: 0
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
                            that.data.hasUserInfo = true;
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
          http('/wx/wxLogin', e.detail.userInfo, '', 'post').then(res => {
            //从数据库获取用户信息
            that.queryUserInfo();
          })
          //授权成功后，跳转进入小程序首页
          wx.switchTab({
              url: '/pages/my/my'  
          })
      } else {
          //用户按了拒绝按钮
          dialog.dialog('警告', '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!', false, '返回授权')
      }
  },

  queryUserInfo:function(){
    var that = this;
    http('/wx/queryUserByOpenId?openid=' + app.globalData.openid,'', '', 'post').then(res => {
      var user = res.customer;
      if (undefined == user) {
        dialog.dialog('警告', '授权失败!!!', false, '返回授权')
        return
      }
      var customerPoint = res.customerPoint;
      var point = 0;
      if (undefined != customerPoint) {
        point = customerPoint.point;
      }
      var customerBalance = res.customerBalance;
      var balance = 0;
      if (undefined != customerBalance) {
        balance = customerBalance.balance;
      }
      app.globalData.userInfo = user;
      if (null != user.phone && '' != user.phone) {
        var phoneNumber = user.phone
        that.setData({
          showPhone: true,
          phone: phoneNumber.substring(0, 3) + '******' + phoneNumber.substring(9, 11)
        })
      }
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        point: customerPoint == undefined ? 0 : customerPoint.point,
        balance: customerBalance == undefined ? 0: customerBalance.balance
      })
    })
  },

  /**
   * 获取用户手机号
   */
  getPhoneNumber: function(e){
    var that = this;
    if(undefined != e.detail.iv){
      wx.login({
        success: res => {
          if (res.code) {
            const param = {
              code: res.code,
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData
            }
            http('/wx/getPhoneNumber', param, '', 'post').then(res => {
              console.log(res)
              that.queryUserInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/pages/my/my'
              })
            })
          }
        }
      })
    }else{
      dialog.dialog('警告', '授权失败', false, '绑定手机失败，请重新授权绑定')
    }
  },

  setAccount: function(){
    var that = this;
    if (that.data.hasUserInfo == false) {
      wx.navigateTo({
        url: '/pages/login/login?mark=/pages/my/account/account',
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/account/account?id=' + escape(app.globalData.userInfo.pkCustomerId),
      })
    }
  },

  /**
   * 积分详情页面
   */
  clickPoint: function() {
    var that = this;
    if (that.data.hasUserInfo == false) {
      wx.navigateTo({
        url: '/pages/login/login?mark=/pages/my/point/point',
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/point/point?id=' + escape(app.globalData.userInfo.pkCustomerId),
      })
    }
  },

  clickCash: function() {
    var that = this;
    if (that.data.hasUserInfo == false) {
      wx.navigateTo({
        url: '/pages/login/login?mark=/pages/my/cash/cash',
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/cash/cash?id=' + escape(app.globalData.userInfo.pkCustomerId),
      })
    }
  },

  clickVip: function() {
    wx.navigateTo({
      url: '/pages/my/vip/vip',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 订单管理点击事件
   */
  clickOrder: function(){
    var that = this;
    if(that.data.hasUserInfo == false){
      wx.navigateTo({
        url: '/pages/login/login?mark=/pages/my/order-list/order',
      })
    }else{
      wx.navigateTo({
        url: '/pages/my/order-list/order?id=' + escape(app.globalData.userInfo.pkCustomerId),
      })
    }
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
    var that = this;
    
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              that.data.hasUserInfo = true;
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