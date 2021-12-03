// components/indexPage/musicTemp/musicTemp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mes: Object,
    whoChange: Number
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
    musicPlayTap: function(){
      // let change = false
      // if (this.data.is_click == true) {
      //   change = false
      // }else{
      //   change = true
      // }
      // this.setData({
      //   is_click : change
      // })
      this.triggerEvent("playMusic",{mes:this.data.mes,whoChange:this.data.whoChange})
    },
  }
  
})
