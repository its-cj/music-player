// components/titleName/titleName.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mes : {
      type : Object,
      value : ''
    }
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
    moreClick: function(){
      this.triggerEvent("moreClick",{data: this.properties})
    }
  }
})
