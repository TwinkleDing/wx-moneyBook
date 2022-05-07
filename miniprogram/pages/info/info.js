// pages/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: [],
    list: []
  },
  getList() {
    const openid = wx.getStorageSync('openid')
    const params = {
      _openid: openid,
      gte: `2022-01-01`,
      lte: `2202-12-31`,
    }
    wx.cloud.callFunction({
      name: 'getList',
      data: {
        ...params
      }
    }).then(res => {
      this.list = []
      const data = res.result.data;
      let list = data.sort(function (a, b) {
        return b.date.localeCompare(a.date)
      })
      let ch = [...list]
      let yearMoney = new Map()
      let monthMoney = new Map()
      let dayMoney = new Map()
      list.forEach(item => {
        if (yearMoney.has(item.date.substring(0, 4))) {
          yearMoney.set(item.date.substring(0, 4), yearMoney.get(item.date.substring(0, 4)) + item.money)
        } else {
          yearMoney.set(item.date.substring(0, 4), item.money)
        }
        if (monthMoney.has(item.date.substring(0, 7))) {
          monthMoney.set(item.date.substring(0, 7), monthMoney.get(item.date.substring(0, 7)) + item.money)
        } else {
          monthMoney.set(item.date.substring(0, 7), item.money)
        }
        if (dayMoney.has(item.date)) {
          dayMoney.set(item.date, dayMoney.get(item.date) + item.money)
        } else {
          dayMoney.set(item.date, item.money)
        }
      })
      let moneyList = []
      const d = this.getDate()
      for (let [ky, vy] of yearMoney) {
        if (ky === `${d.year}`) {
          this.setData({
            activeName: [ky],
          });
        }
        moneyList.push({
          year: ky,
          money: vy,
          children: []
        })
        for (let [km, vm] of monthMoney) {
          if (km.includes(ky)) {
            if (km === `${d.year}-${d.month}`) {
              this.setData({
                activeName: [...this.data.activeName, km],
              });
            }
            moneyList[moneyList.length - 1].children.push({
              month: km,
              money: vm,
              children: []
            })
            for (let [kd, vd] of dayMoney) {
              let children = []
              for (let i = 0; i < ch.length; i++) {
                if (ch[i].date === kd) {
                  children.push(ch[i])
                  ch.splice(i, 1)
                  i--
                }
              }
              if (kd.includes(km)) {
                if (kd === `${d.year}-${d.month}-${d.day}`) {
                  this.setData({
                    activeName: [...this.data.activeName, kd],
                  });
                }
                moneyList[moneyList.length - 1].children[moneyList[moneyList.length - 1].children.length - 1].children
                  .push({
                    day: kd,
                    money: vd,
                    children
                  })
                dayMoney.delete(kd)
              }
            }
            monthMoney.delete(km)
          }
        }
        yearMoney.delete(ky)
      }
      this.setData({
        list: moneyList
      })
    })
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
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})