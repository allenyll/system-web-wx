// templates/index.js
Component({

  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    value: String,
    showAdd: Boolean,
    showCondition: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSearch: function(e) {
      this.triggerEvent("onSearch", {
        value: e.detail
      })
    },
    onClear: function(e) {
      this.triggerEvent("onClear", {
        value: e.detail
      })
    },
    onCancel: function(e) {
      this.triggerEvent("onCancel", {
        value: e.detail
      })
    },
    toggleDrawer: function() {
      this.triggerEvent("toggleDrawer")
    },
    clickAdd: function() {
      this.triggerEvent("clickAdd")
    }
  }
})
