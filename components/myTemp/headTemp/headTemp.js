// components/myTemp/headTemp/headTemp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mes: Object,
    num: Object
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
    loginClick(){
      this.triggerEvent("loginClick")
    },
  }
})