//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    openid: '',
    titleDate: '',
    dateList: [],
    weekTitle:['日','一','二','三','四','五','六'],
    year: '',
    month: '',
    day: '',
    even: '',
    number: '',
    moneyList: [],
    active: false,
    nowYear: '',
    nowMonth: '',
    nowDay: '',
    moveX: ''
  },
  goLast() {
    this.getDateTitle('last')
  },
  goNext() {
    console.log(1)
    this.getDateTitle('next')
  },
  dayClick(e) {
    this.setData({
      active: e.currentTarget.dataset.day,
      year: this.data.year,
      month: this.data.month,
      day: e.currentTarget.dataset.day,
    })
    let showDate= `${this.data.year}-${this.data.month}-${this.data.day}`
    this.getList(showDate)
  },
  moveStart(e) {
    this.setData({
      moveX: e.changedTouches[0].pageX
    })
  },
  moveEnd(e) {
    e.changedTouches[0].pageX - this.data.moveX > 100 ? this.goLast() : '';
    e.changedTouches[0].pageX - this.data.moveX < -100 ? this.goNext() : '';
  },
  getDateTitle(type) {
    if(type === 'next') {
      this.getNext()
    }else if(type === 'last') {
      this.getLast()
    }else {
      this.getNow()
    }
    this.boxList()
    if(this.data.year === this.data.nowYear && this.data.month === this.data.nowMonth) {
      this.getList(this.getDate())
    }
  },
  getNow() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth()<9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
    const day = new Date().getDate()
    this.setData({
      titleDate: year + '-' + month,
      year,
      month,
      day,
      nowYear: year,
      nowMonth: month,
      nowDay: day
    })
  },
  getLast() {
    let year = this.data.year
    let month = this.data.month
    if(Number(month) - 1 < 1) {
      month = 12
      year = Number(year) - 1
    }else {
      month = Number(month) - 1
    }
    month = month < 10 ? '0' + month : month
    this.setData({
      titleDate: `${year}-${month}`,
      year,
      month,
      active: false,
      moneyList: []
    })
  },
  getNext() {
    let year = this.data.year
    let month = this.data.month
    if(Number(month) + 1 > 12) {
      month = 1
      year = Number(year) + 1
    }else {
      month = Number(month) + 1
    }
    month = month < 10 ? '0' + month : month
    this.setData({
      titleDate: `${year}-${month}`,
      year,
      month,
      active: false,
      moneyList: []
    })
  },
  boxList() {
    const dayFirst = new Date(`${this.data.year}/${this.data.month}/1`).getDay()
    let dayLength = 31
    if([4,6,9,11].includes(this.data.month)) {
      dayLength = 30
    }else if([2].includes(this.data.month)) {
      if (this.data.year % 4 === 0 && (this.data.year % 100 !== 0 || this.data.year % 400 === 0)) {
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
  //money
  moneyInput(e) {
    this.setData({
      money: e.detail.value
    })
  },
  evenInput(e) {
    this.setData({
      even: e.detail.value
    })
  },
  getList(date) {
    if(!this.data.openid) {
      return false
    }
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('money_book').where({
      _openid: this.data.openid,
      date: date
    }).get({
      success: res => {
        this.setData({
          moneyList: res.data
        })
      }
    })
  },
  addMoney() {
    console.log(this.data.openid)
    if(!this.data.openid) {
      wx.showToast({
        title: '无登录无法添加',
        icon: 'none'
      })
      return false
    }
    const date = `${this.data.year}-${this.data.month}-${this.data.day}`
    if(!this.data.even.replace(/(^\s*)|(\s*$)/g, "") || !this.data.money.replace(/(^\s*)|(\s*$)/g, "")) {
      wx.showToast({
        icon: 'none',
        title: '不能为空'
      })
      return false
    }
    const db = wx.cloud.database()
    db.collection('money_book').add({
      data: {
        money: Number(this.data.money),
        even: this.data.even,
        date
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '记账成功',
        })
        this.getList(this.getDate())
      }
    })
  },
  getDate() {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    month = month > 9 ? month : '0' + month
    day = day > 9 ? day : '0' + day
    return `${year}-${month}-${day}`
  },
  onLoad() {
    this.getDateTitle()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                openid: res.userInfo.openid,
              })
              this.getList(this.getDate())
            }
          })
        }
      }
    })
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  }
})
