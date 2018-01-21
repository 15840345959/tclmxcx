// pages/result/result.js

const util = require('../../utils/util.js')
const event = require('../../utils/event.js')
const qiniuUploader = require('../../utils/qiniuUploader.js')

var vm = null
var app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    userInfo: {},
    owner_name: '',
    car_license: '',
    carBrandArray: [
      '请选择',
      '奔驰',
      '宝马',
      '奥迪'
    ],
    carBrandIndex: 0,
    xsz_image: ['', ''],
    car_image: [''],
    is_verify: false
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {

    console.log('onLoad options is : ' + JSON.stringify(options))

    vm = this;

    vm.setData({
      userInfo: app.globalData.userInfo,
    })

    util.certificationByUserId({}, function (ret) {
      if (ret.data.result) {

        var index = 0

        for (var i = 0; i < vm.data.carBrandArray.length; i++) {
          console.log(vm.data.carBrandArray[i])
          console.log(ret.data.ret.car_brand)
          if (vm.data.carBrandArray[i] === ret.data.ret.car_brand) {
            console.log('bingo is : ' + '[' + i + ']')
            index = i
          }
        }

        console.log('index is : ' + index)

        vm.setData({
          is_verify: true,
          owner_name: ret.data.ret.owner_name,
          car_license: ret.data.ret.car_license,
          carBrandIndex: index,
          xsz_image: ret.data.ret.xsz_img,
          car_image: ret.data.ret.cl_img
        })

        console.log('verify data is : ' + JSON.stringify(vm.data))
      }
      

    }, function (err) {

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
  bindCarBrandChange: function (e) {

    console.log('bindCarBrandChange value is : ' + e.detail.value)

    this.setData({
      carBrandIndex: e.detail.value
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
  clickUpLoadFront: function () {

    if (vm.data.is_verify) {
      return
    }

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log('tempFilePaths is ' + JSON.stringify(tempFilePaths))

        util.getQiniuToken({}, function (ret) {
          console.log('getQiniuToken ret is : ' + JSON.stringify(ret))
          vm.initQiniu(ret.data.ret)
          var filePaths = tempFilePaths[0]
          qiniuUploader.upload(filePaths, (res) => {
            console.log("qiniuUploader res is : " + JSON.stringify(res))
            var realUrl = util.getImgRealUrl(res.key)
            console.log('realUrl is : ' + realUrl)
            vm.setData({
              'xsz_image[0]': realUrl
            })
          }, (error) => {
            console.error('qiniuUploader error is : ' + JSON.stringify(error))
          })
        }, function (err) {

        })
      }
    })
  },
  clickUpLoadBack: function () {

    if (vm.data.is_verify) {
      return
    }

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log('tempFilePaths is ' + JSON.stringify(tempFilePaths))

        util.getQiniuToken({}, function (ret) {
          console.log('getQiniuToken ret is : ' + JSON.stringify(ret))
          vm.initQiniu(ret.data.ret)
          var filePaths = tempFilePaths[0]
          qiniuUploader.upload(filePaths, (res) => {
            console.log("qiniuUploader res is : " + JSON.stringify(res))
            var realUrl = util.getImgRealUrl(res.key)
            console.log('realUrl is : ' + realUrl)
            vm.setData({
              'xsz_image[1]': realUrl
            })
          }, (error) => {
            console.error('qiniuUploader error is : ' + JSON.stringify(error))
          })
        }, function (err) {

        })
      }
    })
  },
  clickUpLoadCar: function () {

    if (vm.data.is_verify) {
      return
    }

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log('tempFilePaths is ' + JSON.stringify(tempFilePaths))

        util.getQiniuToken({}, function (ret) {
          console.log('getQiniuToken ret is : ' + JSON.stringify(ret))
          vm.initQiniu(ret.data.ret)
          var filePaths = tempFilePaths[0]
          qiniuUploader.upload(filePaths, (res) => {
            console.log("qiniuUploader res is : " + JSON.stringify(res))
            var realUrl = util.getImgRealUrl(res.key)
            console.log('realUrl is : ' + realUrl)
            vm.setData({
              'car_image[0]': realUrl
            })
          }, (error) => {
            console.error('qiniuUploader error is : ' + JSON.stringify(error))
          })
        }, function (err) {

        })
      }
    })
  },
  ownerNameListener: function (e) {
    console.log('ownerNameListener : ' + JSON.stringify(e))

    vm.setData({
      'owner_name': e.detail.value
    })
  },
  carLicenseListener: function (e) {
    console.log('carLicenseListener : ' + JSON.stringify(e))

    

    vm.setData({
      'car_license': e.detail.value
    })
  },
  clickSubmit: function () {

    
    
    var param = {}

    param.owner_name = vm.data.owner_name
    param.car_license = vm.data.car_license
    param.car_brand = vm.data.carBrandArray[vm.data.carBrandIndex]
    param.xsz_img = vm.data.xsz_image
    param.cl_img = vm.data.car_image

    if (vm.data.owner_name === "") {
      wx.showModal({
        title: '提示信息',
        content: '请输入车主姓名',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            
          } else if (res.cancel) {

          }
        }
      })
      return
    }

    if (vm.data.car_license.length === 7) {
      var regex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/

      if (!regex.test(param.car_license)) {
        wx.showModal({
          title: '提示信息',
          content: '请输入正确的车牌号码',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {

            } else if (res.cancel) {

            }
          }
        })
        return
      }
    } else {
      wx.showModal({
        title: '提示信息',
        content: '请输入正确的车牌号码',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    }

    if (vm.data.carBrandIndex === 0) {
      wx.showModal({
        title: '提示信息',
        content: '请选择车辆品牌',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    }

    if (vm.data.xsz_image[0] === '' || vm.data.xsz_image[1] === '') {
      wx.showModal({
        title: '提示信息',
        content: '请上传行驶证照片',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    }

    if (vm.data.car_image[0] === '') {
      wx.showModal({
        title: '提示信息',
        content: '请上传车辆照片',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    }

    util.certification(param, function (ret) {
      console.log('certification ret is : ' + JSON.stringify(ret))

      if (ret.data.result) {
        util.showToast('上传成功')

        util.navigateBack()
      } else {
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 1500,
        })
      }

    }, function (err) {
      console.log('certification err is : ' + JSON.stringify(err))

      wx.showToast({
        title: '上传失败',
        icon: 'none',
        duration: 1500,
      })
    })
  }
}) 