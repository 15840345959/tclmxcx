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
    privilege: [
      {
        name: '短信提醒',
        url: 'asdasdas',
        icon: '/images/privilege/message.png'
      },
      {
        name: '优先资源',
        url: 'asdasdas',
        icon: '/images/privilege/diamond.png'
      },
      {
        name: '会员礼物',
        url: 'asdasdas',
        icon: '/images/privilege/gift.png'
      },
      {
        name: '额外积分',
        url: 'asdasdas',
        icon: '/images/privilege/score.png'
      },
      {
        name: '闪电提醒',
        url: 'asdasdas',
        icon: '/images/privilege/lightning.png'
      },
      {
        name: '会员独享',
        url: 'asdasdas',
        icon: '/images/privilege/member.png'
      },
    ]
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