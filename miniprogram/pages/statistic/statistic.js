// miniprogram/pages/statistic/statistic.js
const app = getApp()
Page({
  data: {
    columnData: {},
    id: 'cloumn'
  },
  
  getServerData() {
    wx.request({
      url: 'https://www.ucharts.cn/data.json',
      data: {
      },
      success: (res)=> {
        let Column = { categories: [], series: [] };
        let Pie = { series: [] };
        Column.categories = res.data.data.ColumnB.categories;
        Column.series = res.data.data.ColumnB.series;
        Column.type = 'column'
        Column.extra = {
          column: {
            width: 10
          }
        }
        this.selectComponent('#chartColumn').showColumn(Column);
        Pie.series = res.data.data.Pie.series;
        Pie.type = 'pie';
        Pie.extra= {
          pie: {
            labelWidth:15
          }
        }
        // this.selectComponent('#chartType').showColumn("chartType", Pie);
      },
      fail: () => {
        console.log("请点击右上角【详情】，启用不校验合法域名");
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getServerData()
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