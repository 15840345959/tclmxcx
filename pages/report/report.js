const util = require('../../utils/util.js')
const qiniuUploader = require('../../utils/qiniuUploader.js')

var vm = null
var app = getApp()

Page({
  data: {
    userLocation: {
      lat: "",
      lon: ""
    },
    files: [],
    intro: {
      length: 0,
      content: ''
    },
    addressComponent: {},
    markers: [

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
    ],
    markShow: false
  },
  onLoad: function (options) {
    vm = this;
    this.getGlobalLocation()
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
  clickme: function () {
    console.log('1')
  },
  chooseImage: function () {

    if (vm.data.files.length >= 1) {

      wx.showModal({
        title: '提示信息',
        content: '已经上传1张照片了，最多上传一张',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })

      return
    }

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(JSON.stringify(tempFilePaths))

        util.getQiniuToken({}, function (ret) {

          console.log('getQiniuToken ret is : ' + JSON.stringify(ret))

          vm.initQiniu(ret.data.ret)

          for (var i = 0; i < tempFilePaths.length; i++) {
            var filePaths = tempFilePaths[i]

            qiniuUploader.upload(filePaths, (res) => {
              console.log("qiniuUploader res is : " + JSON.stringify(res))

              var realUrl = util.getImgRealUrl(res.key)

              console.log('realUrl is : ' + realUrl)

              vm.setData({
                files: vm.data.files.concat(realUrl)
              })

            }, (error) => {
              console.error('qiniuUploader error is : ' + JSON.stringify(error))


            })
          }
        }, function (err) {

        })
      }
    })
  },
  initQiniu: function (qnToken) {
    var options = {
      region: 'ECN', // 华东区
      uptoken: qnToken
    };
    console.log("initQiniu options:" + JSON.stringify(options))
    qiniuUploader.init(options);
  },
  clickDelete: function (e) {
    var files = vm.data.files
    var index = e.currentTarget.dataset.index
    files.splice(index, 1)
    vm.setData({
      files: files
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  clickReport: function () {

    console.log('clickReport')

    var param = {}

    param.lat = vm.data.userLocation.lat
    param.lon = vm.data.userLocation.lon

    if (vm.data.files[0]) {
      param.img = vm.data.files[0]
    } else {
      wx.showModal({
        title: '提示信息',
        content: '请添加一张现场照片',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    }

    param.province = vm.data.addressComponent.province
    param.city = vm.data.addressComponent.city
    param.district = vm.data.addressComponent.district
    param.street = vm.data.addressComponent.street
    param.position = vm.data.addressComponent.province + vm.data.addressComponent.city + vm.data.addressComponent.district + vm.data.addressComponent.street

    if (vm.data.intro.length !== 0) {
      param.desc = vm.data.intro.content
    }

    console.log('clickReport param is : ' + JSON.stringify(param))

    this.uploadInfo(param)
  },
  uploadInfo: function (param) {
    util.uploadInfo(param, function (ret) {
      console.log('uploadInfo ret is : ' + JSON.stringify(ret))

      event.sendEvent('refreshIndexInfo', '')

      vm.setData({
        markShow: true
      })



    }, function (err) {
      console.log('uploadInfo err is : ' + JSON.stringify(err))
    })
  },
  textAreaEventListener: function (e) {
    console.log('textAreaEventListener : ' + JSON.stringify(e))

    if (e.detail.cursor >= 100) {
      wx.showModal({
        title: '提示信息',
        content: '描述信息最多输入100个字符，请删减',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    }

    vm.setData({
      'intro.length': e.detail.cursor,
      'intro.content': e.detail.value
    })
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
  closeMark: function () {
    vm.setData({
      markShow: false
    })

    wx.navigateBack({})
  }

})