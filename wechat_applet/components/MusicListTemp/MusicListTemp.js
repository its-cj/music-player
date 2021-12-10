// components/MusicListTemp/MusicListTemp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mes: Object
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
    musicPlayClick:function(e){
      this.triggerEvent("musicPlayClickFather",{data: e.detail.data})
    },
    palyAllMusic(){
      this.triggerEvent("palyAllMusic")
    }
  }
})
