// pages/saleOrder/saleOrder.js
const app = getApp()
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeList: [
      {
        label: '338',
        value: '338'
      }
    ],
    showCustomer: false,
    customerName: '',
    customerId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const customerId = wx.getStorageSync('s_customerId')
    const customerName = wx.getStorageSync('s_customerName')
    this.setData({
      customerId: customerId,
      customerName: customerName
    })
  },

  changCustomer: function(e) {
    const that = this
    if (e.detail) {
      that.setData({
        customerName: e.detail
      })
      that.getCustomerList()
    } else {
      that.hideCustomer()
    }
  },

  hideCustomer: function(e) {
    const that = this
    that.setData({
      showCustomer: false
    })
  },

  getCustomerList: function() {
    const that = this
    that.setData({
      customerList: []
    })
    let param = {
      customerName: that.data.customerName
    }
    http('/api-web/customer/getCustomerList/', param, '', 'post').then(res => {
      if (res.success) {
        that.setData({
          customerList: res.object,
          showCustomer: true
        })
      }
    }).catch(res => {
      dialog.dialog('错误', res.error + ',请联系客服', false, '确定')
    })
  },

  selectCustomer: function() {
    wx.navigateTo({
      url: '/pages/customer/customer'
    })
  },

  clickCustomer: function(e) {
    let id = e.currentTarget.dataset.id
    let name =  e.currentTarget.dataset.name
    wx.setStorageSync('s_customerId', id)
    wx.setStorageSync('s_customerName', name)
    this.setData({
      customerId: id,
      customerName: name
    })
    this.hideCustomer()
  },

  selectGoods: function() {
    wx.navigateTo({
      url: '/pages/chooseGoods/chooseGoods'
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