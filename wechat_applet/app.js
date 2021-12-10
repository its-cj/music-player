// app.js

App({
  onLaunch() {
    
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init({
      traceUser : true
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    wx.setInnerAudioOption({
      obeyMuteSwitch: false
    });
  },
  globalData: {
    userInfo: null,
    path: 'http://192.168.0.132:3000',
    innerAudioContext: wx.createInnerAudioContext(),
    arrMusicList: [],
    is_play: false,
    is_show: false,
    isPlayMes: {},
    lyricMusicPlay: false
  }
})
