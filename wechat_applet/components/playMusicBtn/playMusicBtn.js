// components/playMusicBtn/playMusicBtn.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mes: Object,
    mesPlay: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    playMusicClick: function () {
      this.triggerEvent("playMusicClick", {
        mesPlay: this.data.mesPlay
      })
    },
    routerGoClick() {
      this.triggerEvent("routerGoClick", {
        mesPlay: this.data.mes
      })
    },
    pauseMusicClick() {
      this.triggerEvent("pauseMusicClick", {
        mesPlay: this.data.mesPlay
      })
    },
    preMusicClick() {
      this.triggerEvent("preMusicClick", {
        mesPlay: this.data.mesPlay,
        data: this.data.mes
      })
    },
    nextMusicClick() {
      this.triggerEvent("nextMusicClick", {
        mesPlay: this.data.mesPlay,
        data: this.data.mes
      })
    }
  }

})