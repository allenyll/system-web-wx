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
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
              // wx.switchTab({
              //   url: '/pages/my/my'
              // })
            }
          });
        }
      }
    })
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

  queryUserInfo: function(){
    var that = this;
    var openid = wx.getStorageSync('openid');
    that.getUser(openid);
  },

  getUser: function(openid) {
    var that = this
    http('/api-web/customer/queryUserByOpenId?openid=' + openid,'', '', 'post').then(res => {
      if (!res.success) {
        dialog.dialog('警告', '授权失败!!!', false, '返回授权')
        reject('授权失败!!!')
        return
      }
      var user = res.object;
      if (undefined == user) {
        dialog.dialog('警告', '授权失败!!!', false, '返回授权')
        reject('授权失败!!!')
        return
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
        hasUserInfo: true
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
              mode: 'sweb',
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData
            }
            http('/api-web/customer/getPhoneNumber', param, '', 'post').then(res => {
              that.queryUserInfo();
            })
          }
        }
      })
    }else{
      dialog.dialog('警告', '授权失败', false, '绑定手机失败，请重新授权绑定')
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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