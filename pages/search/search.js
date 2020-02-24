const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入

var app = getApp()
Page({
  data: {
    keyword: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0
  },
  //事件处理函数
  onCancel: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () {
    this.getSearchKeyword();
  },

  getSearchKeyword() {
    let that = this;
    // TODO授权
    console.log(app.globalData.userInfo);
    var param = {
      userId: app.globalData.userInfo.pkCustomerId
    }
    http('/system-web/keywords/getSearchKeyword', param, '', 'post').then(res => {
      if (res.code == '100000') {
        console.log(res)
        that.setData({
          historyKeyword: res.historyKeywords,
          defaultKeyword: res.isDefaultKeyWords,
          hotKeyword: res.isHotKeywords
        })
      } else {
        dialog.dialog('错误', '获取关键字失败，请联系管理员!', false, '确定');
      }
    })
  },

  onSearch: function(e) {
    console.log(e)
    var that = this;
    this.setData({
      keyword: e.detail,
      searchStatus: false,
      goodsList: []
    });
    this.getKeywords();
  },

  getKeywords: function () {
    let that = this;
    var param = {
      keyword: that.data.keyword
    }
    http('/system-web/keywords/getKeywords', param, '', 'post').then(res => {
      if (res.code == '100000') {
        console.log(res)
        that.setData({
          helpKeyword: res.keywordList
        });
      } else {
        dialog.dialog('错误', res.message, false, '确定');
      }
    })
  },

  clearHistory: function () {
    // TODO授权
    console.log(app.globalData.userInfo);
    var param = {
      userId: app.globalData.userInfo.pkCustomerId
    }
    http('/system-web/keywords/clearHistoryKeyword', param, '', 'post').then(res => {
      if (res.code == '100000') {
        this.setData({
          historyKeyword: []
        })
        dialog.showToast('清除历史搜索成功!', null, '', 2000)
      } else {
        dialog.dialog('错误', '清除历史搜索失败，请联系管理员!', false, '确定');
      }
    })
  },

  onKeywordTap: function (event) {
    this.getSearchResult(event.target.dataset.keyword);
  },

  getGoodsList: function () {
    let that = this;
    var param = {
      keyword: that.data.keyword, 
      page: that.data.page, 
      limit: that.data.size, 
      sort: that.data.currentSortType, 
      order: that.data.currentSortOrder, 
      categoryId: that.data.categoryId,
      userId: app.globalData.userInfo.pkCustomerId
    }
    http('/system-web/goods/searchGoods', param, '', 'post').then(res => {
      if (res.code == '100000') {
        this.setData({
          searchStatus: true,
          categoryFilter: false,
          goodsList: res.data.data,
          filterCategory: res.data.filterCategory,
          page: res.data.currentPage,
          size: res.data.numsPerPage
        })
        //重新获取关键词
        that.getSearchKeyword();
      } else {
        dialog.dialog('错误', '搜索失败，请联系管理员!', false, '确定');
      }
    });
  },
  
  getSearchResult(keyword) {
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },

  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
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
    this.getGoodsList();
  },

  onPullDownRefresh(){
      // 显示顶部刷新图标
      wx.showNavigationBarLoading();
      // 增加下拉刷新数据的功能
      var self = this;
     // this.getGoodsList();
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
  },

  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  }
})