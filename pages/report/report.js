const util = require('../../utils/util.js')

var vm = null
var app = getApp()

Page({
  data: {
    userLocation: {
      lat: "",
      lon: ""
    },
    markers: [
      // {
      //   iconPath: "/resources/others.png",
      //   id: 0,
      //   latitude: 23.099994,
      //   longitude: 113.324520,
      //   width: 50,
      //   height: 50
      // }
    ],
    controls: [
      // {
      //   id: 1,
      //   iconPath: '/images/position.png',
      //   position: {
      //     left: 0,
      //     top: 300 - 50,
      //     width: 50,
      //     height: 50
      //   },
      //   clickable: true
      // }
    ]
  },
  onLoad: function (options) {
    vm = this;
    this.getGlobalLocation()
  },
  getGlobalLocation: function () {
    var userLocation = app.globalData.userLocation

    vm.setData({
      userLocation: userLocation
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
  clickme: function () {
    console.log('1')
  }
})