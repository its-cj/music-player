// pages/login/login.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkClickPro: true
  },
  checkClick: function () {
    if (this.data.checkClickPro == true) {
      this.setData({
        checkClickPro: false
      })
    } else {
      this.setData({
        checkClickPro: true
      })
    }
  },
  wxLoginClick: function () {
    if (this.data.checkClickPro == false) {
      wx.showToast({
        title: '请先勾选同意《用户服务协议》和《隐私协议》',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.getUserProfile({
        desc: '用于完善账号资料',
        success: (res) => {
          let data = JSON.stringify(res)
          wx.setStorageSync("userInfo", data)
          // 此处已经获取到 用户的头像和昵称  需要登录注册
          wx.login({
            success(res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: app.globalData.path + '/wx_login',
                  data: {
                    code: res.code
                  },
                  success(res) {
                    let openMes = res.data
                    wx.setStorageSync("userOpenId", JSON.stringify(openMes))
                    let data = wx.getStorageSync("userInfo")
                    if (data) {
                      console.log("有数据")
                      let img = JSON.parse(data).userInfo.avatarUrl
                      let nickname = JSON.parse(data).userInfo.nickName
                      let name = openMes.openid
                      // 注册 账号
                      wx.request({
                        url: app.globalData.path + '/add_user',
                        data: {
                          name,
                          img,
                          nickname
                        },
                        success(res) {
                          console.log(res)
                        }
                      })
                    }
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
          wx.navigateBack({
            delta: 1
          })
        },
        fail: () => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo")
    if (userInfo) {
      wx.navigateBack({
        delta: 1
      })
    }
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
    // 获取 用户的 id
    // if (wx.getStorageSync('userOpenId')) {
    //   _this.setData({
    //     openMes: JSON.parse(wx.getStorageSync('userOpenId'))
    //   })
    // } else {
    //   // 用户登录
    //   wx.login({
    //     success(res) {
    //       if (res.code) {
    //         //发起网络请求
    //         wx.request({
    //           url: app.globalData.path + '/wx_login',
    //           data: {
    //             code: res.code
    //           },
    //           success(res) {
    //             _this.setData({
    //               openMes: res.data
    //             })
    //             let openMes = res.data
    //             wx.setStorageSync("userOpenId", JSON.stringify(openMes))
    //           }
    //         })
    //       } else {
    //         console.log('登录失败！' + res.errMsg)
    //       }
    //     }
    //   })
    // }

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