// pages/me/me.js
const app = getApp()
Page({
  spaceBtnClick() {
    this.setData({
      spaceView: false
    })
  },
  cancelClick() {
    this.setData({
      spaceView: false
    })
  },
  okClick() {
    let _this = this
    let pageMes = this.data.pageMes
    wx.request({
      url: app.globalData.path + '/add_selfcollection',
      data: {
        name: _this.data.openMes.openid,
        title: _this.data.inputValue
      },
      success(res) {
        if (res.data == "添加成功") {
          pageMes[1].list.push({
            img: '',
            name: _this.data.inputValue,
            total: "0",
            userName: "",
            id: ""
          })
          _this.setData({
            pageMes
          })
          _this.setData({
            spaceView: false
          })
        } else {
          wx.showToast({
            title: '已有此类歌单',
            icon: "error",
            duration: 1500
          })
        }
      }
    })
  },
  smallSpace() {},
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  addSongList() {
    this.setData({
      spaceView: true
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    is_play: app.globalData.is_play,
    isPlayMes: {},
    is_show: false,
    num: {
      listenNum: 0,
      collectionNum: 0
    },
    inputValue: '',
    spaceView: false,
    openMes: {},
    userInfo: {},
    aboutMusic: {},
    hasUserInfo: false,
    pageMes: [{
        title: "音乐品味",
        add: false,
        list: [{
            img: app.globalData.path + "/排行.png",
            name: "最近播放",
            total: "0",
            userName: "",
            id: ""
          },
          {
            img: app.globalData.path + "/爱心.png",
            name: "我喜欢的音乐",
            total: "0",
            userName: "",
            id: ""
          }
        ]
      },
      {
        title: "创建的歌单",
        add: true,
        list: []
      },
      {
        title: "收藏的歌单",
        add: false,
        list: []
      },
    ],
    noLogin: {
      avatarUrl: 'https://img1.kuwo.cn/star/userpl2015/55/33/1637423927200_421490355_500.jpg',
      nickName: '点我登录',
      noLogin: true
    },
    collectionSongSheet: [],
    selfmakeSongSheet: [],
    userEnjoyList: [],
    userMusicList: []
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log("9999")
        console.log(res)
        // 创建一个 数据表
      }
    })
  },
  loginClick() {
    // 去登录
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let data = wx.getStorageSync('userInfo')

    if (wx.getStorageSync('userOpenId')) {
      _this.setData({
        openMes: JSON.parse(wx.getStorageSync('userOpenId'))
      })
    } else {
      // 用户登录
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
                _this.setData({
                  openMes: res.data
                })
                let openMes = res.data
                wx.setStorageSync("userOpenId", JSON.stringify(openMes))
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

    if (data) {
      // 加载的时候进去 看看有没有登录  登录后就这样直接赋值就ok了
      // 登录了  进去已经登录的界面
      _this.setData({
        hasUserInfo: true,
        userInfo: JSON.parse(data).userInfo
      })
      // 获取 用户的 id 设置 openMes
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
      _this.allRequestMes()
    } else {
      // 没登录  让用户去登录
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  allRequestMes: function () {
    let _this = this
    wx.request({
      url: app.globalData.path + '/about_music',
      data: {
        name: _this.data.openMes.openid
      },
      success(res) {
        console.log(res.data)
        let data = res.data
        let pageMes = _this.data.pageMes
        let num = _this.data.num
        num.collectionNum = data.collectionSongSheet.length
        num.listenNum = data.userMusicList.length
        // console.log(pageMes)
        pageMes[0].list[0].total = data.userMusicList.length
        pageMes[0].list[1].total = data.userEnjoyList.length
        let arr = []
        let arr1 = []
        for (let i = 0; i < data.collectionSongSheet.length; i++) {
          arr.push(JSON.parse(data.collectionSongSheet[i].songSheetMes))
        }
        for (let i = 0; i < data.selfmakeSongSheet.length; i++) {
          let name = data.selfmakeSongSheet[i]
          arr1.push({
            name: name.title,
            img: false,
            total: name.num,
            id: name.userId
          })
        }
        pageMes[2].list = arr
        pageMes[1].list = arr1

        _this.setData({
          collectionSongSheet: data.collectionSongSheet,
          selfmakeSongSheet: data.selfmakeSongSheet,
          userEnjoyList: data.userEnjoyList,
          userMusicList: data.userMusicList,
          pageMes: pageMes,
          num
        })
      }
    })
  },
  isLastClick(e) {
    let sb = {
      mes: e.detail.musicData
    }
    console.log(e.detail)

    if (e.detail.mes.title == "收藏的歌单") {
      wx.navigateTo({
        url: '../recomMusicPage/recomMusicPage',
        success: function (res) {
          res.eventChannel.emit("sendMesToPage", {
            mes: sb
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../musicList/musicList',
        success: function (res) {
          res.eventChannel.emit("mySelfToPage", {
            mes: sb
          })
        }
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
    if (app.globalData.is_show == true) {
      this.setData({
        is_show: true,
        is_play: app.globalData.is_play,
        isPlayMes: app.globalData.isPlayMes
      })
    }
    let data = wx.getStorageSync('userInfo')
    if (data) {
      // 加载的时候进去 看看有没有登录  登录后就这样直接赋值就ok了
      this.setData({
        hasUserInfo: true,
        userInfo: JSON.parse(data).userInfo
      })
      this.allRequestMes()
    } else {
      console.log("没授权，进来也不管用！！！")
    }
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

  },
  playMusicClick: function (e) {
    this.setData({
      is_play: false
    })
    app.globalData.is_play = false
    app.globalData.innerAudioContext.pause()
  },
  pauseMusicClick(e) {
    this.setData({
      is_play: true
    })
    app.globalData.is_play = true
    app.globalData.innerAudioContext.play()
  },
  routerGoClick(e) {

    wx.navigateTo({
      url: '../lyricMusicPage/lyricMusicPage',
      success: function (res) {
        res.eventChannel.emit("sendMesToPage", {
          mes: e.detail.mesPlay,
          isMyclick: true
        })
      }
    })
  },
  preMusicClick(e) {
    let arr = app.globalData.arrMusicList
    let rid2 = e.detail.data.rid || e.detail.data.id
    let music = {}
    for (let i = 0; i < arr.length; i++) {
      let rid = arr[i].rid || arr[i].id
      if (rid == rid2) {
        if (i == 0) {
          music = arr[arr.length - 1]
          if (arr[i].is_click) {
            arr[i].is_click = false
            music.is_click = true
          }
        } else {
          music = arr[i - 1]
          if (arr[i].is_click) {
            arr[i].is_click = false
            music.is_click = true
          }
        }
        break
      }
    }
    this.setData({
      isPlayMes: music
    })
    app.globalData.isPlayMes = music
    let newRid = this.data.isPlayMes.id || this.data.isPlayMes.rid
    this.playMusicPath(newRid)
  },
  nextMusicClick(e) {
    let arr = app.globalData.arrMusicList
    let rid2 = e.detail.data.rid || e.detail.data.id
    let music = {}
    for (let i = 0; i < arr.length; i++) {
      let rid = arr[i].rid || arr[i].id
      if (rid == rid2) {
        if (i == arr.length - 1) {
          music = arr[0]
          if (arr[i].is_click) {
            arr[i].is_click = false
            music.is_click = true
          }
          console.log(arr[i].is_click)
        } else {
          music = arr[i + 1]
          if (arr[i].is_click) {
            arr[i].is_click = false
            music.is_click = true
          }
        }
        break
      }
    }
    this.setData({
      isPlayMes: music
    })
    app.globalData.isPlayMes = music
    let newRid = this.data.isPlayMes.id || this.data.isPlayMes.rid
    this.playMusicPath(newRid)
  },
  playMusicPath(path) {
    wx.request({
      url: app.globalData.path + "/get_music",
      data: {
        rid: path
      },
      success(res) {
        app.globalData.innerAudioContext.src = res.data.musicPath
        app.globalData.innerAudioContext.autoplay = true
      }
    })
  },
})