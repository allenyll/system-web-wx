const app = getApp()

const http = (url, data, header, method) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.baseUrl + url,
      method: method,
      data: data,
      header: {
        'Authorization': app.globalData.bearer + app.globalData.token + app.globalData.logType,
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.statusCode != 200) {
          reject({ error: '服务器忙，请稍后重试', code: 500 });
          return;
        }
        resolve(res.data);
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
