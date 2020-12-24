var time = require('../../utils/util.js');
Component({
  properties:{
    option: { type: Object }
  },
  data: {
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '开始输入...',
    _focus: false,
    index: 0
  },

  onLoad() {

  },
  methods: {
    formSubmit(e) {
      this.editorCtx.getContents({
        success(res) {
          console.log('内容:', res.html)
          console.log('标题:', e.detail.value.title)
        }
      })
    },
    bindPickerChange(e) {
      console.log(e.detail.value)
      this.setData({
        index: e.detail.value
      })
  
    },
    readOnlyChange() {
      this.setData({
        readOnly: !this.data.readOnly
      })
    },
    onEditorReady() {
      const that = this
      //组件使用createSelectorQuery加上in(this)
      wx.createSelectorQuery().in(that).select('#editor').context(function (res) {
        that.editorCtx = res.context
      }).exec()
    },
  
    undo() {
      this.editorCtx.undo()
    },
    redo() {
      this.editorCtx.redo()
    },
    format(e) {
      let {
        name,
        value
      } = e.target.dataset
      if (!name) return
      // console.log('format', name, value)
      this.editorCtx.format(name, value)
  
    },
    onStatusChange(e) {
      const formats = e.detail
      this.setData({
        formats
      })
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
    },
    removeFormat(e) {
      console.log(e)
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    insertImage() {
      this.triggerEvent('insertImage');//触发父组件方法
    },
    insertSrc(src){//接受图片返回地址
      const that = this;
      that.editorCtx.insertImage({
        src,
        data: {
          id: 'abcd',
          role: 'god'
        },
        width: '80%',
        success: function () {
          console.log('insert image success')
        }
      })
    },
    getContent(e){//获得文本内容
      this.triggerEvent('Content', {content: e.detail}
      )
    }
  }
})