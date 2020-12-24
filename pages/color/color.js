const app = getApp()
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
Page({
  data: {
    param: {},
    color: '',
    specOptions: [],
    selectItems: [],
    showModal: false,
    specsOptionName: ''
  },
  onLoad: function(options) {
    var that = this;
    let param = JSON.parse(options.param)
    that.setData({
      param: param,
      selectItems: wx.getStorageSync(param.from) || []
      // specOptions: param.specOptions
    })
    console.log(this.data.selectItems)
    this.getSpecsOption()
  },
  getSpecsOption: function() {
    var param = {
      specsId: this.data.param.specId,
      specsOptionName: this.data.specsOptionName
    }
    http('/api-web/specOption/getSpecsOptionBySpecsId', param, '', 'post').then(res => {
      var selectItems = this.data.selectItems
      if (res.success) {
        if (res.object) {
          var list = res.object
          for (let index in selectItems) {
            for (let key in list) {
              if(selectItems[index].id === list[key].id) {
                list[key].checked = true
              }
            }
          }
          this.setData({
            specOptions: list
          })
        }
      } else {
        dialog.dialog('错误', res.message, false, '确定');
      }
    }).catch(res => {
      dialog.dialog('错误', res.error, false, '确定');
    })
  },
  /**
   * 添加颜色弹窗
   */
  addColor: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 添加颜色
   * @param {} e 
   */
  saveColor: function(e) {
    var specId = this.data.param.specId
    var modelVal = e.detail.modelVal
    wx.showLoading({
      title: '保存中...',
    })
    var param = {
      specsId: specId,
      name: modelVal
    }
    http('/api-web/specOption/add', param, '', 'post').then(res => {
      if (res.code === '100000') {
        wx.hideLoading({})
        dialog.showToast('保存成功', '', '', 2000)
        this.getSpecsOption()
      } else {
        dialog.dialog('错误', res.message, false, '确定');
        wx.hideLoading({})
      }
    }).catch(res => {
      dialog.dialog('错误', res.error, false, '确定');
      wx.hideLoading({})
    })
    this.setData({
      showModal: false
    })
  },
  onSearch: function(event) {
    this.setData({
      specsOptionName: event.detail
    })
    this.getSpecsOption()
  },
  onCancel: function(event) {
    this.onClear()
  },
  onClear: function(event) {
    this.setData({
      specsOptionName: ''
    })
    this.getSpecsOption()
  },
  selectItem: function (event) {
    let currentIndex = event.target.dataset.index
    let specOptions = this.data.specOptions
    let selectItems = this.data.selectItems
    // let _selectItems = []
    for (let key in specOptions) {
      key = Number(key)
      if (key === currentIndex) {
        if (specOptions[key].checked) {
          specOptions[key].checked = false
          selectItems = selectItems.filter(item => item.id !== specOptions[key].id)
          // for (let index in selectItems) {
          //   if (specOptions[key].id != selectItems[index].id) {
          //     _selectItems.push(selectItems[index])
          //   }
          // }
          // selectItems = _selectItems
        } else {
          specOptions[key].checked = true
          selectItems.push(specOptions[key])
        }
        break
      }
    }
    this.setData({
      specOptions: specOptions,
      selectItems: selectItems
    })
    console.log(this.data.selectItems)
  },
  confirmOptions: function() {
    wx.setStorageSync(this.data.param.from, this.data.selectItems)
    wx.navigateBack({})
  }
})