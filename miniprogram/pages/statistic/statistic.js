// miniprogram/pages/statistic/statistic.js
Page({
  data: {
    cWidth: wx.getSystemInfoSync().windowWidth,
    cHeight: 500 / 750 * wx.getSystemInfoSync().windowWidth,
  },
  getServerData() {
    const openid = wx.getStorageSync('openid')
    const getDate = this.getDate()
    const params = {
      _openid: openid,
      gte:`${getDate.year}-${getDate.month}-01`,
      lte: `${getDate.year}-${getDate.month}-${getDate.day}`,
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
    const arrayObj=Array.from(showData)
    const list = arrayObj.sort(function(a,b){return a[0].localeCompare(b[0])})
    const moneyList = []
    const dateList = []
    list.forEach(item => {
      dateList.push(item[0])
      moneyList.push(item[1])
    })
    const Column = { categories: [], series: [] };
      Column.categories = [...dateList];
      Column.series = [{
        name: '当月消费',
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
    const showData = new Map()
    for (let i of data) {
      i.typeName = i.typeName ? i.typeName : '其他'
      if(showData.has(i.typeName)) {
        showData.set(i.typeName, showData.get(i.typeName) + i.money)
      }else{
        showData.set(i.typeName, i.money)
      }
    }
    const list = []
    for (let [key, value] of showData ) {
      list.push({
        name: key,
        data: value
      })
    }
    const Pie = { series: [] };
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

  getDate() {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    month = month > 9 ? month : '0' + month
    day = day > 9 ? day : '0' + day
    return {
      year,
      month,
      day
    }
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