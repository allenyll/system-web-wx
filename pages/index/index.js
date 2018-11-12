//index.js
//获取应用实例
const app = getApp()
// 导入js
var util = require('../../utils/util.js')

Page({
  data: {
    slider: [
      {
        "linkUrl": "https://y.qq.com/m/act/sfhd/188.html?openinqqmusic=1&ADTAG=Banner",
        "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/674942.jpg",
        "id": 18367
      },
      {
        "linkUrl": "https://y.qq.com/m/act/maskessinger3/index.html?ADTAG=jiaodiantu",
        "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/662321.jpg",
        "id": 18291
      },
      {
        "linkUrl": "http://y.qq.com/w/album.html?albummid=001OjJqB2xKM8v",
        "picUrl": "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/686738.jpg",
        "id": 18364
      },
      {
        "linkUrl": "https://y.qq.com/msa/liveh5/3_6307.html",
        "picUrl": "http://y.gtimg.cn/music/common/upload/t_radio_banner/583997.jpg",
        "id": 18355
      }
    ],
    swiperCurrent: 0
  },

  scanClick:function(){
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res);
        wx.showToast({
          title: res.result,
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  onLoad: function () {
    var that = this;
    //网络访问，获取轮播图的图片
    //util.getRecommend(function (data) {
      //that.setData({
       //slider: data.data.slider
      //})
    //});
  },

  //轮播图的切换事件
  swiperChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  }
  
})
