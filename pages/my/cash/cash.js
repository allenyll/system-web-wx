//index.js
const http = require('../../../utils/http.js')  // 引入
//获取应用实例
var app = getApp()
Page({
  data: {
    id: '', // 用户ID
    images: '',
    items: [],
    balance: 0
  },
  onLoad: function (options) {
    this.setData({
      id: unescape(options.id)
    })
    this.getBalance();
    wx.request({
      url: 'http://www.easy-mock.com/mock/5906811e7a878d73716e32c9/viplist/itemlist',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: (res) => {
        console.log(res);
        this.setData({
          images: res.data.image,
          items: res.data.item
        });
      }
    })
  },

  // 获得余额详情数据
  getBalance: function () {
    let that = this;
    var param = {
      customerId: app.globalData.userInfo.pkCustomerId
    }
    http('/system-web/customerBalance/getBalance', param, '', 'POST').then(res => {
      that.setData({
        'balance': Number(res.customerBalance.balance)
      });
    })
  },

  clickCharge: function () {
    wx.navigateTo({
      url: '/pages/my/recharge/charge',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 收支明细页面
   */
  clickBalanceDetail: function () {
    var that = this;
    if (that.data.hasUserInfo == false) {
      wx.navigateTo({
        url: '/pages/login/login?mark=/pages/my/cash/balancedetail/balancedetail',
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/cash/balancedetail/balancedetail?id=' + escape(app.globalData.userInfo.pkCustomerId),
      })
    }
  },
})