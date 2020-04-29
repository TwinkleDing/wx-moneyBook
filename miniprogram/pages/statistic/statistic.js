// miniprogram/pages/statistic/statistic.js
Page({
  data: {
    cWidth: wx.getSystemInfoSync().windowWidth,
    cHeight: 500 / 750 * wx.getSystemInfoSync().windowWidth,
  },
  getServerData() {
    const openid =wx.getStorageSync('openid')
    const params = {
      _openid: openid
    }
    wx.cloud.callFunction({
      name: 'getList',
      data: {...params}
    }).then(res=> {
      this.getColumnData(res.result.data)
      this.getPieData(res.result.data)
    })
  },
  getColumnData(data) {
    let showData = new Map()
    for (let i of data) {
      if(showData.has(i.date)) {
        showData.set(i.date, showData.get(i.date) + i.money)
      }else{
        showData.set(i.date, i.money)
      }
    }
    let moneyList = []
    let dateList = []
    for (let [key, value] of showData ) {
      dateList.push(key.slice(5))
      moneyList.push(value)
    }
    let Column = { categories: [], series: [] };
      Column.categories = [...dateList];
      Column.series = [{
        name: '这些天消费',
        data: moneyList
      }];
      Column.type = 'column'
      Column.extra = {
        column: {
          width: 20
        }
      }
      if(Column.categories.length) {
        this.selectComponent('#chartColumn').showColumn(Column);
      }
  },
  getPieData(data) {
    let showData = new Map()
    for (let i of data) {
      i.typeName = i.typeName ? i.typeName : '其他'
      if(showData.has(i.typeName)) {
        showData.set(i.typeName, showData.get(i.typeName) + i.money)
      }else{
        showData.set(i.typeName, i.money)
      }
    }
    let list = []
    for (let [key, value] of showData ) {
      list.push({
        name: key,
        data: value
      })
    }
    let Pie = { series: [] };
    Pie.series = list;
    Pie.type = 'pie';
    Pie.extra= {
      pie: {
        labelWidth:15
      }
    }
    Pie.type='pie'
    this.selectComponent('#chartPie').showColumn(Pie);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getServerData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})