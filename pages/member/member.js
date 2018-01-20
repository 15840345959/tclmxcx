// pages/my/my.js

const util = require('../../utils/util.js')

var vm = null
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;

    console.log('member globalDataUserInfo is : ' + JSON.stringify(app.globalData.userInfo))

    this.getByIdWithToken()
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
  clickOpenRecharge: function () {
	  wx.navigateTo({
		  url: '/pages/recharge/recharge',
	  })
  },
  getByIdWithToken: function () {
    util.getByIdWithToken({ id: app.globalData.userInfo.id }, function (ret) {
      console.log('getByIdWithToken ret is : ' + JSON.stringify(ret))

      wx.setStorage({
        key: "userInfo",
        data: ret.data.ret
      })

      app.globalData.userInfo = ret.data.ret

      vm.setData({
        userInfo: app.globalData.userInfo
      })

    }, function (err) {
      console.log('getByIdWithToken err is : ' + JSON.stringify(err))
    })
  },
}) 