import Utils from 'utils/util.js';   // 工具函数
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
    // that.globalData.windowHeight = wx.getSystemInfoSync().windowHeight
    // that.globalData.windowWidth = wx.getSystemInfoSync().windowWidth
    let systemInfo = wx.getSystemInfoSync()
	  // px转换到rpx的比例
    let pxToRpxScale = 750 / systemInfo.windowWidth;
    // 状态栏的高度
    let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
    // 导航栏的高度
    let navigationHeight = 44 * pxToRpxScale
    // window的宽度
    let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
    that.globalData.windowWidth = ktxWindowWidth
    // window的高度
    let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
    that.globalData.windowHeight =  ktxWindowHeight
    // 屏幕的高度
    let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
    that.globalData.screentHeight = ktxScreentHeight
    // 底部tabBar的高度
    let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight
    that.globalData.tabBarHeight = tabBarHeight
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
    // baseHttpUrl: 'http://www.allenyll.com:10001',
    // baseUrl: 'https://www.allenyll.com',
    // authUrl: 'https://www.allenyll.com:8443',
    bearer: 'Bearer ',
    onLoadStatus: true,
    page: 1,
    limit: 10,
    isIphoneX: false,
    windowHeight: 0,
    windowWidth: 0,
    screentHeight: 0,
    tabBarHeight: 0
  },
  // 工具函数
  utils: Utils
})
