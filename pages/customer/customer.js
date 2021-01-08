// pages/customer/customer.js
const app = getApp()
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 20,
    customerList: [],
    customerCondition: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeight: app.globalData.windowHeight,
      tabBarHeight: app.globalData.tabBarHeight,
      scrollHeight: app.globalData.windowHeight + app.globalData.tabBarHeight - 100
    })
    this.getCustomerList()
  },

  getCustomerList: function() {
    const that = this
    let param = {
      customerName: that.data.customerCondition,
      page: that.data.page, 
      limit: that.data.size
    }
    var customerList = that.data.customerList
    http('/api-web/customer/getCustomerPage', param, '', 'post').then(res => {
      if (res.success) {
        var list = res.object.customerList
        for (var i=0; i < list.length; i++) {
          customerList.push(list[i])
        }
        that.setData({
          customerList: customerList,
          page: res.object.currentPage
        })
      }
    }).catch(res => {
      dialog.dialog('错误', res.error + ',请联系客服', false, '确定')
    })
  },

  getMore: function() {
    console.log('加载更多')
    var page = this.data.page
    setTimeout(() => {
      this.setData({
        page: page + 1
      })
      this.getCustomerList()
    })
  },

  onSearch: function(e) {
    this.setData({
      page: 1,
      customerList: []
    })
    this.setData({
      customerCondition: e.detail.value
    })
    this.getCustomerList()
  },

  onClear: function(e) {
    console.log(e.detail)
    this.setData({
      page: 1,
      customerList: []
    })
    this.setData({
      customerCondition: ''
    })
    this.getCustomerList()
  },

  onCancel: function(e) {
    console.log(e.detail)
  },

  toggleDrawer: function() {
    console.log('toggleDrawer')
  },

  clickAdd: function() {
    console.log('add')
  },

  selectCustomer: function(e) {
    let id = e.currentTarget.dataset.id
    let name =  e.currentTarget.dataset.name
    wx.setStorageSync('s_customerId', id)
    wx.setStorageSync('s_customerName', name)
    wx.navigateBack({})
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