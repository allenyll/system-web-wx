// templates/editDialog/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: Boolean,
    modalTitle: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    modelVal: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏模块对话框
    hideModal: function() {
      this.setData({
        showModal: false
      });
    },
    // 对话框取消按钮点击事件
    onCancel: function() {
      this.hideModal();
    },
    // 输入框内容改变事件
    inputChange: function(e) {
      this.setData({
        modelVal: e.detail.value
      })
    },
    //  对话框确认按钮点击事件
    onConfirm: function() {
      var that = this;
      that.triggerEvent('saveValue', {modelVal: this.data.modelVal})
    },

  }
  
})
