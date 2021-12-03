// pages/searchPage/searchPage.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyAndValue: '农夫渔夫',
    inputValue: '农夫渔夫',
    musicArr: [],
    musicMes: {},
    is_show: false,
    is_play: app.globalData.is_play,
    isPlayMes: app.globalData.isPlayMes,
    pn: 1,
    searchHistory: []
  },
  searchClick() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let _this = this
    let searchCon = this.data.inputValue
    if (searchCon) {
      console.log("搜索" + searchCon)
      let localArr = wx.getStorageSync("localHistory")
      if (localArr) {
        console.log("不是第一次啦")
        console.log(localArr)
        let str = util.trim(searchCon)
        let arr =  JSON.parse(wx.getStorageSync("localHistory"))
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == str) {
            console.log("值一样要删除")
            arr.splice(i, 1)
          }
        }
        console.log("要加入值啦")
        arr.push(str)
        wx.setStorageSync('localHistory', JSON.stringify(arr))
      } else {
        console.log("存一下")
        let arr = [searchCon]
        wx.setStorageSync('localHistory', JSON.stringify(arr))
      }
      console.log(JSON.parse(wx.getStorageSync("localHistory")))
      wx.request({
        url: app.globalData.path + '/music_list',
        data: {
          key_word: searchCon
        },
        success(res) {
          _this.setData({
            musicArr: res.data.data.list
          })
          wx.hideLoading()
        },
        fail(){
          wx.hideLoading()
          wx.showToast({
            title: '糟糕，失败了',
            icon: "error",
            duration: 1500
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入内容',
        icon: "none",
        duration: 1500
      })

    }
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  nbClick(e) {
    this.setData({
      musicMes: e.detail.musicMes
    })
    const _this = this
    wx.request({
      url: app.globalData.path + "/get_music",
      data: {
        rid: e.detail.musicMes.rid || e.detail.musicMes.id
      },
      success(res) {
        _this.setData({
          isPlayMes: e.detail.musicMes
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
          mes: e.detail.musicMes
        })
      }
    })
  },
  claerBtn() {
    wx.removeStorageSync('localHistory')
    this.setData({
      searchHistory: []
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("localHistory")) {
      let localArr = JSON.parse(wx.getStorageSync("localHistory"))
      if (localArr) {
        if (localArr.length > 0) {
          let arr = []
          for (let i = localArr.length - 1; i >= 0; i--) {
            arr.push(localArr[i])
          }
          this.setData({
            searchHistory: arr
          })
        }
      }
    }
    app.globalData.innerAudioContext.onPlay(() => {
      app.globalData.arrMusicList = this.data.musicArr
      app.globalData.is_show = true
      app.globalData.is_play = true
      app.globalData.isPlayMes = this.data.musicMes
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

    if (app.globalData.is_show == true) {
      console.log("进来啦")
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
    let pn = this.data.pn
    let searchCon = this.data.inputValue
    wx.request({
      url: app.globalData.path + '/music_list',
      data: {
        key_word: searchCon,
        pn: pn + 1
      },
      success(res) {
        let arr = res.data.data.list
        let musicArr = _this.data.musicArr
        for (let i = 0; i < arr.length; i++) {
          musicArr.push(arr[i])
        }
        _this.setData({
          musicArr: musicArr
        })
      }
    })
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
  clickHistory(e){
    this.setData({
      inputValue: e.target.dataset.bean,
      keyAndValue: e.target.dataset.bean
    })
    this.searchClick()
  }
})