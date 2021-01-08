const app = getApp()
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
Page({
  data: {
    show: false,
    param: {},
    categoryFilter: false,
    filterCategory: [],
    page: 1,
    size: 6,
    currentSortType: 'default',
    currentSortOrder: 'desc',
    categoryId: '',
    goodsList: [],
    totalSkuNum: 0,
    totalStock: 0,
    cost: 0,
    totalCost: 0,
    totalWarnStock: 0,
    brandOption: [
      {text: '全部', value: ''}
    ],
    brand: '',
    isUsedOption: [
      {text: '全部', value: ''},
      {text: '启用', value: 'SW1302'},
      {text: '停用', value: 'SW1301'}
    ],
    isUsed: 'SW1302',
    statusOption: [
      {text: '全部', value: ''},
      {text: '上架', value: 'SW1401'},
      {text: '下架', value: 'SW1402'},
      {text: '预售', value: 'SW1403'}
    ],
    status: '',
    yearOptions: [
      {text: '全部', value: ''},
      {text: '2020年', value: '2020'},
      {text: '2019年', value: '2019'},
      {text: '2018年', value: '2018'}
    ],
    year: '',
    unitOptions: [],
    unit: '',
    seasonOptions: [],
    season: '',
    editAndDelBtnWidth: 120
  },
  onLoad: function(options) {
    this.setData({
      windowHeight: app.globalData.windowHeight,
      tabBarHeight: app.globalData.tabBarHeight,
      scrollHeight: app.globalData.windowHeight + app.globalData.tabBarHeight - 280
    })
    this.initEleWidth()
  },
  onShow: function() {
    this.removeSepcsCache()
    this.getDictList('SW16', 'unitOptions')
    this.getDictList('SW17', 'seasonOptions')
    this.getBrandList()
    this.getStock()
    this.getCategory()
    this.setData({
      page: 1,
      goodsList: []
    });
    this.getGoodsList()
  },
  clickAdd: function() {
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?type=add&id='
    })
  },
  onSearch: function(event) {
    this.setData({
      page: 1,
      goodsList: [],
      currentSortType: 'default'
    })
    this.setData({
      keyword: event.detail
    })
    this.getGoodsList()
  },
  onCancel: function(event) {
    console.log(event)
  },
  onClear: function(event) {
    this.setData({
      page: 1,
      goodsList: [],
      currentSortType: 'default'
    })
    this.setData({
      keyword: ''
    })
    this.getGoodsList()
  },
  toggleDrawer() {
    this.setData({
        show: !this.data.show
    });
  },
  changeOptions: function(e) {
    this.setData({
      [e.currentTarget.dataset.type]: e.detail
    });
  },
  confirmCondition: function() {
    this.setData({
      show: false,
      page: 1,
      goodsList: [],
      currentSortType: 'default'
    })
    this.getGoodsList()
  },
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
  showTotalCost: function() {
    dialog.dialog('','库存成本：￥' + this.data.totalCost + '.00元', false, '确定')
  },
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'currentSortType': 'category',
          'categoryFilter': !this.data.categoryFilter,
          // 'categoryId': '',
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder === 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false,
          page: 1,
          goodsList: []
        });

        this.getGoodsList();
        break;
      case 'nameSort':
        let tmpNameSortOrder = 'asc';
        if (this.data.currentSortOrder === 'asc') {
          tmpNameSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'goods_name',
          'currentSortOrder': tmpNameSortOrder,
          'categoryFilter': false,
          page: 1,
          goodsList: []
        });

        this.getGoodsList();
        break;
      case 'stockSort':
        let tmpStockSortOrder = 'asc';
        if (this.data.currentSortOrder === 'asc') {
          tmpStockSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'stock',
          'currentSortOrder': tmpStockSortOrder,
          'categoryFilter': false,
          page: 1,
          goodsList: []
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false,
          page: 1,
          goodsList: []
        });
        this.getGoodsList();
    }
  },
  selectCategory: function (event) {
    console.log(event)
    let currentIndex = event.target.dataset.categoryIndex
    let filterCategory = this.data.filterCategory
    let currentCategory = null;
    for (let key in filterCategory) {
      if (Number(key) === currentIndex) {
        if (filterCategory[key].checked) {
          filterCategory[key].checked = false
          this.setData({
            categoryId: ''
          });
        } else {
          filterCategory[key].checked = true
          currentCategory = filterCategory[key]
          this.setData({
            categoryId: currentCategory.id
          });
        }
      } else {
        filterCategory[key].checked = false
      }
    }
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      page: 1,
      goodsList: []
    });
    this.getGoodsList()
  },

  /**
   * 获取元素自适应后的实际宽度
   */
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / w;  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  
  /**
   * 初始化滑动显示的删除按钮
   */
  initEleWidth: function () {
    var editAndDelBtnWidth = this.getEleWidth(this.data.editAndDelBtnWidth);
    this.setData({
      editAndDelBtnWidth: editAndDelBtnWidth
    });
  },

  //按下事件开始  
  touchStart: function (e) {
    console.log(e)
    let that = this;
    if (e.touches.length == 1) {
      that.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  /**
   * 滑动
   */
  touchMove: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var editAndDelBtnWidth = this.data.editAndDelBtnWidth;
      var left = "";
      if (disX == 0 || disX < 10) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 10) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= editAndDelBtnWidth) {
          left = "left:-" + editAndDelBtnWidth + "px";
        }
      }
      var list = this.data.goodsList;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setData({
          goodsList: list
        })
      }
    }
  },
  //按下事件结束  
  touchEnd: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var editAndDelBtnWidth = this.data.editAndDelBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > editAndDelBtnWidth / 2 ? "margin-left:-" + editAndDelBtnWidth + "px" : "margin-left:0px";
      var list = this.data.goodsList;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setData({
          goodsList: list
        })
      }
    }
  },

  editGoods: function(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?type=edit&id='+id
    })
  },

  /**
   * 删除商品
   * @param  event 
   */
  deleteGoods: function(event){
    let that = this
    let id = event.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '确定删除该商品',
      success: function (res) {
        if (res.confirm) {
          http('/api-web/goods/deleteGoods/'+id, '', null, 'post').then(res => {
            if (res.code === '100000') {
              dialog.showToast('删除成功','success', '', 2000);
              that.setData({
                page: 1,
                goodsList: []
              });
              that.getGoodsList();
            }
          })
        }
      }
    });
  },
  setParam: function() {
    var that = this
    var param = {
      keyword: that.data.keyword, 
      page: that.data.page, 
      limit: that.data.size, 
      sort: that.data.currentSortType, 
      order: that.data.currentSortOrder,
      categoryId: that.data.categoryId,
      brandId: that.data.brand,
      status: that.data.status,
      isUsed: that.data.isUsed,
      year: that.data.year,
      unit: that.data.unit,
      season: that.data.season
    }
    console.log(param)
    this.setData({
      param: param
    })
  },
   /**
   * 获取规格列表
   */
  removeSepcsCache: function() {
    var param = {}
    http('/api-web/specs/list/', param, '', 'post').then(res => {
      if (res.code === '100000') {
        var list = res.data.list
        for (var i=0; i < list.length; i++) {
          wx.removeStorageSync(list[i].value)
        }
      }
    })
  },
   /**
   * 获取商品品牌
   */
  getBrandList: function() {
    var param = {}
    var brandOption = this.data.brandOption
    http('/api-web/brand/list', param, '', 'post').then(res => {
      if (res.code === '100000') {
        var list = res.data.list
        for (var i=0; i < list.length; i++) {
          brandOption.push({
            text: list[i].label,
            value: list[i].value
          })
        }
        this.setData({
          brandOption: brandOption
        })
      }
    })
  },
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
   * 获取商品库存和库存总量
   */
  getStock: function() {
    var param = {}
    http('/api-web/goods/getStock', param, '', 'post').then(res => {
      if (res.success) {
        this.setData({
          totalSkuNum: res.object.totalSkuNum,
          totalStock: res.object.totalStock,
          cost: res.object.cost,
          totalCost: res.object.totalCost,
          totalWarnStock: res.object.totalWarnStock
        })
      }
    })
  },
  getCategory: function () {
    var that = this
    var param = {}
    // 加载商品分类
    http('/api-web/category/categoryTree', param, '', 'GET').then(res => {
      var categorys = []
      if (res.code === '100000') {
        console.log(res)
        var list = res.data.categoryTree[0].children;
        for (var i=0; i < list.length; i++) {
          var obj = list[i]
          for (var j=0; j < list[i].children.length; j++) {
            var _obj = list[i].children[j]
            var data = {
              checked: false,
              id: _obj.id,
              name: obj.name + '/' + _obj.name
            }
            categorys.push(data)
          }
        }
        that.setData({
          filterCategory: categorys
        });
      } else {
      }
    });
  },
  /**
   * 获取商品列表
   */
  getGoodsList: function () {
    let that = this;
    that.setParam()
    var goods = that.data.goodsList
    http('/api-web/goods/getGoodsListByCondition', that.data.param, '', 'post').then(res => {
      if (res.success) {
        var list = res.object.goodsList
        for (var i=0; i < list.length; i++) {
          goods.push(list[i])
        }
        this.setData({
          categoryFilter: false,
          goodsList: goods,
          page: res.object.currentPage
        })
        console.log(this.data.goodsList)
      } else {
        dialog.dialog('错误', '搜索失败，请联系管理员!', false, '确定');
      }
    });
  },
  getMore: function() {
    console.log('加载更多')
    var page = this.data.page
    setTimeout(() => {
      this.setData({
        page: page + 1
      })
      this.getGoodsList()
    })
  }
})