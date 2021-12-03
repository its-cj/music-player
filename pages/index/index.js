// index.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
// const innerAudioContext = wx.createInnerAudioContext()
// innerAudioContext.autoplay = true

Page({
  data: {
    imgList: [],
    //是否采用衔接滑动  
    circular: true,
    //是否显示画板指示点  
    indicatorDots: true,
    //选中点的颜色  
    indicatorcolor: "#0afae8",
    //是否自动切换  
    autoplay: true,
    //自动切换的间隔
    interval: 2500,
    //滑动动画时长毫秒  
    duration: 500,
    //所有图片的高度  （必须）
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  （必须）
    current: 0,
    hotMusic: [],
    newMusic: [],
    rankMusic: [],
    recommendMusic: [],
    musicPath: '',
    index_music: 0,
    hotMes: {},
    newMes: {},
    is_hot: true,
    isPlayMes: {},
    is_play: false,
    play_temp: false,
    mes: {
      icon: true,
      titlename: "热门音乐",
      titlename2: "更多",
      src: "/imgs/more_jian.png"
    },
    mes2: {
      icon: true,
      titlename: "最新音乐",
      titlename2: "更多",
      src: "/imgs/more_jian.png"
    },
    mes3: {
      icon: false,
      titlename: "推荐歌单"
    },
    mes4: {
      icon: false,
      titlename: "快乐排行榜"
    },
  },
  imageLoad: function (e) { //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({
      current: e.detail.current
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../searchPage/searchPage'
    })
  },
  playMusicClick: function (e) {
    this.setData({
      is_play: false
    })
    app.globalData.is_play = false
    app.globalData.innerAudioContext.pause()
    console.log(app.globalData.isPlayMes)

    let hotmus = this.data.hotMusic
    let newmus = this.data.newMusic
    if (app.globalData.isPlayMes.is_click == false) {
      console.log("我进来了")
      if (this.data.is_hot == true) {
        hotmus[this.data.index_music].is_click = false
        console.log(this.data.index_music)
        this.setData({
          hotMusic: hotmus
        })
      } else {
        newmus[this.data.index_music].is_click = false
        this.setData({
          newMusic: newmus
        })
      }
    } else {
      //   for(let i = 0; i < hotmus.length; i++){
      //     hotmus[i].is_click = false
      //     newmus[i].is_click = false
      //     if (i == hotmus.length - 1) {
      //       this.setData({
      //         hotMusic: hotmus,
      //         newMusic: newmus
      //       })
      //     }
      //   }
      // }
    }
  },
  pauseMusicClick(e) {
    this.setData({
      is_play: true
    })
    console.log(app.globalData.isPlayMes)
    let hotmus = this.data.hotMusic
    let newmus = this.data.newMusic
    if (app.globalData.isPlayMes.is_click == false) {
      console.log('hhh 我又进来了啊')
      if (this.data.is_hot == true) {
        hotmus[this.data.index_music].is_click = true
        this.setData({
          hotMusic: hotmus
        })
      } else {
        newmus[this.data.index_music].is_click = true
        this.setData({
          newMusic: newmus
        })
      }
    } else {
      // for(let i = 0; i < hotmus.length; i++){
      //   hotmus[i].is_click = false
      //   newmus[i].is_click = false
      //   if (i == hotmus.length - 1) {
      //     this.setData({
      //       hotMusic: hotmus,
      //       newMusic: newmus
      //     })
      //   }
      // }
    }
    app.globalData.is_play = true
    app.globalData.innerAudioContext.play()
  },
  playMusic: function (e) {
    let _this = this
    let message = e.detail
    let music = this.data.hotMusic
    let music2 = this.data.newMusic
    let is_hot = true

    this.setData({
      index_music: message.whoChange,
      isPlayMes: message.mes,
      play_temp: true,
      is_hot: is_hot
    })
    let is_what = music[message.whoChange].is_click
    if (is_what == true) {
      music[message.whoChange].is_click = false
      app.globalData.innerAudioContext.pause()
      this.setData({
        is_play: false
      })
    } else {
      app.globalData.arrMusicList = music
      for (let i = 0; i < music.length; i++) {
        music[i].is_click = false
        music2[i].is_click = false
      }
      music[message.whoChange].is_click = true
      this.setData({
        hotMusic: music,
        newMusic: music2
      })
      wx.request({
        url: app.globalData.path + "/get_music",
        data: {
          rid: message.mes.rid
        },
        success(res) {
          _this.setData({
            musicPath: res.data.musicPath,
            is_play: true
          })
          app.globalData.innerAudioContext.src = res.data.musicPath
          app.globalData.innerAudioContext.autoplay = true
          app.globalData.isPlayMes = message.mes

          let data = wx.getStorageSync('userInfo')
          if (data) {
            let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
            let musicMes = _this.data.isPlayMes
            let musicId = _this.data.isPlayMes.rid
            util.addCumulativemusic(name, musicMes, musicId)
          }
        }
      })
      wx.navigateTo({
        url: '../lyricMusicPage/lyricMusicPage',
        success: function (res) {
          res.eventChannel.emit("sendMesToPage", {
            mes: e.detail.mes
          })
        }
      })
    }
    this.setData({
      hotMusic: music
    })
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
  preMusicClick(e) {
    let hotmus = this.data.hotMusic
    let newmus = this.data.newMusic
    let arr = app.globalData.arrMusicList
    let rid2 = e.detail.data.rid || e.detail.data.id
    let music = {}
    for (let i = 0; i < arr.length; i++) {
      let rid = arr[i].rid || arr[i].id
      if (rid == rid2) {
        if (i == 0) {
          music = arr[arr.length - 1]
          if (arr[i].is_click) {
            if (this.data.is_hot == true) {
              hotmus[this.data.index_music].is_click = false
              hotmus[arr.length - 1].is_click = true
              this.setData({
                hotMusic: hotmus,
                index_music: arr.length - 1
              })
            } else {
              newmus[this.data.index_music].is_click = false
              newmus[arr.length - 1].is_click = true
              this.setData({
                newMusic: newmus,
                index_music: arr.length - 1
              })
            }
          }
        } else {
          music = arr[i - 1]
          if (arr[i].is_click) {
            if (this.data.is_hot == true) {
              hotmus[this.data.index_music].is_click = false
              hotmus[i - 1].is_click = true
              this.setData({
                hotMusic: hotmus,
                index_music: i - 1
              })
            } else {
              newmus[this.data.index_music].is_click = false
              newmus[i - 1].is_click = true
              this.setData({
                newMusic: newmus,
                index_music: i - 1
              })
            }
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
    let hotmus = this.data.hotMusic
    let newmus = this.data.newMusic
    let arr = app.globalData.arrMusicList
    let rid2 = e.detail.data.rid || e.detail.data.id
    let music = {}
    console.log("关于下一曲")
    for (let i = 0; i < arr.length; i++) {
      console.log("循环" + i)
      let rid = arr[i].rid || arr[i].id
      if (rid == rid2) {
        console.log("rid == rid2相等")
        if (i == arr.length - 1) {
          music = arr[0]
          console.log("关于下一曲 是最后一个")

          if (arr[i].is_click) {


            if (this.data.is_hot == true) {
              hotmus[this.data.index_music].is_click = false
              hotmus[0].is_click = true
              this.setData({
                hotMusic: hotmus,
                index_music: 0
              })
              console.log("下一曲")
              console.log(this.data.index_music)
            } else {
              newmus[this.data.index_music].is_click = false
              newmus[0].is_click = true
              this.setData({
                newMusic: newmus,
                index_music: 0
              })
              console.log(this.data.index_music)
            }

          }
        } else {
          console.log("关于下一曲 不是最后一个")
          music = arr[i + 1]
          if (arr[i].is_click) {
            if (this.data.is_hot == true) {
              hotmus[i].is_click = false
              hotmus[i + 1].is_click = true
              this.setData({
                hotMusic: hotmus,
                index_music: i + 1
              })
            } else {
              newmus[i].is_click = false
              newmus[i + 1].is_click = true
              this.setData({
                newMusic: newmus,
                index_music: i + 1
              })
            }
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
  playMusic2: function (e) {
    let _this = this
    let message = e.detail
    let music = this.data.newMusic
    let music2 = this.data.hotMusic
    let is_hot = false
    this.setData({
      index_music: message.whoChange,
      isPlayMes: message.mes,
      is_play: music[message.whoChange].is_click,
      is_hot: is_hot,
      play_temp: true,
    })
    let is_what = music[message.whoChange].is_click
    if (is_what == true) {
      music[message.whoChange].is_click = false
      app.globalData.innerAudioContext.pause()
      this.setData({
        is_play: false
      })
    } else {
      app.globalData.arrMusicList = music
      for (let i = 0; i < music.length; i++) {
        music[i].is_click = false
        music2[i].is_click = false
      }
      music[message.whoChange].is_click = true
      this.setData({
        hotMusic: music2,
        newMusic: music
      })
      wx.request({
        url: app.globalData.path + "/get_music",
        data: {
          rid: message.mes.rid
        },
        success(res) {
          _this.setData({
            musicPath: res.data.musicPath,
            is_play: true
          })
          // innerAudioContext.src = res.data.musicPath
          app.globalData.innerAudioContext.src = res.data.musicPath
          app.globalData.innerAudioContext.autoplay = true
          app.globalData.isPlayMes = message.mes

          let data = wx.getStorageSync('userInfo')
          if (data) {
            let name = JSON.parse(wx.getStorageSync('userOpenId')).openid
            let musicMes = _this.data.isPlayMes
            let musicId = _this.data.isPlayMes.rid
            util.addCumulativemusic(name, musicMes, musicId)
          }
        }
      })
      wx.navigateTo({
        url: '../lyricMusicPage/lyricMusicPage',
        success: function (res) {
          res.eventChannel.emit("sendMesToPage", {
            mes: e.detail.mes
          })
        }
      })
    }
    this.setData({
      newMusic: music
    })
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
  recomBeClick: function (e) {
    console.log(e.detail)
    wx.navigateTo({
      url: '../recomMusicPage/recomMusicPage',
      success: function (res) {
        res.eventChannel.emit("sendMesToPage", {
          mes: e.detail
        })
      }
    })
  },
  rankBeClick: function (e) {
    // console.log(e.detail)
    wx.navigateTo({
      url: "../recomMusicPage/recomMusicPage",
      success: function (res) {
        res.eventChannel.emit("ranksendMesToPage", {
          mes: e.detail
        })
      }
    })
  },
  moreClick: function (e) {
    let messa = {
      mes: {}
    }
    if (e.detail.data.mes.titlename == "热门音乐") {
      messa.mes.id = 16
    } else if (e.detail.data.mes.titlename == "最新音乐") {
      messa.mes.id = 17
    }
    wx.navigateTo({
      url: "../recomMusicPage/recomMusicPage",
      success: function (res) {
        res.eventChannel.emit("ranksendMesToPage", {
          mes: messa
        })
      }
    })
  },
  onLoad() {
    let _this = this
    app.globalData.innerAudioContext.onEnded(() => {
      let hot = _this.data.hotMusic
      hot[_this.data.index_music].is_click = false
      _this.setData({
        hotMusic: hot
      })
    })
    wx.request({
      url: app.globalData.path + "/get_index",
      success(res) {
        let data = res.data
        let swiperList = JSON.parse(data.swiperList).data
        let hotMusic = JSON.parse(data.hotMusic).data.musicList
        let hotMes = JSON.parse(res.data.hotMusic).data
        let newMusic = JSON.parse(data.newMusic).data.musicList
        let newMes = JSON.parse(res.data.newMusic).data
        for (let i = 0; i < hotMusic.length; i++) {
          hotMusic[i].is_click = false
          newMusic[i].is_click = false
        }
        let imgList = []
        for(let i = 0; i < swiperList.length; i++){
          imgList.push(swiperList[i].pic)
        }
        _this.setData({
          hotMusic,
          newMusic,
          hotMes,
          newMes,
          imgList
        })

      }
    })

    wx.request({
      url: app.globalData.path + "/get_index2",
      success(res) {
        let data = res.data
        let rankMusic = data.rankMusic
        let recommendMusic = data.recommendMusic
        let arr = []
        for (let i = 0; i < 3; i++) {
          let num = recommendMusic[i].listencnt
          recommendMusic[i].is_rank = false
          recommendMusic[i].listencnt = util.numChange(num)
          arr.push(recommendMusic[i])
        }
        _this.setData({
          rankMusic: rankMusic,
          recommendMusic: arr
        })
      }
    })

    // app.globalData.innerAudioContext.onPause(() => {
    //   let hotmus = _this.data.hotMusic
    //   let newmus = _this.data.newMusic
    //   if (_this.data.is_hot == true) {
    //     hotmus[_this.data.index_music].is_click = false
    //     console.log("监听暂停")
    //     console.log(_this.data.index_music)
    //     _this.setData({
    //       hotMusic: hotmus
    //     })
    //   } else {
    //     newmus[_this.data.index_music].is_click = false
    //     _this.setData({
    //       newMusic: newmus
    //     })
    //   }
    // })
    app.globalData.innerAudioContext.onPlay(() => {
      console.log("监听播放")
      console.log(this.data.index_music)

      app.globalData.is_show = true

      let hotmus = _this.data.hotMusic
      let newmus = _this.data.newMusic
      if (_this.data.is_hot == true) {
        hotmus[_this.data.index_music].is_click = true
        _this.setData({
          hotMusic: hotmus
        })
      } else {
        newmus[_this.data.index_music].is_click = true
        _this.setData({
          newMusic: newmus
        })
      }
    })
  },
  onShow: function () {
    if (app.globalData.is_show == true) {
      this.setData({
        play_temp: true,
        is_play: app.globalData.is_play,
        isPlayMes: app.globalData.isPlayMes
      })
    }
    // this.doThisChange()

    let hotmus = this.data.hotMusic
    let newmus = this.data.newMusic
    console.log(app.globalData.isPlayMes)
    if (app.globalData.isPlayMes.is_click == false) {
      console.log("你在播放吗？")
      if (this.data.is_play == true) {
        if (this.data.is_hot == true) {
          for (let i = 0; i < app.globalData.arrMusicList.length; i++) {
            if (app.globalData.arrMusicList[i].is_click) {
              hotmus[i].is_click = true
              this.setData({
                hotMusic: hotmus,
                index_music: i
              })
              console.log(this.data.index_music)
            }
          }
        } else {
          for (let i = 0; i < app.globalData.arrMusicList.length; i++) {
            if (app.globalData.arrMusicList[i].is_click) {
              newmus[i].is_click = true
              this.setData({
                newMusic: newmus,
                index_music: i
              })
            }
          }
        }
      }
    } else {
      for (let i = 0; i < hotmus.length; i++) {
        hotmus[i].is_click = false
        newmus[i].is_click = false
        if (i == hotmus.length - 1) {
          this.setData({
            hotMusic: hotmus,
            newMusic: newmus
          })
        }
      }
    }
  },
  doThisChange() {
    let hotmus = this.data.hotMusic
    let newmus = this.data.newMusic
    if (this.data.is_play == true) {
      if (this.data.is_hot == true) {
        hotmus[this.data.index_music].is_click = true
        this.setData({
          hotMusic: hotmus
        })
      } else {
        newmus[this.data.index_music].is_click = true
        this.setData({
          newMusic: newmus
        })
      }
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗

    // wx.getUserProfile({
    //   desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {
    //     console.log(res)
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息

    // console.log(e)
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
  },

})