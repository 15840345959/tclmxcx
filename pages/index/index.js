const util = require('../../utils/util.js')

var vm = null
var app = getApp()

Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

  },
  onLoad: function (options) {
    
    vm = this;
    this.getIndexADs()

    var globalData = app.globalData
    console.log('globalData is : ' + JSON.stringify(globalData))

    this.getAddress(globalData.userLocation)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  getIndexADs: function () {
    util.getIndexADs({}, function (ret) {
      var data = ret.data.ret
      var imgUrls = []
      for (var i in data) {
        imgUrls.push(data[i].img)
      }
      vm.setData({
        imgUrls: imgUrls
      })
    }, function (err) {

    })
  },
  getIndexInfo: function () {
    util.getIndexADs({}, function (ret) {
      var data = ret.data.ret
    }, function (err) {

    })
  },
  getAddress: function (location) {

    util.getAddress(location, function (ret) {

    }, function (err) {

    })
  },
  clickOpenReport: function () {
    wx.navigateTo({
      url: '/pages/report/report',
    })
  }
})