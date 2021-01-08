const app = getApp()
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入
Page({
  data: {
    showAttr: false,
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
    editAndDelBtnWidth: 120,
    goodsId: 0,
    goods: {},
    specsList:[],
    specValue: '',
    skuStockList: [], 
    cartInfo: {
      cartNum: 0,
      cartList: []
    },
    sku: {},
    colorMore: false,
    // 最后点击选中的颜色ID
    activeId: '',
    cartShow: false
  },
  onLoad: function(options) {
    this.setData({
      windowHeight: app.globalData.windowHeight,
      tabBarHeight: app.globalData.tabBarHeight,
      scrollHeight: app.globalData.windowHeight + app.globalData.tabBarHeight - 89 - 180
    })
  },
  onShow: function() {
    this.getDictList('SW16', 'unitOptions')
    this.getDictList('SW17', 'seasonOptions')
    this.getBrandList()
    // this.getStock()
    this.getCategory()
    this.setData({
      page: 1,
      goodsList: []
    })
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
    })
  },
  changeOptions: function(e) {
    this.setData({
      [e.currentTarget.dataset.type]: e.detail
    })
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
    })
  },
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'currentSortType': 'category',
          'categoryFilter': !this.data.categoryFilter,
          // 'categoryId': '',
          'currentSortOrder': 'asc'
        })
        break
      case 'priceSort':
        let tmpSortOrder = 'asc'
        if (this.data.currentSortOrder === 'asc') {
          tmpSortOrder = 'desc'
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false,
          page: 1,
          goodsList: []
        })

        this.getGoodsList()
        break
      case 'nameSort':
        let tmpNameSortOrder = 'asc'
        if (this.data.currentSortOrder === 'asc') {
          tmpNameSortOrder = 'desc'
        }
        this.setData({
          'currentSortType': 'goods_name',
          'currentSortOrder': tmpNameSortOrder,
          'categoryFilter': false,
          page: 1,
          goodsList: []
        })

        this.getGoodsList()
        break
      case 'stockSort':
        let tmpStockSortOrder = 'asc'
        if (this.data.currentSortOrder === 'asc') {
          tmpStockSortOrder = 'desc'
        }
        this.setData({
          'currentSortType': 'stock',
          'currentSortOrder': tmpStockSortOrder,
          'categoryFilter': false,
          page: 1,
          goodsList: []
        })

        this.getGoodsList()
        break
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false,
          page: 1,
          goodsList: []
        })
        this.getGoodsList()
    }
  },
  selectCategory: function (event) {
    console.log(event)
    let currentIndex = event.target.dataset.categoryIndex
    let filterCategory = this.data.filterCategory
    let currentCategory = null
    for (let key in filterCategory) {
      if (Number(key) === currentIndex) {
        if (filterCategory[key].checked) {
          filterCategory[key].checked = false
          this.setData({
            categoryId: ''
          })
        } else {
          filterCategory[key].checked = true
          currentCategory = filterCategory[key]
          this.setData({
            categoryId: currentCategory.id
          })
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
    })
    this.getGoodsList()
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
        var list = res.data.categoryTree[0].children
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
        })
      } else {
      }
    })
  },
  /**
   * 获取商品列表
   */
  getGoodsList: function () {
    let that = this
    that.setParam()
    var goods = that.data.goodsList
    http('/api-web/goods/getGoodsListByCondition', that.data.param, '', 'post').then(res => {
      if (res.success) {
        var list = res.object.goodsList
        for (var i=0; i < list.length; i++) {
          let goodsId= list[i].id
          
          let cartInfo = that.data.cartInfo
          let goodsMap = ''
          if (cartInfo.cartList) {
            let goodsMapList = cartInfo.cartList.filter(item => item.goodsId === goodsId)
            if (goodsMapList.length > 0) {
              goodsMap = goodsMapList[0]
            }
          }
          if (goodsMap) {
            list[i] = {
              ...list[i],
              buyNumber: goodsMap.buyNumber
            }
          }
          goods.push(list[i])
        }
        this.setData({
          categoryFilter: false,
          goodsList: goods,
          page: res.object.currentPage
        })
        console.log(this.data.goodsList)
      } else {
        dialog.dialog('错误', '搜索失败，请联系管理员!', false, '确定')
      }
    })
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
  },
  addToCart: function(e) {
    const goodsId = e.currentTarget.dataset.id
    this.setData({
      goodsId: goodsId
    })
    // 获取商品信息
    this.getGoodsInfo()
  },
  
  getGoodsInfo: function () {
    let that = this
    http('/api-web/goods/getGoodsInfo/'+that.data.goodsId, null, null, 'post').then(res => {
      if(res.code === '100000'){
        console.log(res)
        that.setData({
          goods: res.data.obj,
          specsList: res.data.obj.specsList,
          skuStockList: res.data.obj.skuStockList
        })
        let cartInfo = that.data.cartInfo
        let goodsMap = ''
        if (cartInfo.cartList) {
          let goodsMapList = cartInfo.cartList.filter(item => item.goodsId === that.data.goods.id)
          goodsMap = goodsMapList[0]
          console.log(goodsMap)
        }
        if (goodsMap) {
          let specs = goodsMap.specsList
          let sNum = 0
          let flag = false
          for (let key in specs) {
            if (specs[key].specName === '颜色') {
              let options = specs[key].specOptionList
              for(let index in options) {
                if (options[index].active) {
                  sNum++
                }
              }
            }
          }
          if (sNum > 1) {
            flag = true
          }
          that.setData({
            colorMore: flag,
            specsList: goodsMap.specsList,
            skuStockList: goodsMap.skuList
          })
        }
        that.getSelectSpec(that.data.specsList)
        that.showPopupTap()
      }
    })
  },

  /**
   * 获取已选规格信息
   */
  getSelectSpec: function (list) {
    let specValue=""
    let colorValue = ""
    let newList = []
    let skuList = this.data.skuStockList
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let listObj = list[i]
        let optionList = listObj.specOptionList
        let newOptionList = []
        let specName = listObj.specName
        if ('颜色' === specName) {
          for (let j = 0; j < optionList.length; j++) {
            let colorId = optionList[j].id
            if (this.data.activeId) {
              if (this.data.activeId === colorId) {
                colorValue = '[' + optionList[j].id + ',' + optionList[j].name + ']'
              }
            } else {
              if (optionList[j].active) {
                colorValue = '[' + optionList[j].id + ',' + optionList[j].name + ']'
              }
            }
            let option = {
              ...optionList[j],
              totalNum: optionList[j].totalNum ? optionList[j].totalNum : 0
            }
            newOptionList.push(option)
          }
          listObj = {
            ...listObj,
            specOptionList: newOptionList
          }
          newList.push(listObj)
          console.log(colorValue)
        } else {
          for (let j = 0; j < optionList.length; j++) {
            specValue = colorValue + ';[' + optionList[j].id + ',' + optionList[j].name + ']'
            let _skuList = skuList.filter(item => item.specValue === specValue)
            let sku = _skuList[0]
            console.log(sku)
            let option = {
              ...optionList[j],
              stockNum: sku.skuStock,
              buyNum: sku.buyNum ? sku.buyNum : 0
            }
            newOptionList.push(option)
          }
          listObj = {
            ...listObj,
            specOptionList: newOptionList
          }
          newList.push(listObj)
        }
      }
    }
    let selectedSku = 0
    let selectedNum = 0
    let selectedPrice = 0
    for (let key in skuList) {
      let sku = skuList[key]
      if (sku.buyNum && sku.buyNum > 0) {
        selectedSku += 1
        selectedNum += sku.buyNum
        selectedPrice += sku.buyNum * sku.skuPrice
      }
    }
    this.setData({
      specsList: newList,
      selectedSku: selectedSku,
      selectedNum: selectedNum,
      selectedPrice: selectedPrice.toFixed(2)
    })
  },
  changeColseMore: function(e) {
    this.setData({
      colorMore: e.detail
    })
    let _specList = this.data.specsList
    for (let i = 0; i < _specList.length; i++) {
      if (_specList[i].specName === '颜色') {
        let _specOptionList = _specList[i].specOptionList
        for (let j = 0; j < _specOptionList.length; j++) {
          if (j === 0) {
            _specOptionList[j].active = true
          } else {
            _specOptionList[j].active = false
          }
        }
      }
    }
    // 重新赋值
    this.setData({
      specsList: _specList
    })
  },
  clickSpecValue: function (event) {
    let that = this
    let _index = event.currentTarget.dataset.propertychildindex
    let _id = event.currentTarget.dataset.propertychildid
    let _name = event.currentTarget.dataset.propertychildname
    let _pName = event.currentTarget.dataset.propertyname
    let pid = event.currentTarget.dataset.propertyid
    let colorMore = that.data.colorMore
    // 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specList = this.data.specsList
    for (let i = 0; i < _specList.length; i++) {
      if (_specList[i].specName === _pName) {
        let _specOptionList = _specList[i].specOptionList
        for (let j = 0; j < _specOptionList.length; j++) {
          if ("颜色" === _pName && colorMore) {
            if (_specOptionList[j].id === _id){
              let filterList = _specOptionList.filter(item => item.active === true)
              if (_specOptionList[j].active && filterList.length > 1) {
                _specOptionList[j].active = false
              } else {
                this.setData({
                  activeId: _id
                })
                _specOptionList[j].active = true
              }
            }
          } else {
            if (_specOptionList[j].id === _id){
              _specOptionList[j].active = true
            } else {
              _specOptionList[j].active = false
            }
          }
        }
      }
    }
    // 重新赋值
    this.setData({
      specsList: _specList
    })
    // 设置已选规格
    this.getSelectSpec(_specList)
    // //重新计算spec改变后的信息

  },

  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function () {
    this.setData({
      showAttr: false,
      colorMore: false
    })
  },
  showPopupTap: function () {
    this.setData({
      showAttr: true
    })
  },
  // changeBuyNum: function(e) {
  //   let id = e.currentTarget.dataset.id
  //   let num = e.detail
  //   this.setBuyNumber(id, num)
  //   console.log(e)
  // },
  minusBuyNum: function(e) {
    let id = e.currentTarget.dataset.id
    let num = e.detail
    this.setBuyNumber(id, num, 'minus', false)
    console.log(e)
  },
  plusBuyNum: function(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let num = e.detail
    this.setBuyNumber(id, num, 'plus', false)
  },
  /**
   * 设置购买数量
   */
  setBuyNumber: function (id, num, type, isAll) {
    let skuList = this.data.skuStockList
    let list = this.data.specsList
    let colorOption = []
    let sizeLen = 0
    let specsOptionsList = []
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let specName = list[i].specName
        if ('颜色' === specName) {
          colorOption = list[i].specOptionList
        } else {
          sizeLen = list[i].specOptionList.length
        }
        specsOptionsList.push(list[i].specOptionList)
      }
      for (let index in colorOption) {
        if (colorOption[index].active) {
          let totalNum = colorOption[index].totalNum ? colorOption[index].totalNum : 0
          let _num = 1
          if (isAll) {
            _num = sizeLen
          }
          if ('plus' === type) {
            totalNum += _num
          } else {
            totalNum -= _num
            if (totalNum < 0) {
              totalNum = 0
            }
          }
          colorOption[index] = {
            ...colorOption[index],
            totalNum: totalNum
          }
        }
      }
      let specsOption = this.calcDescartes(specsOptionsList)
      console.log(specsOption)
      for (let index in specsOption) {
        let specArr = specsOption[index]
        let specValue = ''
        if (!(specArr instanceof Array)) {
          let _id = specArr.id
          let _name = specArr.name
          specValue = '[' + _id + ',' + _name + ']'
        } else {
          for (let key in specArr) {
            let specName = specArr[key].specName
            let active = specArr[key].active
            let _id = specArr[key].id
            let _name = specArr[key].name
            if ('颜色' === specName) {
              if (!active) {
                continue
              } else {
                if (!specValue) {
                  specValue = '[' + _id + ',' + _name + ']'
                } else {
                  specValue += ';' + '[' + _id + ',' + _name + ']'
                }
              }
            } else {
              if (!isAll) {
                if (id === _id) {
                  if (!specValue) {
                    specValue = '[' + _id + ',' + _name + ']'
                  } else {
                    specValue += ';' + '[' + _id + ',' + _name + ']'
                  }
                }
              } else {
                if (!specValue) {
                  specValue = '[' + _id + ',' + _name + ']'
                } else {
                  specValue += ';' + '[' + _id + ',' + _name + ']'
                }
              }
            }
          }
        }
        for (let key in skuList) {
          if (skuList[key].specValue === specValue) {
            let buyNum = skuList[key].buyNum ? skuList[key].buyNum : 0
            if ('plus' === type) {
              buyNum += 1
            } else {
              buyNum -= 1
              if (buyNum < 0) {
                buyNum = 0
              }
            }
            skuList[key] = {
              ...skuList[key],
              buyNum: buyNum
            }
          }
        }
      }
    }
    console.log(skuList)
    this.setData({
      specsList: list,
      skuStockList: skuList
    })
    console.log(list)
    this.getSelectSpec(list)
  },
  /**
   * 购买数量（全）加
   */
  plusBuyTotalNum: function() {
    this.setBuyNumber('', '', 'plus', true)
  },
  /**
   * 购买数量（全）减
   */
  minusBuyTotalNum: function() {
    this.setBuyNumber('', '', 'minus', true)
  },
  /**
   * 笛卡尔积获取SKU
   */
  calcDescartes: function(array) {
    if (array.length < 2) return array[0] || []
    return [].reduce.call(array, function (col, set) {
        var res = []
        col.forEach(function (c) {
            set.forEach(function (s) {
                var t = [].concat(Array.isArray(c) ? c : [c])
                t.push(s)
                res.push(t)
            })
        })
        return res
    })
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {}
    shopCarMap.goodsId = this.data.goods.id
    shopCarMap.pic = this.data.goods.fileUrl
    shopCarMap.label = this.data.goods.goodsBrief
    shopCarMap.name = this.data.goods.goodsName
    shopCarMap.code = this.data.goods.goodsCode
    shopCarMap.brandName = this.data.goods.brand.brandName
    shopCarMap.categoryId = this.data.goods.categoryId
    shopCarMap.giftGrowth = this.data.goods.giftGrowth
    shopCarMap.goodsIntegral = this.data.goods.goodsIntegral
    shopCarMap.specsList = this.data.specsList
    shopCarMap.price = this.data.goods.price
    shopCarMap.left = ""
    shopCarMap.active = true
    shopCarMap.buyNumber = this.data.selectedNum
    shopCarMap.selectedSku = this.data.selectedSku
    
    let skuList = this.data.skuStockList
    let selectSku = []
    for (let key in skuList) {
      let sku = skuList[key]
      let spec = ''
      if (sku.buyNum && sku.buyNum > 0) {
        let specValue = sku.specValue
        let specsArr = specValue.split(';')
        for (let key in specsArr) {
          let idValueArr = specsArr[key].substring(1, specsArr[key].length - 1).split(',')
          let val = idValueArr[1]
          if (!spec) {
            spec = val
          } else {
            spec += ', ' + val
          }
        }
        sku = {
          ...sku,
          spec: spec
        }
        selectSku.push(sku)
      }
    }
    shopCarMap.skuList = this.data.skuStockList
    shopCarMap.skuSelectList = selectSku

    var cartInfo = this.data.cartInfo
    if (!cartInfo.cartNum) {
      cartInfo.cartNum = 0
    }
    if (!cartInfo.cartList) {
      cartInfo.cartList = []
    }
    var hasSameGoodsIndex = -1
    for (var i = 0; i < cartInfo.cartList.length; i++) {
      var tmpShopCarMap = cartInfo.cartList[i]
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId) {
        hasSameGoodsIndex = i
      }
    }
    cartInfo.cartNum += this.data.selectedNum
    if (hasSameGoodsIndex > -1) {
      cartInfo.cartList.splice(hasSameGoodsIndex, 1, shopCarMap)
    } else {
      cartInfo.cartList.push(shopCarMap)
    }
    this.setGoodsList(shopCarMap)
    this.setData({
      cartInfo: cartInfo
    })
    this.closePopupTap()
    dialog.showToast('添加成功', 'success', '', 3000)
  },
  /**
   * 设置商品列表商品已选数量
   */
  setGoodsList: function(shopCarMap) {
    let goodsList = this.data.goodsList
    let newGoodsList = []
    for (var i=0; i < goodsList.length; i++) {
      let goodsId = goodsList[i].id
      if (shopCarMap.goodsId === goodsId) {
        goodsList[i] = {
          ...goodsList[i],
          buyNumber: shopCarMap.buyNumber
        }
      }
      newGoodsList.push(goodsList[i])
    }
    this.setData({
      goodsList: newGoodsList
    })
  },
  /**
   * 展示购物车信息
   */
  showCartInfo: function() {
    this.setData({
      cartShow: !this.data.cartShow
    })
  },
  /**
   * 关闭购物车信息
   */
  closeCartInfo: function() {
    this.setData({
      cartShow: false
    })
  },
  /**
   * 单个SKU-减
   */
  singleSkuMinus: function(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    let skuId = e.currentTarget.dataset.skuid
    this.setSkuNumber(goodsId, skuId, 'minus')
  },
  /**
   * 单个SKU-加
   */
  singleSkuPlus: function(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    let skuId = e.currentTarget.dataset.skuid
    let num = e.detail
    this.setSkuNumber(goodsId, skuId, 'plus')
  },
  setSkuNumber(goodsId, skuId, type) {
    let cartList = this.data.cartInfo.cartList
    let cartNum = this.data.cartInfo.cartNum ? this.data.cartInfo.cartNum : 0
    for (let key in cartList) {
      let goods = cartList[key]
      if (goodsId === goods.goodsId) {
        let selcetedSkuList = goods.skuSelectList
        let skuList = goods.skuList
        let specs = goods.specsList
        for (let index in selcetedSkuList) {
          let sku = selcetedSkuList[index]
          if (skuId === sku.id) {
            if ('plus' === type) {
              sku.buyNum += 1
              cartNum += 1
            } else {
              sku.buyNum -= 1
              cartNum -= 1
              if (sku.buyNum < 0) {
                sku.buyNum = 0
              }
              if (cartNum < 0) {
                cartNum = 0
              }
            }
            this.setColorNum(sku, specs, type, 1)
          }
        }
        for (let index in skuList) {
          let sku = skuList[index]
          if (skuId === sku.id) {
            if ('plus' === type) {
              sku.buyNum += 1
            } else {
              sku.buyNum -= 1
              if (sku.buyNum < 0) {
                sku.buyNum = 0
              }
            }
          }
        }
      }
      if ('plus' === type) {
        goods.buyNumber += 1
      } else {
        goods.buyNumber -= 1
        if (goods.buyNumber < 0) {
          goods.buyNumber = 0
        }
      }
      this.setGoodsList(goods)
    }
    console.log(cartList)
    this.setData({
      cartInfo: {
        cartNum: cartNum,
        cartList: cartList
      }
    })
  },
    /**
   * 删除购物车商品
   */
  deleteGoods: function(e) {
    let that = this
    wx.showModal({
      title: '',
      content: '确定移除该商品',
      success: function (res) {
        if (res.confirm) {
          let goodsId = e.currentTarget.dataset.goodsid
          let cartList = that.data.cartInfo.cartList
          let cartNum = that.data.cartInfo.cartNum ? that.data.cartInfo.cartNum : 0
          for (let key in cartList) {
            let goods = cartList[key]
            if (goodsId === goods.goodsId) {
              cartNum -= goods.buyNumber
              goods.buyNumber = 0
              that.setGoodsList(goods)
            }
          }
          cartList = cartList.filter(item => item.goodsId !== goodsId)
          that.setData({
            cartInfo: {
              cartNum: cartNum,
              cartList: cartList
            }
          })
        }
      }
    })
  },
  /**
   * 删除单个sku
   */
  deleteSku: function(e) {
    let that = this
    wx.showModal({
      title: '',
      content: '确定移除该SKU',
      success: function (res) {
        if (res.confirm) {
          let goodsId = e.currentTarget.dataset.goodsid
          let skuId = e.currentTarget.dataset.skuid
          let num = e.currentTarget.dataset.num
          let cartList = that.data.cartInfo.cartList
          let cartNum = that.data.cartInfo.cartNum ? that.data.cartInfo.cartNum : 0
          for (let key in cartList) {
            let goods = cartList[key]
            if (goodsId === goods.goodsId) {
              goods.buyNumber -= num
              if (goods.buyNumber < 0) {
                goods.buyNumber = 0
              }
              goods.selectedSku -= 1
              if (goods.selectedSku < 0) {
                goods.selectedSku = 0
              }
              let skuList = goods.skuList
              let specs = goods.specsList
              goods.skuSelectList = goods.skuSelectList.filter(item => item.id !== skuId)
              for (let index in skuList) {
                let sku = skuList[index]
                if (skuId === sku.id) {
                  sku.buyNum = 0
                  that.setColorNum(sku, specs, 'minus', num)
                }
              }
              that.setGoodsList(goods)
            }
          }
          cartNum -= num
          if (cartNum < 0) {
            cartNum = 0
          }
          that.setData({
            cartInfo: {
              cartNum: cartNum,
              cartList: cartList
            }
          })
        }
      }
    })
  },
  /**
   * 设置属性为颜色的单个数量
   */
  setColorNum: function(sku, specs, type, num) {
    let specValue = sku.specValue
    for (let key in specs) {
      if (specs[key].specName === '颜色') {
        let options = specs[key].specOptionList
        for(let index in options) {
          let specsArr = specValue.split(';')
          for (let key in specsArr) {
            let idValueArr = specsArr[key].substring(1, specsArr[key].length - 1).split(',')
            let id = idValueArr[0]
            if (options[index].id === id) {
              if ('plus' === type) {
                options[index].totalNum += num
              } else {
                options[index].totalNum -= num
                if (options[index].totalNum < 0) {
                  options[index].totalNum = 0
                }
              }
            }
          }
        }
      }
    }
  }
})