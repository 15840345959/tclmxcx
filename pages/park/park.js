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
    timeLimitChineseArray: ['30分钟', '1小时', '2小时', '3小时'],
    timeLimitArray: [0.5, 1, 2, 3],
    index: 0,
    userLocation: {
      lat: "",
      lon: ""
    },
    markers: [

    ],
    addressComponent: {},
    is_verify: false
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

    console.log('bindPickerChange value is : ' + e.detail.value)

    this.setData({
      index: e.detail.value
    })
  },
  getGlobalLocation: function () {
    // var userLocation = app.globalData.userLocation
    // var addressComponent = app.globalData.addressComponent
    // vm.setData({
    //   userLocation: userLocation,
    //   addressComponent: addressComponent,
    //   markers: [{
    //     iconPath: "/images/position.png",
    //     id: 0,
    //     latitude: app.globalData.userLocation.lat,
    //     longitude: app.globalData.userLocation.lon,
    //     width: 30,
    //     height: 30
    //   }]
    // })

    var userLocation = app.globalData.userLocation
    var converLocation = util.gcj02towgs84(userLocation.lon, userLocation.lat)

    console.log('userLocation is : ' + JSON.stringify(userLocation))
    console.log('converLocation is : ' + JSON.stringify(converLocation))

    var addressComponent = app.globalData.addressComponent
    vm.setData({
      userLocation: converLocation,
      addressComponent: addressComponent,
    })

    vm.setData({
      markers: [{
        iconPath: "/images/position.png",
        id: 0,
        latitude: converLocation.lat,
        longitude: converLocation.lon,
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
    vm.certificationByUserId()
  },
  certificationByUserId: function () {
    util.certificationByUserId({}, function (ret) {
      if (ret.data.result) {
        var is_verify = ret.data.ret.status

        console.log('is_verify is : ' + JSON.stringify(is_verify))

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

            wx.showModal({
              title: '提示信息',
              content: '已为您上传停车位置信息，有贴条情况会通过《停车联盟》公众号提醒您',
              confirmText: '确认',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  util.navigateBack()
                } else if (res.cancel) {

                }
              }
            })
          }, function (err) {
            console.log('clickPark err is : ' + JSON.stringify(err))

            
          })
        
      } else {
        wx.showModal({
          title: '提示信息',
          content: '您还为进行车主认证，进行认证之后可以使用此功能',
          confirmText: '立即认证',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/verify/verify',
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    }, function (err) {

    })
  }
}) 