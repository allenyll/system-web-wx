//index.js
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
//获取应用实例
var app = getApp()

Page({
  data: {
    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    logisticsFee: 0,
    totalAmount: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    pageType: "now",
    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null // 当前选择使用的优惠券
  },
  onShow: function () {
    var that = this;
    var cartList = [];
    //立即购买下单
    if ("buyNow" === that.data.orderType) {
      console.log('buyNow!!')
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      //that.data.kjId = buyNowInfoMem.kjId;
      if (buyNowInfoMem && buyNowInfoMem.cartList) {
        cartList = buyNowInfoMem.cartList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('cartInfo');
      //that.data.kjId = shopCarInfoMem.kjId;
      if (shopCarInfoMem && shopCarInfoMem.cartList) {
        cartList = shopCarInfoMem.cartList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: cartList,
    });
    console.log(that.data.goodsList)
    that.initAddress();
    that.dealPrice();
  },

  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType
    });
  },

  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder: function (e) {
    var that = this;
    //wx.showLoading();
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }

    var param = {
      goodsJsonStr: that.data.goodsJsonStr,
      remark: remark
    };
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        dialog.dialog('错误', '请先设置您的收货地址！', false, '确定');
        return;
      }
      param.province = that.data.curAddressData.province;
      param.city = that.data.curAddressData.city;
      if (that.data.curAddressData.region) {
        param.region = that.data.curAddressData.region;
      }
      param.detailAddress = that.data.curAddressData.detailAddress;
      param.name = that.data.curAddressData.name;
      param.phone = that.data.curAddressData.phone;
      param.postCode = that.data.curAddressData.postCode;
      param.fkAddressId = that.data.curAddressData.pkAddressId;
      param.goodsList = that.data.goodsList;
    }
    if (that.data.curCoupon) {
      param.couponId = that.data.curCoupon.pkCouponId;
    }
    if (!e) {
      param.calculate = "true";
    }

    console.log(param)
    http('/system-web/order/cacheOrder', param, null, 'post').then(res => {
      if(res.code == '100000'){
        console.log(res)
      }else{
        dialog.dialog('错误', '缓存订单失败', false, '确定');
      }
    });

    // wx.request({
    //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/create',
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: postData, // 设置请求的 参数
    //   success: (res) => {
    //     wx.hideLoading();
    //     if (res.data.code != 0) {
    //       wx.showModal({
    //         title: '错误',
    //         content: res.data.msg,
    //         showCancel: false
    //       })
    //       return;
    //     }

    //     if (e && "buyNow" != that.data.orderType) {
    //       // 清空购物车数据
    //       wx.removeStorageSync('shopCarInfo');
    //     }
    //     if (!e) {
    //       that.setData({
    //         isNeedLogistics: res.data.data.isNeedLogistics,
    //         allGoodsPrice: res.data.data.amountTotle,
    //         allGoodsAndYunPrice: res.data.data.amountLogistics + res.data.data.amountTotle,
    //         yunPrice: res.data.data.amountLogistics
    //       });
    //       that.getMyCoupons();
    //       return;
    //     }
    //     // 配置模板消息推送
    //     var postJsonString = {};
    //     //订单关闭
    //     postJsonString.keyword1 = { value: res.data.data.orderNumber, color: '#173177' }
    //     postJsonString.keyword2 = { value: res.data.data.dateAdd, color: '#173177' }
    //     postJsonString.keyword3 = { value: res.data.data.amountReal + '元', color: '#173177' }
    //     postJsonString.keyword4 = { value: '已关闭', color: '#173177' }
    //     postJsonString.keyword5 = { value: '您可以重新下单，请在30分钟内完成支付', color: '#173177' }
    //     app.sendTempleMsg(res.data.data.id, -1,
    //       'gVeVx5mthDBpIuTsSKaaotlFtl5sC4I7TZmx2PtEYn8', e.detail.formId,
    //       'pages/classification/index', JSON.stringify(postJsonString), 'keyword4.DATA');
    //     //订单已发货待确认通知
    //     postJsonString = {};
    //     postJsonString.keyword1 = { value: res.data.data.orderNumber, color: '#173177' }
    //     postJsonString.keyword2 = { value: res.data.data.dateAdd, color: '#173177' }
    //     postJsonString.keyword3 = { value: '已发货' }
    //     postJsonString.keyword4 = { value: '您的订单已发货，请保持手机通常，如有任何问题请联系客服13722396885', color: '#173177' }
    //     app.sendTempleMsg(res.data.data.id, 2,
    //       'ul45AoQgIIZwGviaWzIngBqohqK2qrCqS3JPcHKzljU', e.detail.formId,
    //       'pages/ucenter/order-details/index?id=' + res.data.data.id, JSON.stringify(postJsonString), 'keyword3.DATA');

    //     // 下单成功，跳转到订单管理界面
    //     wx.redirectTo({
    //       url: "/pages/ucenter/order-list/index"
    //     });
    //   }
    // })

  },

  initAddress: function () {
    var that = this;
    var param = {
      customerId: app.globalData.userInfo.pkCustomerId
    }
    http('/system-web/customerAddress/getAddressList', param, null, 'post').then(res => {
      if (res.code == '100000') {
        console.log(that.data.pageType )
        if(res.data.length > 0){
          for(let i=0; i < res.data.length; i++) {
            var mark = res.data[i].isDefault;
            if(that.data.pageType == 'back'){
              mark = res.data[i].isSelect
            }
            if(mark == 'SW1002'){
              that.setData({
                curAddressData: res.data[i]
              });
            }
            if(this.data.curAddressData == undefined){
              that.setData({
                curAddressData: res.data[0]
              });
            }
          }
        } else {
          that.setData({
            curAddressData: null
          })
        }
        //that.processYunfei();
      } else {
        dialog.dialog('错误', '获取收货地址失败，请联系管理员!', false, '确定');
      }
    });
  },

  dealPrice: function() {
    var that = this;
    var goodsList = this.data.goodsList;
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;
    var _logisticsFee = 0;
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      allGoodsPrice += carShopBean.price * carShopBean.number;
    }
    // 满299包邮
    if(allGoodsPrice < 299){
      _logisticsFee = 5
    }
    that.setData({
      allGoodsPrice: allGoodsPrice,
      logisticsFee: _logisticsFee,
      totalAmount: allGoodsPrice + _logisticsFee
    })
  },

  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;
    console.log(goodsList)
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      console.log(carShopBean.logistics)
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }
      goodsJsonStrTmp += '{"goodsId":"' + carShopBean.goodsId + '","number":' + carShopBean.number + ',"specValue":"' + carShopBean.specValue + '","logisticsType":0}';
      goodsJsonStr += goodsJsonStrTmp;
    }
    goodsJsonStr += "]";
    that.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: goodsJsonStr
    });
    that.setData({
      allGoodsPrice: allGoodsPrice
    })
    console.log(allGoodsPrice)
    //console.log(isNeedLogistics)
    //console.log(goodsJsonStr)
    that.createOrder();
  },

  addAddress: function () {
    wx.navigateTo({
      url: "/pages/add-address/addAddress"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/address/address"
    })
  },
  getMyCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
      data: {
        token: wx.getStorageSync('token'),
        status: 0
      },
      success: function (res) {
        if (res.data.code === 0) {
          var coupons = res.data.data.filter(entity => {
            return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
          });
          if (coupons.length > 0) {
            that.setData({
              hasNoCoupons: false,
              coupons: coupons
            });
          }
        }
      }
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex === -1) {
      this.setData({
        youhuijine: 0,
        curCoupon: null
      });
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  },
})
