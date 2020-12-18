const app = getApp()
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
Page({
  data: {
    param: {},
    categoryFilter: false,
    filterCategory: [],
    page: 1,
    size: 6,
    currentSortType: 'default',
    currentSortOrder: 'desc',
    categoryId: '',
    goodsList: []
  },
  onLoad: function(options) {
    this.setData({
      windowHeight: app.globalData.windowHeight
    })
    this.getGoodsList()
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
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    this.setData({
      page: 1,
      goodsList: []
    })
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'currentSortType': 'category',
          'categoryFilter': !this.data.categoryFilter,
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      case 'nameSort':
        let tmpNameSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpNameSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'goods_name',
          'currentSortOrder': tmpNameSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      case 'stockSort':
        let tmpStockSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpStockSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'stock',
          'currentSortOrder': tmpStockSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false
        });
        this.getGoodsList();
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      categoryId: currentCategory.id,
      page: 1,
      goodsList: []
    });
    // this.getGoodsList();
  },

  //按下事件开始  
  touchStart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
  },
  //按下事件结束  
  touchEnd: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
  }, 

  /**
   * 长按编辑商品
   * @param  event 
   */
  deleteItem (event){
    let that = this;
    let footprint = event.currentTarget.dataset.footprint;
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '要删除所选足迹？',
        success: function (res) {
          if (res.confirm) {
            var param = {
              customerId: app.globalData.userInfo.id,
              goodsId: footprint.goodsId,
              type: footprint.type
            }
            http('/api-web/footprint/deleteFootprint/', param, null, 'post').then(res => {
              if (res.success) {
                dialog.showToast('删除成功','success', '', 2000);
                that.getFootprintList();
              }
            })
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/goods/goods?id=' + footprint.goodsId,
      });
    }
  },
  setParam: function() {
    var that = this
    var param = {
      keyword: that.data.keyword, 
      page: that.data.page, 
      limit: that.data.size, 
      sort: that.data.currentSortType, 
      order: that.data.currentSortOrder,
      categoryId: that.data.categoryId
    }
    this.setData({
      param: param
    })
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