// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    movie: {},
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (params) {
    wx.showLoading({ title: '拼命加载中...' })
    app.getLocalCache("item"+params.id).then(cache =>{
      if(cache){
          console.log(cache)
          this.setData({title: cache.title,movie: cache.movie})
      }else{
        app.douban.findOne(params.id)
          .then(d => {
            this.setData({ title: d.title, movie: d })
            wx.setNavigationBarTitle({ title: d.title })
            return app.wechat.setStorage("item" + params.id, {
              title: d.title,
              movie: d,
              expires: Date.now() + 1 * 24 * 60 * 60 * 1000
            })
          })
          .catch(e => {
            this.setData({ title: '获取数据异常', movie: {} })
            console.error(e)
          })
      }
    })
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    wx.setNavigationBarTitle({ title: this.data.title})
  },

  onShareAppMessage () {
    return {
      title: this.data.title,
      desc: this.data.title,
      path: '/pages/item?id=' + this.data.id
    }
  },
  show_item(url){
    console.log(url);
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  }
})
