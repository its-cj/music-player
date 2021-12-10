// components/musicItemTemp/musicItemTemp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicMes: Object,
    num: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    musicPlayClick: function(){
      this.triggerEvent("musicPlayClick",{data: this.data})
    }
  }
})
