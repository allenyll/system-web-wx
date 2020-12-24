const app = getApp()
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
Page({
  data: {
    show: false,
    param: {},
    specsList: [],
    showCategory: false,
    mainActiveIndex: 0,
    activeId: null,
    categoryTree: [],
    categoryName: '',
    fileList: [],
    fileId: '',
    // 富文本相关
    html: '',
    option: { 
      placeholder: '编写商品详情...', //占位符默认为 '请输入文字...'
      imgUp: false, //插入图片功能默认开启
      width: '100%', //默认宽100%
      height: '600rpx', //默认高200px
    }
    // 富文本结束
  },
  onLoad: function(options) {
    this.setData({
      windowHeight: app.globalData.windowHeight,
      tabBarHeight: app.globalData.tabBarHeight,
      scrollHeight: app.globalData.windowHeight + app.globalData.tabBarHeight - 280
    })
    this.getSnowFlakeId()
    this.getDictList('SW16', 'unitOptions')
    this.getDictList('SW17', 'seasonOptions')
    // this.getSpecsList()
    this.getCategory()
  },
  onShow: function() {
    var list = this.data.specsList
    for (var i=0; i < list.length; i++) {
      var items = wx.getStorageSync(list[i].specId)
      console.log(items)
      if (items) {
        list[i].selectItems = items
        list[i].showItem = true
      }
    }
    this.setData({
      specsList: list
    })
  },
  getSnowFlakeId: function() {
    var param = {}
    http('/api-web/goods/getSnowFlakeId/', param, '', 'post').then(res => {
      if (res.code === '100000') {
        this.setData({
          goodsId: res.data.id
        })
        console.log(this.data.goodsId)
      }
    }).catch(res => {
      dialog.dialog('错误', res.error + ',请联系客服', false, '确定')
    })
  },
  /**
   * 获取对应编码的字段项
   * @param {字典编码} code 
   * @param {赋值对象} data 
   */
  getDictList: function(code, data) {
    var param = {}
    var options = [
      {text: '全部', value: ''}
    ]
    http('/api-sys/dict/list/' + code, param, '', 'post').then(res => {
      if (res.code === '100000') {
        var list = res.data.list
        for (var i=0; i < list.length; i++) {
          options.push({
            text: list[i].label,
            value: list[i].value
          })
        }
        this.setData({
          [data]: options
        })
      }
    })
  },
  /**
   * 获取规格列表
   */
  getSpecsList: function() {
    var param = {}
    http('/api-web/specs/list/', param, '', 'post').then(res => {
      if (res.code === '100000') {
        var list = res.data.list
        this.setData({
          specsList: list
        })
      }
    })
  },
  /**
   * 获取分类
   */
  getCategory: function () {
    var that = this
    var param = {}
    // 加载商品分类
    http('/api-web/category/categoryTree', param, '', 'GET').then(res => {
      var categorys = []
      if (res.code === '100000') {
        categorys = this.getTreeOptions(res.data.categoryTree)
        console.log(categorys)
        that.setData({
          categoryTree: categorys
        });
      } else {
      }
    });
  },
  // 递归遍历分类树，封装成前端展示树形结构
  getTreeOptions(data) {
    // 去掉顶级节点
    if (data[0].id === '0') {
      data = data[0].children
    }
    for (let i = 0; i < data.length; i++) {
      data[i].text = data[i].name
      if (data[i].children.length > 1) {
        // 不为空，继续遍历
        this.getTreeOptions(data[i].children)
      }
    }
    return data
  },
  /**
   * 选择分类
   */
  selectCategory: function() {
    this.setData({
      showCategory: !this.data.showCategory
    });
  },
  /**
   * 分类导航选中事件
   * @param {*} param0 
   */
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },
  /**
   * 分类选中
   * @param {*}
   */
  onClickItem({ detail = {} }) {
    let activeId = detail.id;
    let categoryName = detail.name;
    if (this.data.activeId === detail.id ) {
      activeId = null
      categoryName = ''
    } else {
      this.getSpecsListCondition(activeId)
    }
    this.setData({ 
      activeId: activeId,
      categoryName: categoryName,
      showCategory: false
    });
  },
  /**
   * 根据分类获取分类下的规格
   * @param {*} id 
   */
  getSpecsListCondition: function(id) {
    var param = {
    }
    // 加载商品分类
    http('/api-web/specs/getSpecsListCondition?categoryId='+id, param, '', 'post').then(res => {
      if (res.code === '100000') {
        console.log(res)
        var list = res.data.list
        this.setData({
          specsList: list
        })
      } else {
      }
    });
  },
  /**
   * 规格选择事件
   * @param {*} e 
   */
  selectSpecsOption: function(e) {
    var id = e.currentTarget.dataset.id
    var url = '/pages/addGoods/addGoods'
    var query = {
      url: url,
      from: id,
      specId: id
    }
    wx.navigateTo({
      url: '/pages/color/color?param=' + JSON.stringify(query),
    })
    // var list = this.data.specsList
    // for (var i=0; i < list.length; i++) {
    //   if ('颜色' === list[i].specName && id === list[i].specId) {
        
    //   }
    // }
  },
  /**
   * 删除规格
   * @param {*} e 
   */
  removeSpecs: function(e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    var list = this.data.specsList
    wx.showModal({
      title: '删除属性',
      content: '确定移除【'+name+'】规格？',
      success: function (res) {
        if (res.confirm) {
          var newList =[]
          for (var i=0; i < list.length; i++) {
            if (id !== list[i].specId) {
              newList.push(list[i])
            }
          }
          this.setData({
            specsList: newList
          })
        }
      }
    })
  },
  removeItem: function(e) {
    var that = this
    let specsId = e.currentTarget.dataset.specsid
    let name = e.currentTarget.dataset.name
    let id = e.currentTarget.dataset.id
    let newItems = []
    wx.showModal({
      title: '删除属性',
      content: '确定移除【'+name+'】？',
      success: function (res) {
        if (res.confirm) {
          var selectItems = wx.getStorageSync(specsId)
          for (var i = 0; i < selectItems.length; i++) {
            if (id !== selectItems[i].id) {
              newItems.push(selectItems[i])
            }
          }
          var list = that.data.specsList
          for (var i = 0; i < list.length; i++) {
            if (specsId === list[i].specId) {
              list[i].selectItems = newItems
              if (!newItems) {
                list[i].showItem = false
              }
            }
          }
          wx.setStorageSync(specsId, newItems)
          that.setData({
            specsList: list
          })
        }
      }
    })
  },
  uploadFile: function(event) {
    var that = this
    const { file } = event.detail
    console.log(file)
    let fileList = this.data.fileList
    let fileId = this.data.fileId
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseHttpUrl + '/api-web/file/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: {
        type: 'SW1801',
        id: this.data.goodsId
      },
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': wx.getStorageSync('token'),
        'login-type': 'wx'
      },
      success(res) {
        // 上传完成需要更新 fileList
        // const { fileList = [] } = that.data;
        // fileList.push({ ...file, url: res.data });
        // that.setData({ fileList });
        var data  = JSON.parse(res.data)
        if (data.code === '100000') {
          fileList.push({ ...file, id: data.data.fileId, url: data.data.url, deletable: true})
          if (fileId === '') {
            fileId = data.data.fileId
          } else {
            fileId += ',' + data.data.fileId
          }
          that.setData({
            fileList: fileList,
            fileId: fileId
          })
          wx.hideToast()
        } else {
          wx.hideToast()
          dialog.showToast('上传文件失败...', 'error', '', 2000)
        }
      },
    });
  },
  deleteFile: function(e) {
    var that = this
    wx.showModal({
      title: '删除图片',
      content: '确定删除已上传的图片?',
      success: function (res) {
        if (res.confirm) {
          var fileId = e.detail.file.id
          let id = e.detail.index
          let arr = that.data.fileList
          // 删除数据库中的图片
          http('/api-web/file/removeFileById?fileId='+fileId, '', '', 'GET').then(res => {
            arr.splice(id, 1);
            that.setData({
              fileList: arr
            }, () => {
              console.log(that.data.fileList)
            })
          }).catch(res => {
            dialog.dialog('错误', res.error + '，请联系客服', false, '确定')
          });
        }
      }
    })
    
  },
  getHtml(e) {//从组件获取值
    this.html = e.detail.content.html
  },
  submit() {
    console.log('提交的富文本', this.html)
  },
  insertImage(){ //图片上传插入示例
    wx.chooseImage({
      count: 1,
      success: res => {
        console.log(res);
        wx.uploadFile({ //调用图片上传接口
          url: app.globalData.baseHttpUrl + '/api-web/file/upload', // 仅为示例，非真实的接口地址
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            type: 'SW1803',
            id: 0
          },
          header: {
            "Content-Type": "multipart/form-data",
            'Authorization': wx.getStorageSync('token'),
            'login-type': 'wx'
          },
          success(res) {
            // 上传完成需要更新 fileList
            // const { fileList = [] } = that.data;
            // fileList.push({ ...file, url: res.data });
            // that.setData({ fileList });
            var data  = JSON.parse(res.data)
            if (data.code === '100000') {
              this.selectComponent('#editor').insertSrc(data.data.url);//调用组件insertSrc方法
            }
          }
        })
      }
    })
  },
  /**
   * 提交商品
   */
  submitGoods: function() {

    // 最后删除缓存，重置规格选项
    var list = this.data.specsList
    for (var i=0; i < list.length; i++) {
      wx.removeStorageSync(list[i].specId)
      list[i].selectItems = []
      list[i].showItem = false
    }
    this.setData({
      specsList: list
    })
  },
  /**
   * 打开筛选界面
   */
  toggleDrawer() {
    this.setData({
        show: !this.data.show
    });
  },
  /**
   * 筛选界面确认事件
   */
  confirmCondition: function() {
  },
  /**
   * 筛选界面重置事件
   */
  resetCondition: function() {
    this.setData({
      brand: '',
      isUsed: 'SW1302',
      status: '',
      year: '',
      unit: '',
      season: ''
    });
  },
  
})