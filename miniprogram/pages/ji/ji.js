// miniprogram/pages/ji/ji.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleDate: '',
    dateList: [],
    weekTitle:['日','一','二','三','四','五','六'],
    year: '',
    month: '',
    day: ''
  },
  goLast() {
    console.log('last')
  },
  goNext() {
    console.log('next')
  },
  getDateTitle() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth()<9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
    const day = new Date().getDate()
    this.setData({
      titleDate: year + '-' + month,
      year,
      month,
      day
    })
    this.boxList()
  },
  boxList() {
    const dayFirst = new Date().getDay()
    let dayLength = 31
    if([4,6,9,11].includes(this.month)) {
      dayLength = 30
    }else if([2].includes(this.month)) {
      if (this.year % 4 === 0 && (this.year % 100 !== 0 || this.year % 400 === 0)) {
        dayLength = 29
      } else {
        dayLength = 28
      }
    }
    let allLength = dayFirst + dayLength
    allLength += (7 - (allLength % 7))
    let dataArray = Array.from(new Array(allLength).keys())
    // 增加日期的前置空格.<1为上月
    let dayList = dataArray.map((item, index) => {
      const day = index - dayFirst + 1
      return day > 0 && day <= dayLength ? day : ''
    })
    this.setData({
      dateList: dayList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDateTitle()
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