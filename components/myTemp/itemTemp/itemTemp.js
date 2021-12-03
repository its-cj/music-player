// components/myTemp/itemTemp/itemTemp.js
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
    isNbClick(e){
      this.triggerEvent("isLastClick",{musicData:e.detail.data,mes:this.data.mes})
    },
    addSongList(){
      this.triggerEvent("addSongList")
    }
  }
})
