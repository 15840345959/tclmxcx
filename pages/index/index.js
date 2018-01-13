const util = require('../../utils/util.js')

var vm = null
var app = getApp()

Page({
  data: {
    imgUrls: [],
    address: "正在定位",
    city: '',
    district: '',
    street: '',
    indexInfo: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  onLoad: function (options) {
    
    vm = this;
    this.getIndexADs()

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log('getLocation res is : ' + JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var userLocation = {};
        userLocation.lat = latitude;
        userLocation.lon = longitude;
        app.globalData.userLocation = userLocation

        var globalData = app.globalData
        console.log('globalData is : ' + JSON.stringify(globalData))

        vm.getAddress(globalData.userLocation)
        
      }
    })
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    console.log("11")
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
  getIndexInfo: function (param) {
    util.getIndexInfo(param, function (ret) {
      var data = ret.data.ret
	    console.log('getIndexInfo data is : ' + JSON.stringify(data))

      vm.setData({
        indexInfo: data
      })
      

    }, function (err) {

    })
  },
  getAddress: function (location) {
    util.getAddress(location, function (ret) {
      var addressComponent = ret.data.ret.result.addressComponent
      vm.setData({
        address: addressComponent.city + addressComponent.district,
        city: addressComponent.city,
        district: addressComponent.district,
        street: addressComponent.street
      })
      console.log('data is : ' + JSON.stringify(vm.data))
      vm.getIndexInfo({ district: vm.data.district, street: vm.data.street })
    }, function (err) {

    })
  },
  clickOpenReport: function () {
    wx.navigateTo({
      url: '/pages/report/report',
    })
  }
})