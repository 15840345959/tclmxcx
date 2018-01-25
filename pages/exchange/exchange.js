// pages/exchange/exchange.js

const util = require('../../utils/util.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
  
  },
  clickExchange: function () {
    console.log('clickExchange')

    util.requestExchange({}, function (ret) {
      if (ret.data.result) {
        wx.showModal({
          title: '提示信息',
          content: '申请成功，请等待客服人员与您联系',
          confirmText: '确定',
          confirmColor: '#606898',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              util.navigateBack(1)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }, function (err) {
      wx.showModal({
        title: '提示信息',
        content: '申请失败，请稍后重试',
        confirmText: '确定',
        confirmColor: '#606898',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            util.navigateBack(1)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  }
})