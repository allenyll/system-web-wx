const app = getApp()

const http = (url, data, header, method) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.baseUrl + url,
      method: method,
      data: data,
      header: {
        'Authorization': wx.getStorageSync('token'),
        'content-type': 'application/json',
        'login-type': 'wx'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else if (res.statusCode == 401) {
          wx.login({
            success: res => {
              if (res.code) {
                wx.request({
                  url: app.globalData.authUrl+'/wx/auth/token',
                  data: {
                    code: res.code,
                    mode: 'sweb'
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/json',
                    'login-type': 'wx'
                  },
                  success: function (res) {
                    var token = res.data.object.accessToken;
                    var openid = res.data.object.openid;
                    app.globalData.openid = openid;
                    app.globalData.token = token;
                    wx.setStorageSync('openid', openid);
                    wx.setStorageSync('token', token);
                    http(url, data, header, method).then(res => resolve(res));
                  }
                });
              }  
            }
          });
        } else {
          reject({ error: '服务器忙，请稍后重试', code: 500 });
          return;
        }
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
      },
      complete: function (res) {
        // complete
      }
    })
  })
}

module.exports = http
