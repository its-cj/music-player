// pages/musicList/musicList.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_play: app.globalData.is_play,
    is_show: app.globalData.is_show,
    isPlayMes: app.globalData.isPlayMes,
    userInfo: {},
    mes: {},
    musicMes: {},
    rid: '',
    who_play: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync("userInfo")).userInfo
      })
    }
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("mySelfToPage", function (data) {
      _this.setData({
        mes: data.mes.mes
      })
      if (wx.getStorageSync('userOpenId')) {
        let name = JSON.parse(wx.getStorageSync("userOpenId")).openid
        let musicMes = {}
        let data = _this.data.mes
        if (data.name == "最近播放") {
          wx.request({
            url: app.globalData.path + '/select_userMusicList?name=' + name,
            success: function (res) {
              let musicData = {}
              let data = res.data.musicList
              let arr = []
              for (let i = data.length - 1; i >= 0; i--) {
                data[i].is_play = false
                arr.push(data[i])
              }
              musicData.num = data.length
              musicData.musicList = arr
              _this.setData({
                musicMes: musicData
              })
            }
          })
        } else if (data.name == "我喜欢的音乐") {
          wx.request({
            url: app.globalData.path + '/select_userEnjoyList?name=' + name,
            success: function (res) {
              let musicData = {}
              let data = res.data.musicList
              for (let i = 0; i < data.length; i++) {
                data[i].is_play = false
              }
              musicData.num = data.length
              musicData.musicList = data
              _this.setData({
                musicMes: musicData
              })
            }
          })
        } else {
          let songName = data.name
          wx.request({
            url: app.globalData.path + '/select_selfmakeSongSheet',
            data: {
              name: name,
              title: songName
            },
            success: function (res) {
              let musicData = {}
              let data = res.data.musicList
              for (let i = 0; i < data.length; i++) {
                data[i].is_play = false
              }
              musicData.num = data.length
              musicData.musicList = data
              _this.setData({
                musicMes: musicData
              })
            }
          })
        }

      }
    })
    app.globalData.innerAudioContext.onPlay(() => {
      app.globalData.arrMusicList = this.data.musicMes.musicList
      app.globalData.is_show = true
      app.globalData.is_play = true
      app.globalData.isPlayMes = this.data.isPlayMes
    })
  },
  musicPlayClickFather(e) {
    let rid = e.detail.data.musicMes.id || e.detail.data.musicMes.rid
    if (this.data.rid == rid) {
      app.globalData.innerAudioContext.pause()
      let data = this.data.musicMes
      let num = e.detail.data.num - 1
      data.musicList[num].is_play = false
      this.setData({
        musicMes: data,
        rid: '',
        who_play: num
      })
    } else {
      const _this = this
      wx.request({
        url: app.globalData.path + "/get_music",
        data: {
          rid: e.detail.data.musicMes.rid || e.detail.data.musicMes.id
        },
        success(res) {
          let data = _this.data.musicMes
          let changeNum = e.detail.data.num - 1
          for (let i = 0; i < data.musicList.length; i++) {
            data.musicList[i].is_play = false
          }
          data.musicList[changeNum].is_play = true
          _this.setData({
            musicMes: data,
            rid: e.detail.data.musicMes.rid || e.detail.data.musicMes.id,
            who_play: changeNum,
            isPlayMes: e.detail.data.musicMes
          })
          app.globalData.innerAudioContext.src = res.data.musicPath
          app.globalData.innerAudioContext.autoplay = true

          let InfoData = wx.getStorageSync('userInfo')
          if (InfoData) {
            let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
            let musicMes = _this.data.isPlayMes
            let musicId = _this.data.isPlayMes.rid || _this.data.isPlayMes.id
            util.addCumulativemusic(name, musicMes, musicId)
          }
        }
      })
      wx.navigateTo({
        url: '../lyricMusicPage/lyricMusicPage',
        success: function (res) {
          res.eventChannel.emit("sendMesToPage", {
            mes: e.detail.data.musicMes
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
    app.globalData.innerAudioContext.offPlay(function () {
      console.log("取消监听播放")
    })
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
    let data = this.data.musicMes
    let who_play = this.data.who_play
    data.musicList[who_play].is_play = false
    this.changeIsClick(data.musicList[who_play])
    console.log(data.musicList[who_play])
    this.setData({
      musicMes: data,
      is_play: false
    })
    app.globalData.is_play = false
    app.globalData.innerAudioContext.pause()
  },
  pauseMusicClick(e) {
    let data = this.data.musicMes
    let who_play = this.data.who_play
    data.musicList[who_play].is_play = true
    this.changeIsClick(data.musicList[who_play])
    console.log(data.musicList[who_play])
    this.setData({
      musicMes: data,
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
    let data = this.data.musicMes
    let who_play = this.data.who_play
    data.musicList[who_play].is_play = false
    let num = ''
    if (who_play == 0) {
      num = data.musicList.length - 1
      data.musicList[num].is_play = true
      this.changeIsClick(data.musicList[num])
    }else{
      num = who_play - 1
      data.musicList[num].is_play = true
      this.changeIsClick(data.musicList[num])
    }
    this.setData({
      musicMes: data,
      who_play: num
    })
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
    let woc = wx.getStorageSync('userInfo')
    if (woc) {
      let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
      let musicMes = this.data.isPlayMes
      delete musicMes.is_play
      let musicId = this.data.isPlayMes.rid || this.data.isPlayMes.id
      util.addCumulativemusic(name, musicMes, musicId)
    }

    app.globalData.isPlayMes = music
    let newRid = this.data.isPlayMes.id || this.data.isPlayMes.rid
    this.playMusicPath(newRid)
  },
  nextMusicClick(e) {
    let data = this.data.musicMes
    let who_play = this.data.who_play
    data.musicList[who_play].is_play = false
    let num = ''
    if (who_play == data.musicList.length - 1) {
      num = 0
      data.musicList[num].is_play = true
      this.changeIsClick(data.musicList[num])
    }else{
      num = who_play + 1
      data.musicList[num].is_play = true
      this.changeIsClick(data.musicList[num])
    }
    this.setData({
      musicMes: data,
      who_play: num
    })



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
    let woc = wx.getStorageSync('userInfo')
    if (woc) {
      let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
      let musicMes = this.data.isPlayMes
      delete musicMes.is_play
      let musicId = this.data.isPlayMes.rid || this.data.isPlayMes.id
      util.addCumulativemusic(name, musicMes, musicId)
    }

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
  changeIsClick(mes){
    delete mes.is_click
  },
  palyAllMusic(){
    let musicMesAll = this.data.musicMes
    for(let i = 0; i < musicMesAll.musicList.length; i ++){
      musicMesAll.musicList[i].is_play = false
    }
    musicMesAll.musicList[0].is_play = true
    let musicMes = this.data.musicMes.musicList[0]
    const _this = this
    wx.request({
      url: app.globalData.path + "/get_music",
      data: {
        rid: musicMes.rid || musicMes.id
      },
      success(res) {
        _this.setData({
          musicMes: musicMesAll,
          isPlayMes: musicMes,
          who_play: 0
        })
        app.globalData.innerAudioContext.src = res.data.musicPath
        app.globalData.innerAudioContext.autoplay = true
        app.globalData.isPlayMes = musicMes

        let InfoData = wx.getStorageSync('userInfo')
        if (InfoData) {
          let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
          let musicMes = _this.data.isPlayMes
          let musicId = _this.data.isPlayMes.rid || _this.data.isPlayMes.id
          util.addCumulativemusic(name, musicMes, musicId)
        }
      }
    })
    wx.navigateTo({
      url: '../lyricMusicPage/lyricMusicPage',
      success: function (res) {
        res.eventChannel.emit("sendMesToPage", {
          mes: musicMes
        })
      }
    })
  }
})