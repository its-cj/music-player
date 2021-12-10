// components/mvChooseBlock/mvChooseBlock.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num: Number,
    whoIdx: Number,
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
    boxChooseClick(){
      this.triggerEvent("boxChooseClick",{data:this.data.whoIdx,rid:this.data.mes.rid})
    }
  }
})