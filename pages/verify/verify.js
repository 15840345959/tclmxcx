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
    carBrandArray: ["请选择", "奥迪", "奥驰", "奥玲", "阿斯顿·马丁", "奔驰Smart", "保时捷", "宾利", "标致", "宝骏", "北汽", "比亚迪", "奔驰", "奔腾", "本田", "宝马", "宝马MINI", "别克", "长安", "昌河", "长丰", "长城", "大迪", "道奇", "大运", "大发", "东南", "东风", "大宇", "大众", "福特", "丰田", "福迪", "法拉利", "福田", "菲亚特", "GMC", "广汽", "华普", "汇众", "悍马", "海马", "哈飞", "华泰", "黑豹", "红旗", "金龙", "吉利", "解放", "江淮", "吉普", "捷豹", "吉利帝豪", "吉利上海英伦", "金杯", "江铃", "吉奥", "吉利全球鹰", "开瑞", "凯迪拉克", "克莱斯勒", "凯马", "路虎", "林肯", "兰博基尼", "力帆", "铃木", "陆风", "莲花", "劳斯莱斯", "雷诺", "雷克萨斯", "迈巴赫", "玛莎拉蒂", "名爵", "马自达", "尼桑", "南汽", "纳智捷", "讴歌", "欧宝", "奇瑞", "起亚", "启辰", "荣威", "瑞麒", "斯巴鲁", "萨博", "时代", "斯柯达", "上汽大通", "曙光", "双龙", "双环", "三菱", "唐骏", "特斯拉", "沃尔沃", "五十铃", "威麟", "五菱", "万丰", "夏利", "现代", "雪铁龙", "雪佛兰", "依维柯", "一汽", "跃进", "永源", "英菲尼迪", "中顺", "众泰", "重汽", "中兴", "中华"],
    carBrandIndex: 0,
    xsz_image: ['', ''],
    car_image: [''],
    is_verify: false,
    code: [
      "请选择",
      "京",
      "津",
      "沪",
      "渝",
      "冀",
      "晋",
      "辽",
      "吉",
      "黑",
      "苏",
      "浙",
      "皖",
      "闽",
      "台",
      "赣",
      "鲁",
      "豫",
      "鄂",
      "湘",
      "粤",
      "琼",
      "川",
      "黔",
      "滇",
      "陕",
      "甘",
      "青",
      "蒙",
      "桂",
      "藏",
      "宁",
      "新",
      "蒙",
      "港",
      "澳"
    ],
    code_index: 7,

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

        var carBrandIndex = 0

        for (var i = 0; i < vm.data.carBrandArray.length; i++) {
          console.log(vm.data.carBrandArray[i])
          console.log(ret.data.ret.car_brand)
          if (vm.data.carBrandArray[i] === ret.data.ret.car_brand) {
            console.log('bingo is : ' + '[' + i + ']')
            carBrandIndex = i
          }
        }

        console.log('carBrandIndex is : ' + carBrandIndex)

        var province = ret.data.ret.car_license.substr(0, 1)
        var code = ret.data.ret.car_license.substr(1)

        console.log('province is : ' + province)
        console.log('code is : ' + code)

        var code_index = 0
        for (var i = 0; i < vm.data.code.length; i++) {
          console.log(vm.data.code[i])
          console.log(province)
          if (vm.data.code[i] === province) {
            console.log('bingo is : ' + '[' + i + ']')
            code_index = i
          }
        }

        vm.setData({
          is_verify: false,
          owner_name: ret.data.ret.owner_name,
          car_license: code,
          carBrandIndex: carBrandIndex,
          code_index: code_index,
          xsz_image: ret.data.ret.xsz_img,
          car_image: ret.data.ret.cl_img,
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
      console.log('')
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
    param.car_license = vm.data.code[vm.data.code_index] + vm.data.car_license
    
    param.car_brand = vm.data.carBrandArray[vm.data.carBrandIndex]
    param.xsz_img = vm.data.xsz_image
    param.cl_img = vm.data.car_image

    console.log('clickSubmit param is : ' + JSON.stringify(param))

    if (param.owner_name === "") {
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

    if (param.car_license.length === 7) {
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

    if (vm.data.codeIndex === 0) {
      wx.showModal({
        title: '提示信息',
        content: '请选择车牌省份',
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

    // || vm.data.xsz_image[1] === ''
    if (vm.data.xsz_image[0] === '') {
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
  },
  bindCodeChange: function (e) {
    this.setData({
      codeIndex: e.detail.value
    })
  }
}) 