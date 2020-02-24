import Utils from 'utils/util.js';   // 工具函数
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: that.globalData.baseUrl+'/wx/auth',
            data: {
              code: res.code
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              console.log(res.data.token);
              var token = res.data.token;
              var openid = token.substring(token.indexOf("#") + 1, token.length);
              that.globalData.openid = openid;
              that.globalData.token = token;
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('token', token);
              //that.getCategory();
            }
          });
        }  
      }
    });
  },

  /**
   * 动态设置页面标题
   */
  setPageTitle: function(title) {
    wx.setNavigationBarTitle({
      title: title //页面标题为路由参数
    })
  },

  getCategory: function() {
    var that = this
    // 加载商品分类
    wx.request({
      url: that.globalData.baseUrl + '/system-web/category/tree',
      header: {
        'Authorization': that.globalData.bearer + that.globalData.token + that.globalData.logType,
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        var categories = []; //{ id: 0, name: "全品类" }
        if (res.data.code == '100000') {
          for (var i = 0; i < res.data.list.length; i++) {
            console.log(res.data.list[i]);
            categories.push(res.data.list[i]);
          }
        }
        that.globalData.categories = categories
        //that.getGoods(0);//获取全品类商品
      },
      fail: function () {
        that.globalData.onLoadStatus = false
        wx.hideLoading()
        console.log('11')
      }
    })
    //getGoods(0);
  },
  getGoods: function(categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    wx.request({
      url: that.getGoods.baseUrl + '/system-web/goods/getGoods',
      data: {
        page: that.globalData.page,
        pageSize: that.gloablData.pageSize,
        categoryId: categoryId
      },
      success: function(res){
        that.globalData.goods = [];
        var goods = [];
        if(res.data.code != '100000' || res.data.goods.length == 0){
          return;
        }
        var tempGoods;
        for(var i=0; i<res.data.goods.length; i++){
          tempGoods = res.data.goods[i];
          tempGoods.price = tempGoods.price.toFixed(2);
          tempGoods.marketPrice = tempGoods.marketPrice.toFixed(2);
          tempGoods.costPrice = tempGoods.costPrice.toFixed(2);
          goods.push(tempGoods);
        }
      }
    })
  },
  /**
   * 设置全局变量
   */
  globalData: {
    userInfo:null,
    openid: 0,  
    token:'',
    baseUrl: 'https://localhost',
    bearer: 'Bearer ',
    logType: ',JWT_WX',
    onLoadStatus: true,
    page: 1,
    limit: 10,
    userCoupon: 'NO_USE_COUPON',//默认不适用优惠券
    courseCouponCode: {},//购买课程的时候优惠券信息
    isIphoneX: false
  },

  // 工具函数
  utils: Utils
})
