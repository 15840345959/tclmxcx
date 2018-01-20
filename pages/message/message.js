// pages/my/my.js

const util = require('../../utils/util.js')

var vm = null
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    message: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this

    console.log('member globalDataUserInfo is : ' + JSON.stringify(app.globalData.userInfo))

    this.getIndexInfo({'city': '沈阳市'})
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
  getIndexInfo: function (param) {
    console.log('getIndexInfo begin')
    util.getIndexInfo(param, function (ret) {
      var data = ret.data.ret
      console.log('getIndexInfo data is : ' + JSON.stringify(data))

      for (var i = 0; i < data.length; i++) {
        data[i].diff_time = util.getDiffentTime(data[i].created_at, Date.parse(new Date()))
      }

      vm.setData({
        message: data
      })

      console.log('getIndexInfo is : ' + JSON.stringify(data))
    }, function (err) {

    })
  }
}) 