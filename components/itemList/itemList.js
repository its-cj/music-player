// components/itemList/itemList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
num: Number,
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
    bindClick(){
      this.triggerEvent("nbClick",{musicMes: this.data.mes})
    }
  }
})
