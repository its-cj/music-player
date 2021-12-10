// pages/recomMusicPage/recomMusicPage.js
const app = getApp()
const util = require('../../utils/util.js')
// const innerAudioContext = wx.createInnerAudioContext()
//         innerAudioContext.autoplay = true

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_play: app.globalData.is_play,
    is_show: app.globalData.is_show,
    isPlayMes: app.globalData.isPlayMes,
    pn: 1,
    musicData: {},
    is_rank: false,
    pageMes: {},
    rid: '',
    who_play: 0,
    bangId: 0
  },
  musicPlayClickFather: function (e) {

    if (this.data.rid == e.detail.data.musicMes.rid) {
      app.globalData.innerAudioContext.pause()
      app.globalData.is_play = false
      let data = this.data.musicData
      let num = e.detail.data.num - 1
      data.data.musicList[num].is_play = false
      this.setData({
        musicData: data,
        rid: '',
        who_play: num
      })
    } else {
      const _this = this
      wx.request({
        url: app.globalData.path + "/get_music",
        data: {
          rid: e.detail.data.musicMes.rid
        },
        success(res) {
          let data = _this.data.musicData
          let changeNum = e.detail.data.num - 1
          for (let i = 0; i < data.data.musicList.length; i++) {
            data.data.musicList[i].is_play = false
          }
          data.data.musicList[changeNum].is_play = true
          _this.setData({
            musicData: data,
            rid: e.detail.data.musicMes.rid,
            who_play: changeNum,
            isPlayMes: e.detail.data.musicMes
          })
          app.globalData.innerAudioContext.src = res.data.musicPath
          app.globalData.innerAudioContext.autoplay = true
          app.globalData.isPlayMes = _this.data.isPlayMes
          // innerAudioContext.src = res.data.musicPath

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
  collectionClick() {
    let data = wx.getStorageSync('userInfo')
    if (data) {
      let dataId = wx.getStorageSync('userOpenId')
      if (dataId) {
        let name = JSON.parse(dataId).openid
        let data = this.data.musicData.data
        let id = data.id
        let songSheetMes = JSON.stringify({
          img: data.img,
          name: data.name,
          total: data.total,
          userName: data.userName,
          id: data.id
        })
        // 存用户名 存歌单id
        wx.request({
          url: app.globalData.path + '/add_collection',
          data: {
            name: name,
            id: id,
            songSheetMes: songSheetMes
          },
          success: function (res) {
            console.log(res)
            if (res.data == "添加成功") {
              wx.showToast({
                title: '添加成功',
                icon: "success",
                duration: 1500
              })
            } else {
              wx.showToast({
                title: '请勿重复添加',
                icon: "error",
                duration: 2000
              })
            }
          }
        })

      } else {
        // 获取 用户的 id
      }
    } else {
      wx.showToast({
        title: '请先完成登录',
        icon: 'none',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../login/login',
        })
      }, 1000);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("ranksendMesToPage", function (data) {
      _this.setData({
        is_rank: true,
        bangId: data.mes.mes.id
      })
      wx.request({
        url: app.globalData.path + '/get_rankmusiclist?bangId=' + data.mes.mes.id,
        success: function (res) {
          let dataMes = JSON.parse(res.data.musicList)
          for (let i = 0; i < dataMes.data.musicList.length; i++) {
            dataMes.data.musicList[i].is_play = false
          }
          _this.setData({
            musicData: dataMes,
          })
        }
      })
    })
    eventChannel.on("sendMesToPage", function (data) {
      _this.setData({
        is_rank: false,
        pageMes: data.mes
      })
      // console.log(_this.data.pageMes)
      // console.log(data)
      let id = _this.data.pageMes.mes.id
      wx.request({
        url: app.globalData.path + '/get_musiclist?pid=' + id,
        success: function (res) {
          let data = JSON.parse(res.data.musicList)
          for (let i = 0; i < data.data.musicList.length; i++) {
            data.data.musicList[i].is_play = false
          }
          _this.setData({
            musicData: data,
          })
        }
      })
    })

    app.globalData.innerAudioContext.onEnded(() => {
      let hot = _this.data.musicData
      hot.data.musicList[_this.data.who_play].is_play = false
      _this.setData({
        musicData: hot,
      })
    })
    app.globalData.innerAudioContext.onPlay(() => {
      app.globalData.arrMusicList = this.data.musicData.data.musicList
      app.globalData.is_show = true
      app.globalData.is_play = true

      console.log(this.data.isPlayMes)
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
    console.log("输出内容 nbbbb")
    console.log(app.globalData.isPlayMes)

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
    let _this = this
    let id = this.data.musicData.data.id
    let idB = this.data.bangId
    let asol = this.data.musicData.data.total
    let asolB = this.data.musicData.data.num
    let currn = this.data.musicData.data.musicList.length
    let pn = this.data.pn
    if (this.data.is_rank == false && asol > currn) {
      console.log("歌单")
      wx.request({
        url: app.globalData.path + '/get_musiclist',
        data: {
          pid: id,
          pn: pn + 1
        },
        success: function (res) {
          console.log(JSON.parse(res.data.musicList))
          let musicData = _this.data.musicData
          let arr = JSON.parse(res.data.musicList).data.musicList
          for (let i = 0; i < arr.length; i++) {
            arr[i].is_play = false
            musicData.data.musicList.push(arr[i])
          }
          _this.setData({
            musicData: musicData,
            pn: pn + 1
          })
        }
      })
    }
    if (this.data.is_rank == true && asolB > currn) {
      wx.request({
        url: app.globalData.path + '/get_rankmusiclist',
        data: {
          bangId: idB,
          pn: pn + 1
        },
        success: function (res) {
          let musicData = _this.data.musicData
          let arr = JSON.parse(res.data.musicList).data.musicList
          for (let i = 0; i < arr.length; i++) {
            arr[i].is_play = false
            musicData.data.musicList.push(arr[i])
          }
          _this.setData({
            musicData: musicData,
            pn: pn + 1
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  playMusicClick: function (e) {
    let data = this.data.musicData
    let who_play = this.data.who_play
    data.data.musicList[who_play].is_play = false
    this.changeIsClick(data.data.musicList[who_play])
    this.setData({
      musicData: data,
      is_play: false
    })

    app.globalData.is_play = false
    app.globalData.innerAudioContext.pause()
  },
  pauseMusicClick(e) {
    let data = this.data.musicData
    let who_play = this.data.who_play
    data.data.musicList[who_play].is_play = true
    this.changeIsClick(data.data.musicList[who_play])
    this.setData({
      musicData: data,
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
    let data = this.data.musicData
    let who_play = this.data.who_play
    data.data.musicList[who_play].is_play = false
    let num = ''
    if (who_play == 0) {
      num = data.data.musicList.length - 1
      data.data.musicList[num].is_play = true
      this.changeIsClick(data.data.musicList[num])
    }else{
      num = who_play - 1
      data.data.musicList[num].is_play = true
      this.changeIsClick(data.data.musicList[num])
    }
    this.setData({
      musicData: data,
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
      delete musicMes.is_click
      let musicId = this.data.isPlayMes.rid || this.data.isPlayMes.id
      util.addCumulativemusic(name, musicMes, musicId)
    }
    app.globalData.isPlayMes = music
    let newRid = this.data.isPlayMes.id || this.data.isPlayMes.rid
    this.playMusicPath(newRid)
  },
  nextMusicClick(e) {
    let data = this.data.musicData
    let who_play = this.data.who_play
    data.data.musicList[who_play].is_play = false
    let num = ''
    if (who_play == data.data.musicList.length - 1) {
      num = 0
      data.data.musicList[num].is_play = true
      this.changeIsClick(data.data.musicList[num])
    }else{
      num = who_play + 1
      data.data.musicList[num].is_play = true
      this.changeIsClick(data.data.musicList[num])
    }
    this.setData({
      musicData: data,
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
    let woc = wx.getStorageSync('userInfo')
    if (woc) {
      let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
      let musicMes = this.data.isPlayMes
      delete musicMes.is_play
      delete musicMes.is_click
      let musicId = this.data.isPlayMes.rid || this.data.isPlayMes.id
      util.addCumulativemusic(name, musicMes, musicId)
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
  changeIsClick(mes){
    delete mes.is_click
  },
  palyAllMusic() {
    console.log(this.data)
    let musicMesAll = this.data.musicData
    for(let i = 0; i < musicMesAll.data.musicList.length; i ++){
      musicMesAll.data.musicList[i].is_play = false
    }
    musicMesAll.data.musicList[0].is_play = true
    let musicMes = this.data.musicData.data.musicList[0]
    const _this = this
    wx.request({
      url: app.globalData.path + "/get_music",
      data: {
        rid: musicMes.rid || musicMes.id
      },
      success(res) {
        _this.setData({
          musicData: musicMesAll,
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