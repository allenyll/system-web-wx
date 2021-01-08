// components/hui-picker-input.js
const listvalue = []
let _self;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {//下拉框数据来源
      type: [Array, Object],
      value: listvalue,
      description: '数据源',
      observer(newVal, oldVal) {
        this.setData({
          list: newVal,
          list2: newVal
        })
      }
    },
    _width: {//组件宽度
      type: String,
      value: "100rpx"
    },
    _height: {//组件高度
      type: String,
      value: "100rpx"
    },
    actualvalue: { //实际值
      type: String,
      value: "value"
    },
    showvalue: { //显示值
      type: String,
      value: "label"
    },
    defaultvalue: String // 默认值
  },

  /**
   * 组件的初始数据
   */
  data: {
    picker_value: '',//输入框值
    index: 0,//下拉框下标
    list2: []//下拉框数据
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function () { 
      // 有默认值，绑定默认值
      if (this.data.defaultvalue) {
        var list = this.data.list
        for (let index in list) {
          if (list[index].value === this.data.defaultvalue) {
            console.log("可搜索下拉框初始化默认值")
            this.bindchange({detail: {value: index}})
          }
        }
      }
    },
    moved: function () { },
    detached: function () { },
  },
  created(e) {
    _self = this;
  },
  ready: function() {
    // 在组件实例进入页面节点树时执行
    // 有默认值，绑定默认值
    if (this.data.defaultvalue) {
      var list = this.data.list2
      for (let index in list) {
        if (list[index].label === this.data.defaultvalue) {
          console.log("可搜索下拉框初始化默认值")
          this.bindchange({detail: {value: index}})
        }
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //文本框输入事件
    bindkeyinput(e) {
      const _value = e.detail.value
      const _showvalue2 = this.data.showvalue;
      const _list = JSON.parse(JSON.stringify(this.data.list));
      const array = _list.filter(item => item[_showvalue2].indexOf(_value) != -1).map(item => {
        const result = JSON.parse(JSON.stringify(item));
        return result;
      })
      this.setData({
        list2: array
      })
    },
    //下拉框选择事件
    bindchange(e) {
      const _idx = e.detail.value;
      const _showvalue = this.data.showvalue;
      const _actualvalue = this.data.actualvalue;
      const list2_value = this.data.list2[_idx][_actualvalue];
      this.setData({
        index: _idx,
        list2: this.data.list,
        picker_value: this.data.list2[_idx][_showvalue]
      })
      this.fun(list2_value);
    },
    fun(list2_value) {
      this.triggerEvent("action", {
        id: list2_value
      });
    }
  }
})