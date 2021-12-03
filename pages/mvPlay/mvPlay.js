// pages/mvPlay/mvPlay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mes: {},
    path: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("mvInfo", function (data) {
      _this.setData({
        mes: data.mes
      })
      console.log(data.mes.id)
      wx.request({
        url: app.globalData.path + '/get_mvpath',
        data:{
          mid: data.mes.id
        },
        success(res){
          _this.setData({
            path: res.data.data.url
          })
        }
      })

    })
    let videoContext = wx.createVideoContext('myVideo', this)
    videoContext.requestFullScreen()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})