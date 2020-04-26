export default {
  addMoney(params) {
    return new Promise((resolve, reject)=>{
      if(!params._openid) {
        resolve({
          data: null,
          code: 400,
          msg: '缺少openid'
        })
      }
      const db = wx.cloud.database()
        db.collection('money_book').add({
        data: {
          ...params
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          resolve({
            data: res.data,
            code: 200,
            msg: '查询成功'
          })
        }
      })
    })
  },
  getList(params) {
    return new Promise((resolve, reject)=> {
      if(!params._openid) {
        resolve({
          data: null,
          code: 400,
          msg: '缺少openid'
        })
      }
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('money_book').where({
        ...params
      }).get({
        success: res => {
          resolve({
            data: res.data,
            code: 200,
            msg: '查询成功'
          })
        }
      })
    })
  },
}