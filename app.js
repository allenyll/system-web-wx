import Utils from 'utils/util.js';   // 工具函数
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
    that.globalData.windowHeight = wx.getSystemInfoSync().windowHeight
    that.globalData.windowWidth = wx.getSystemInfoSync().windowWidth
    // wx.login({
    //   success: res => {
    //     if (res.code) {
    //       wx.request({
    //         url: that.globalData.authUrl+'/wx/auth/token',
    //         data: {
    //           code: res.code,
    //           mode: 'sweb'
    //         },
    //         method: "POST",
    //         header: {
    //           'content-type': 'application/json',
    //           'login-type': 'wx'
    //         },
    //         success: function (res) {
    //           var token = res.data.object.accessToken;
    //           var openid = res.data.object.openid;
    //           that.globalData.openid = openid;
    //           that.globalData.token = token;
    //           wx.setStorageSync('openid', openid);
    //           wx.setStorageSync('token', token);
    //         }
    //       });
    //     }  
    //   }
    // });
  },
  /**
   * 动态设置页面标题
   */
  setPageTitle: function(title) {
    wx.setNavigationBarTitle({
      title: title //页面标题为路由参数
    })
  },
  /**
   * 设置全局变量
   */
  globalData: {
    userInfo:null,
    openid: 0,  
    token:'',
    baseHttpUrl: 'http://localhost:10001',
    baseUrl: 'https://localhost',
    authUrl: 'https://localhost:8443',
    // baseHttpUrl: 'http://www.allenyll.com',
    // baseUrl: 'https://www.allenyll.com',
    // authUrl: 'https://www.allenyll.com:8443',
    bearer: 'Bearer ',
    onLoadStatus: true,
    page: 1,
    limit: 10,
    isIphoneX: false,
    windowHeight: 0,
    windowWidth: 0
  },
  // 工具函数
  utils: Utils
})
