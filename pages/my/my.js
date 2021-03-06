// pages/my/my.js

const util = require('../../utils/util.js')

var vm = null
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    nick_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;

    vm.setData({
      avatar: app.globalData.userInfo.avatar,
      nick_name: app.globalData.userInfo.nick_name
    })


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
  clickOpenMember: function () {
    wx.navigateTo({
      url: '/pages/member/member',
    })
  }
})