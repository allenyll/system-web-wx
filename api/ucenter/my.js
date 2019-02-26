import request from '../../utils/request.js'

class my {
  app = getApp()

  constructor() {
    this._defaultHeader =  {
      'Authorization': app.globalData.bearer + app.globalData.token + app.globalData.logType,
      'content-type': 'application/json',
    }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }


}
export default my