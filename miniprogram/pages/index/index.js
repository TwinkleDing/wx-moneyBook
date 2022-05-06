//index.js
import db from './db.js';
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    openid: '',
    titleDate: '',
    dateList: [],
    weekTitle:['日','一','二','三','四','五','六'],
    year: '',
    month: '',
    day: '',
    showInput: false,
    even: '',
    money: '',
    moneyList: [],
    active: false,
    nowYear: '',
    nowMonth: '',
    nowDay: '',
    moveX: '',
    extraClasses: '',
    totalMoney: '',
    time: false,
    moneyTypeList: [
      {
        title: '衣',
        value: 1
      },
      {
        title: '食',
        value: 2
      },
      {
        title: '住',
        value: 3
      },
      {
        title: '行',
        value: 4
      },
      {
        title: '用',
        value: 5
      },
      {
        title: '玩',
        value: 6
      },
      {
        title: '其他',
        value: 7
      }
    ],
    clickMoneyType: false,
    clickMoneyTypeName: ''
  },
  showInputS() {
    this.setData({
      extraClasses: 'box-transition ani-box-show',
      showInput: true
    })
  },
  closeInputS() {
    this.setData({
      extraClasses: 'box-transition',
      showInput: false,
      money: '',
      even: ''
    })
  },
  goLast() {
    this.getDateTitle('last')
  },
  goNext() {
    this.getDateTitle('next')
  },
  dayClick(e) {
    let day = e.currentTarget.dataset.day
    day = day < 9 ? '0' + day : day
    this.setData({
      active: e.currentTarget.dataset.day,
      year: this.data.year,
      month: this.data.month,
      day: day,
    })
    let showDate= `${this.data.year}-${this.data.month}-${this.data.day}`
    this.getList(showDate)
  },
  tagClick(e) {
    let type = e.currentTarget.dataset.type
    let typeName = e.currentTarget.dataset.typeName
    type === this.data.clickMoneyType ? type = false : ''
    this.setData({
      clickMoneyType: type,
      clickMoneyTypeName: typeName,
    })
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
    // if(this.data.year === this.data.nowYear && this.data.month === this.data.nowMonth) {
    //   this.getList(this.getDate())
    // }
  },
  getNow() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
    const day = new Date().getDate() < 9 ? '0' + new Date().getDate() : new Date().getDate()
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
      totalMoney: 0,
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
      totalMoney: 0,
      moneyList: []
    })
  },
  boxList() {
    const dayFirst = new Date(`${this.data.year}/${this.data.month}/1`).getDay()
    let dayLength = 31
    if([4,6,9,11].includes(Number(this.data.month))) {
      dayLength = 30
    }else if([2].includes(Number(this.data.month))) {
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
    const params = {
      _openid: this.data.openid,
      date: date
    }
    db.getList(params).then(res=>{
      let moneyList = res.data.map(item=>{
        return {
          even: item.even,
          money: Number(item.money).toFixed(2),
          type: item.type,
          typeName: item.typeName
        }
      })
      let totalMoney = moneyList.reduce((last, item)=>{
        return last + Number(item.money)
      },0)
      this.setData({
        moneyList,
        totalMoney: totalMoney.toFixed(2)
      })
    })
  },
  addMoney() {
    if(this.data.time) {
      return false
    }
    this.setData({
      time: true
    })
    if(!this.data.even.replace(/(^\s*)|(\s*$)/g, "") || !this.data.money.replace(/(^\s*)|(\s*$)/g, "")) {
      wx.showToast({
        icon: 'none',
        title: '不能为空'
      })
      return false
    }
    if(!this.data.clickMoneyType) {
      wx.showToast({
        icon: 'none',
        title: '请选择类型'
      })
      return false
    }
    const date = `${this.data.year}-${this.data.month}-${this.data.day}`
    const params = {
      date,
      money: Number(this.data.money),
      even: this.data.even,
    }
    if( this.data.clickMoneyType ) {
      params.type = this.data.clickMoneyType
      params.typeName = this.data.clickMoneyTypeName
    }
    db.addMoney(params).then(res=>{
      setTimeout(() => {
        this.setData({
          time: false
        })
      }, 1000);
      if(res.code === 200) {
        wx.showToast({
          title: res.msg,
        })
        this.closeInputS()
        this.getList(this.getDate())
      }else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
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
    const openid =wx.getStorageSync('openid')
    if(openid) {
      app.globalData.openid = openid
      this.setData({
        openid
      })
      this.getList(this.getDate())
    }else {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          wx.setStorage({
            key: 'openid',
            data: res.result.userInfo.openId
          })
          app.globalData.openid = res.result.userInfo.openId
          this.setData({
            openid: app.globalData.openid
          })
          this.getList(this.getDate())
        }
      })
    }
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  }
})
