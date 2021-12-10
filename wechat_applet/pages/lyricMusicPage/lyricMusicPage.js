// pages/lyricMusicPage/lyricMusicPage.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    timerInterSlider: '',
    timerOut: false,
    timerInter: '',
    is_play: false,
    stepMusic: '',
    move: false,
    musicPercent: '0',
    timeCurrent: '00:00',
    is_checkbox: [],
    selfSongList: [],
    spaceView: false,
    data: {},
    musicLyric: {},
    musicsongInfo: {},
    geci_arr: [],
    geci_num: [],
    geci_time: [],
    scrollViewPosition: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.useMethods()
  },
  useMethods() {
    const _this = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("sendMesToPage", function (data) {
      _this.setData({
        data: data.mes
      })
      let rid = _this.data.data.id || _this.data.data.rid
      wx.request({
        url: app.globalData.path + "/get_music_lyric",
        data: {
          rid: rid
        },
        success(res) {
          let lyric = res.data.musicList.lrclist
          let info = res.data.musicList.songinfo
          let geci_arr = []
          let geci_time = []
          let geci_num = []
          if (lyric == null) {
            geci_arr = ["该歌曲无歌词", "暂不支持滚动"]
          } else {
            for (let i = 0; i < lyric.length; i++) {
              geci_arr.push(lyric[i].lineLyric)
              geci_time.push(lyric[i].time)
              geci_num.push('1')
            }
          }
          _this.setData({
            musicLyric: lyric,
            musicsongInfo: info,
            geci_arr: geci_arr,
            geci_time: geci_time,
            geci_num: geci_num
          })
          if (data.isMyclick == true) {
            _this.setData({
              is_play: true,
              timerInter: setInterval(() => {
                _this.changeSlider2()
              }, 500),
              timerInterSlider: setInterval(() => {
                _this.changeSlider()
              }, 500),
            })
          } else {
            app.globalData.innerAudioContext.onPlay(() => {
              console.log("音乐正在播放")
              _this.setData({
                is_play: true
              })
              app.globalData.is_play = true
            })
            app.globalData.innerAudioContext.onPause(() => {
              console.log("音乐暂停播放")
              _this.setData({
                is_play: false
              })
              app.globalData.is_play = false
            })
            _this.setData({
              timerInter: setInterval(() => {
                _this.changeSlider2()
              }, 500),
              timerInterSlider: setInterval(() => {
                _this.changeSlider()
              }, 500),
            })
          }
        }
      })

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
    console.log("隐藏了界面？？？")
    clearInterval(this.data.timerInter)
    clearInterval(this.data.timerInterSlider)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("页面销毁")
    app.globalData.innerAudioContext.offPlay(() => {
      console.log("取消监听播放")
    })
    app.globalData.innerAudioContext.offPause(() => {
      console.log("取消监听暂停")
    })
    app.globalData.innerAudioContext.offTimeUpdate(() => {
      console.log("取消监听播放进度")
    })
    clearInterval(this.data.timerInter)
    clearInterval(this.data.timerInterSlider)
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
  loveClick() {
    if (wx.getStorageSync("userInfo")) {
      let data = JSON.parse(wx.getStorageSync('userOpenId'))
      let name = data.openid
      let musicMes = this.data.musicsongInfo
      let musicId = this.data.musicsongInfo.id
      wx.request({
        url: app.globalData.path + '/add_userEnjoyList',
        data: {
          name,
          musicId,
          musicMes
        },
        success(res) {
          if (res.data == "添加成功") {
            wx.showToast({
              title: '添加成功',
              icon: "success",
              duration: 1500
            })
          } else {
            wx.showToast({
              title: '已有这首歌曲',
              icon: "none",
              duration: 1500
            })
          }
        }
      })

    } else {
      wx.showToast({
        title: '请先完成登录',
        icon: "error",
        duration: 1500
      })
    }

  },
  cellectClick() {
    let _this = this
    if (wx.getStorageSync("userInfo")) {
      let data = JSON.parse(wx.getStorageSync('userOpenId'))
      let name = data.openid
      wx.request({
        url: app.globalData.path + '/about_selfmakeSongSheet',
        data: {
          name
        },
        success(res) {
          _this.setData({
            selfSongList: res.data.selfmakeSongSheet,
            spaceView: true
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先完成登录',
        icon: "error",
        duration: 1500
      })
    }
  },
  spaceBtnClick() {
    this.setData({
      spaceView: false
    })
  },
  cancelClick() {
    this.setData({
      spaceView: false
    })
    console.log(this.data.musicsongInfo)
  },
  okClick() {
    let _this = this
    let pageMes = _this.data.is_checkbox
    let sucStr = ''
    let errStr = ''
    for (let i = 0; i < pageMes.length; i++) {
      console.log(pageMes[i])
      wx.request({
        url: app.globalData.path + '/add_selfMusicMes',
        data: {
          songMes: _this.data.musicsongInfo,
          aboutId: pageMes[i],
          musicId: _this.data.musicsongInfo.musicrId
        },
        success(res) {
          if (i == pageMes.length - 1) {
            _this.setData({
              spaceView: false
            })
            wx.showToast({
              title: '添加成功',
              icon: "success",
              duration: 1500
            })

          }
        }
      })
    }
  },
  smallSpace() {},
  checkboxChange(e) {
    this.setData({
      is_checkbox: e.detail.value
    })
  },
  // 进度条有关
  movingDrop() {
    // clearInterval(this.data.timerInterSlider)
    this.setData({
      move: true,
    })
  },
  endDrop(e) {
    clearInterval(this.data.timerInterSlider)
    let duration = app.globalData.innerAudioContext.duration
    let pren = e.detail.value
    let currentTime = pren * 0.01 * duration
    app.globalData.innerAudioContext.stop()
    app.globalData.innerAudioContext.seek(currentTime)
    app.globalData.innerAudioContext.play()
    var bili = (currentTime / duration) * 100
    this.setData({
      move: false,
      musicPercent: bili,
    })
    setTimeout(() => {
      this.setData({
        timerInterSlider: setInterval(() => {
          this.changeSlider()
        }, 500),
      })
    }, 1000);
  },
  changeSlider2() {
    if (this.data.is_play == true) {
      let data = this.data
      let currentTime = app.globalData.innerAudioContext.currentTime
      let duration = app.globalData.innerAudioContext.duration
      let sb = this.data.geci_num
      this.setData({
        timeCurrent: util.time_minute(currentTime),
        stepMusic: 100 / duration
      })
      for (let i = 0; i < data.geci_time.length; i++) {
        if (i == data.geci_time.length - 1) {
          sb[i] = "2"
          this.setData({
            geci_num: sb
          })
          break
        }
        if (data.geci_time[i] >= currentTime) {
          if (i < 2) {
            sb[0] = "2"
          } else {
            sb[i - 1] = "2"
          }
          this.setData({
            geci_num: sb,
            scrollViewPosition: (i - 2) * 20
          })
          break
        } else {
          sb[i - 1] = "1"
          this.setData({
            geci_num: sb
          })
        }
      }
    }
  },
  changeSlider() {
    if (this.data.is_play == true) {
      if (this.data.move == false) {
        let currentTime = app.globalData.innerAudioContext.currentTime
        let duration = app.globalData.innerAudioContext.duration
        var bili = (currentTime / duration) * 100
        this.setData({
          musicPercent: bili,
        })
      }
    }
  },
  // 上 下一曲
  preClick() {
    app.globalData.innerAudioContext.stop()
    const _this = this
    let rid2 = _this.data.data.id || _this.data.data.rid
    let arr = app.globalData.arrMusicList
    let music = {}
    for (let i = 0; i < arr.length; i++) {
      let rid = arr[i].rid || arr[i].id
      if (rid == rid2) {
        if (i == 0) {
          music = arr[arr.length - 1]
        } else {
          music = arr[i - 1]
        }
        break
      }
    }
    _this.setData({
      data: music
    })

    let woc = wx.getStorageSync('userInfo')
    if (woc) {
      let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
      let musicMes = this.data.data
      let musicId = this.data.data.rid || this.data.data.id
      util.addCumulativemusic(name, musicMes, musicId)
    }

    let newRid = _this.data.data.id || _this.data.data.rid
    wx.request({
      url: app.globalData.path + "/get_music_lyric",
      data: {
        rid: newRid
      },
      success(res) {
        let lyric = res.data.musicList.lrclist
        let info = res.data.musicList.songinfo
        let geci_arr = []
        let geci_time = []
        let geci_num = []
        if (lyric == null) {
          geci_arr = ["该歌曲无歌词", "暂不支持滚动"]
        } else {
          for (let i = 0; i < lyric.length; i++) {
            geci_arr.push(lyric[i].lineLyric)
            geci_time.push(lyric[i].time)
            geci_num.push('1')
          }
        }
        _this.setData({
          musicLyric: lyric,
          musicsongInfo: info,
          geci_arr: geci_arr,
          geci_time: geci_time,
          geci_num: geci_num
        })
        _this.playMusicPath(newRid)
        let isplayNb = _this.data.musicsongInfo
        app.globalData.isPlayMes = isplayNb
        app.globalData.innerAudioContext.play()
      }
    })

  },
  nextClick() {
    app.globalData.innerAudioContext.stop()
    const _this = this
    let rid2 = _this.data.data.id || _this.data.data.rid
    let arr = app.globalData.arrMusicList
    let music = {}
    for (let i = 0; i < arr.length; i++) {
      let rid = arr[i].rid || arr[i].id
      if (rid == rid2) {
        if (i == arr.length - 1) {
          music = arr[0]
        } else {
          music = arr[i + 1]
        }
        break
      }
    }
    _this.setData({
      data: music
    })
    console.log(this.data.data)
    app.globalData.isPlayMes = this.data.data
    let woc = wx.getStorageSync('userInfo')
    if (woc) {
      let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
      let musicMes = this.data.data
      let musicId = this.data.data.rid || this.data.data.id
      util.addCumulativemusic(name, musicMes, musicId)
    }

    let newRid = _this.data.data.id || _this.data.data.rid
    wx.request({
      url: app.globalData.path + "/get_music_lyric",
      data: {
        rid: newRid
      },
      success(res) {
        let lyric = res.data.musicList.lrclist
        let info = res.data.musicList.songinfo
        let geci_arr = []
        let geci_time = []
        let geci_num = []
        if (lyric == null) {
          geci_arr = ["该歌曲无歌词", "暂不支持滚动"]
        } else {
          for (let i = 0; i < lyric.length; i++) {
            geci_arr.push(lyric[i].lineLyric)
            geci_time.push(lyric[i].time)
            geci_num.push('1')
          }
        }
        _this.setData({
          musicLyric: lyric,
          musicsongInfo: info,
          geci_arr: geci_arr,
          geci_time: geci_time,
          geci_num: geci_num
        })
        _this.playMusicPath(newRid)
        console.log("输出内容")
        let isplayNb = _this.data.musicsongInfo
        app.globalData.isPlayMes = isplayNb
        app.globalData.innerAudioContext.play()
      }
    })
  },
  // 音乐播放地址
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
  // 播放音乐
  playMusic() {
    app.globalData.innerAudioContext.play()
    app.globalData.is_play = true
    this.setData({
      is_play: true
    })
  },
  // 暂停音乐
  pauseMusic() {
    app.globalData.innerAudioContext.pause()
    app.globalData.is_play = false
    this.setData({
      is_play: false
    })
  }
})