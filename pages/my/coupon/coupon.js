const http = require('../../../utils/http.js')  // 引入
const dialog = require('../../../utils/dialog.js')  // 引入
//获取应用实例
var app = getApp()
Page({
  data: {
    coupons:[]
  },
  onLoad: function () {
    this.getCouponList();
  },
  onShow : function () {
    //this.getCouponList();
  },
  getCouponList: function () {
    console.log("aa")
    var that = this;
    var param = {
      customerId: app.globalData.userInfo.pkCustomerId
    }
    http('/system-web/coupon/getCouponList', param, null, 'post').then(res => {
      if (res.code == '100000') {
        console.log(res)
        const coupons = res.list;
        if (coupons.length > 0) {
          that.setData({
            coupons: coupons
          });
        }
      } else {
        dialog.dialog('错误', '获取优惠券失败', false, '确定');
      }
    });
  },
  goBuy:function(){
    wx.reLaunch({
      url: '/pages/classification/index'
    })
  }

})
