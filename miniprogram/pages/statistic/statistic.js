// miniprogram/pages/statistic/statistic.js
import db from '../index/db.js';
import uCharts from '../../components/u-charts/uCharts.js';
var canvasColumn = null;
var canvasPie = null;
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
    db.getList(params).then(res=>{
      this.getColumnData(res.data)
      this.getPieData(res.data)
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
      Column.categories = dateList;
      Column.series = [{
        name: '这些天消费',
        data: moneyList
      }];
      Column.type = 'column'
      Column.extra = {
        column: {
          width: 10
        }
      }
      this.showColumn('chartColumn2', Column);
      this.selectComponent('#chartColumn').showColumn(Column);
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
    this.showPie("chartPie2", Pie);
    this.selectComponent('#chartPie').showColumn(Pie);
  },
  showColumn(id,chartData) {
    canvasColumn = new uCharts({
      $this: this,
      canvasId: id,
      type: chartData.type,
      categories: chartData.categories,
      series: chartData.series,
      width: this.data.cWidth ,
      height: this.data.cHeight ,
      fontSize: 13,
      background: '#FFFFFF',
      pixelRatio: 1,
      animation: true,
      xAxis: {
        disableGrid: true,
      },
      yAxis: {
        //disabled:true
      },
      dataLabel: true,
      extra: chartData.extra
    });
  },
  showPie(id,chartData) {
    canvasPie = new uCharts({
      $this: this,
      canvasId: id,
      type: chartData.type,
      categories: chartData.categories,
      series: chartData.series,
      width: this.data.cWidth ,
      height: this.data.cHeight ,
      fontSize: 13,
      background: '#FFFFFF',
      pixelRatio: 1,
      animation: true,
      xAxis: {
        disableGrid: true,
      },
      yAxis: {
        //disabled:true
      },
      dataLabel: true,
      extra: chartData.extra
    });
  },
  touchColumn(e) {
    canvasColumn.showToolTip(e, {
      format: function (item, category) {
        if (typeof item.data === 'object') {
          return category + ' ' + item.name + ':' + item.data.value
        } else {
          return category + ' ' + item.name + ':' + item.data
        }
      }
    });
  },
  touchPie(e) {
    canvasPie.showToolTip(e, {
      format: function (item) {
        if (typeof item.data === 'object') {
          return item.name + ':' + item.data.value
        } else {
          return item.name + ':' + item.data
        }
      }
    });
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