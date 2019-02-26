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

  /**
   * 设置全局变量
   */
  globalData: {
    userInfo:null,
    openid: 0,
    token:'',
    baseUrl: 'https://localhost',
    bearer: 'Bearer ',
    logType: ',JWT_WX'
  }
})
