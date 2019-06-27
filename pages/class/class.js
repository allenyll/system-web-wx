var app = getApp();
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0
  },
  onLoad: function (options) {
    this.getCategory();
  },

  onPullDownRefresh() {  
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // 增加下拉刷新数据的功能
    var self = this;
    this.getCategory();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  getCategory: function () {
    var that = this
    var param = {}
    wx.showLoading({
      title: '加载中...',
    });
    // 加载商品分类
    http('/system-web/category/tree', param, '', 'GET').then(res => {
      console.log(res)
      if (res.code == '100000') {
        that.setData({
          navList: res.list,
          currentCategory: res.list[0]
        });
        wx.hideLoading();
      }
    });
  },
  getCurrentCategory: function (id) {
    let that = this;
    http('/system-web/category/'+id, '', '', 'get')
      .then(function (res) {
        console.log(res);
        that.setData({
          currentCategory: res.tree[0]
        });
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  clickCategory: function (event) {
    console.log(event);
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }

    this.getCurrentCategory(event.currentTarget.dataset.id);
  }
})

