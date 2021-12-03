// components/itemMesTemp/itemMesTemp.js
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
    collectionClick(){
      this.triggerEvent("collectionClick",{data: this.data.mes})
    }
  }
})
