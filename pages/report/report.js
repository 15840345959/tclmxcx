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
  },
  chooseImage: function () {

    if(vm.data.files.length >= 3) {

      wx.showModal({
        title: '提示',
        content: '已经上传3张照片了',
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
  }

})