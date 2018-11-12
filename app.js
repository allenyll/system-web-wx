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
            url: 'https://localhost:8080/wx/auth',
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
              console.log(openid);
              that.globalData.openid = openid;
              that.globalData.token = token;
            }
          });
        }  
      }
    });
  },

  /**
   * 设置全局变量
   */
  globalData: {
    userInfo:null,
    openid: 0,
    token:''
  }
})
