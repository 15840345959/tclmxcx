// pages/recharge/recharge.js

const util = require('../../utils/util.js')
const event = require('../../utils/event.js')

var vm = null
var app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    userInfo: {},
    timeLimit: 1,
    timeLimitArray: [1, 2, 3, 4, 5],
    index: 0,
    userLocation: {
      lat: "",
      lon: ""
    },
    markers: [

    ],
    addressComponent: {},
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    vm = this;

    vm.setData({
      userInfo: app.globalData.userInfo
    })

    this.getGlobalLocation()

    
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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  getGlobalLocation: function () {
    var userLocation = app.globalData.userLocation
    var addressComponent = app.globalData.addressComponent
    vm.setData({
      userLocation: userLocation,
      addressComponent: addressComponent,
      markers: [{
        iconPath: "/images/position.png",
        id: 0,
        latitude: app.globalData.userLocation.lat,
        longitude: app.globalData.userLocation.lon,
        width: 30,
        height: 30
      }]
    })

    console.log('data is : ' + JSON.stringify(vm.data))
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  clickGetLocation: function () {
    console.log('clickGetLocation')

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log('getLocation res is : ' + JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var userLocation = {}
        userLocation.lat = latitude
        userLocation.lon = longitude


        app.globalData.userLocation = userLocation

        vm.getGlobalLocation()
      }
    })
  },
  clickPark: function () {

    console.log('addressComponent is : ' + JSON.stringify(vm.data.addressComponent))
    console.log('userLocation is : ' + JSON.stringify(vm.data.userLocation))
    console.log('index is : ' + JSON.stringify(vm.data.index))

    var param = {}
    param.lon = vm.data.userLocation.lon
    param.lat = vm.data.userLocation.lat
    param.plan_due = vm.data.timeLimitArray[vm.data.index]
    param.province = vm.data.addressComponent.province
    param.city = vm.data.addressComponent.city
    param.district = vm.data.addressComponent.district
    param.street = vm.data.addressComponent.street
    param.position = vm.data.addressComponent.province + vm.data.addressComponent.city + vm.data.addressComponent.district + vm.data.addressComponent.street

    console.log('parkingCar param is : ' + JSON.stringify(param))

    util.parkingCar(param, function (ret) {
      console.log('clickPark ret is : ' + JSON.stringify(ret))
    }, function (err) {
      console.log('clickPark err is : ' + JSON.stringify(err))
    })
  }
}) 