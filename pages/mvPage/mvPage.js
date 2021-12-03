// pages/mvPage/mvPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    itemName: [{nick:"首播",rid:236682871,pn: 1}, {nick:"华语",rid:236682731,pn: 1}, {nick:"日韩",rid:236742444,pn: 1}, {nick:"网络",rid:236682773,pn: 1}, {nick:"欧美",rid:236682735,pn: 1}, {nick:"现场",rid:236742576,pn: 1}, {nick:"热舞",rid:236682777,pn: 1}, {nick:"伤感",rid:236742508,pn: 1}, {nick:"剧情",rid:236742578,pn: 1}],
    rid: 236682871,
    itemMv: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.request({
      url: app.globalData.path + '/mv_recommend',
      data: {
       pid: _this.data.rid
      },
      success(res){
        _this.setData({
          itemMv: res.data.data.mvlist
        })
      }
    })
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
    let _this = this
    let itemName = _this.data.itemName
    let num = _this.data.num
    let pn = itemName[num].pn + 1
    itemName[num].pn = pn
    wx.request({
      url: app.globalData.path + '/mv_recommend',
      data: {
       pid: _this.data.rid,
       pn : pn
      },
      success(res){
        let arr = _this.data.itemMv
        let rep = res.data.data.mvlist
        for(let i = 0; i < rep.length; i ++){
          arr.push(rep[i])
        }
        _this.setData({
          itemMv: arr,
          itemName: itemName
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  playClickMv(e) {
    wx.navigateTo({
      url: '../mvPlay/mvPlay',
      success: function (res) {
        res.eventChannel.emit("mvInfo", {
          mes: e.detail.data
        })
      }
    })
  },
  boxChooseClick(e) {
    let _this = this
    let itemName = _this.data.itemName
    itemName[e.detail.data].pn = 1
    this.setData({
      num: e.detail.data,
      rid: e.detail.rid,
      itemName: itemName
    })
    wx.request({
      url: app.globalData.path + '/mv_recommend',
      data: {
       pid: _this.data.rid
      },
      success(res){
        _this.setData({
          itemMv: res.data.data.mvlist
        })
      }
    })
  },
})