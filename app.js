//app.js
const util = require('./utils/util.js')
var vm = null

App({
  onLaunch: function () {
    //获取vm
    vm = this
    //获取用户缓存数据
    var userInfo = wx.getStorageSync("userInfo");
    console.log("local storage userInfo:" + JSON.stringify(userInfo));
    //如果没有缓存
    if (userInfo == null || userInfo == undefined || userInfo == "") {
      //调用登录接口
      vm.login(null);
    } else {
      vm.globalData.userInfo = wx.getStorageSync("userInfo");
      console.log("vm.globalData.userInfo:" + JSON.stringify(vm.globalData.userInfo));
    }
  },
  //微信登录
  login: function (callBack) {
    wx.login({
      success: function (res) {
        console.log("wx.login:" + JSON.stringify(res))
        if (res.code) {
          util.getOpenId({ code: res.code }, function (ret) {
            console.log("getOpenId:" + JSON.stringify(ret))
            var openId = ret.data.ret.openid;
            var param = {
              xcx_openid: openId,
              account_type: "xcx"
            }
            //通过openid到后端获取用户信息
            util.loginServer(param, function (ret) {
              console.log("login:" + JSON.stringify(ret));
              //如果后台存在该用户数据，则代表已经注册，在本地建立缓存，下次无需二次登录校验
              if (ret.data.code == "200" && ret.data.result == true) {
                vm.storeUserInfo(ret.data.ret)
              } else {
                //否则引导用户至注册页面
                util.navigateToRegister(param); //将param传递到register页面以便完成后续注册流程
              }
            }, null);
          }, null);
        }
      }
    })
  },
  //监听小程序打开
  onShow: function () {
    //获取用户地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log('getLocation res is : ' + JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var userLocation = {}
        userLocation.lat = latitude
        userLocation.lon = longitude
        vm.globalData.userLocation = userLocation
      }
    })
  },
  storeUserInfo: function (obj) {
    console.log("storeUserInfo :" + JSON.stringify(obj));
    wx.setStorage({
      key: "userInfo",
      data: obj
    });
    vm.globalData.userInfo = obj;
  },
  getUserInfo: function (cb) {
    typeof cb == "function" && cb(vm.globalData.userInfo)
  },
  getSystemInfo: function (cb) {

    if (vm.globalData.systemInfo) {
      typeof cb == "function" && cb(vm.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          vm.globalData.systemInfo = res
          typeof cb == "function" && cb(vm.globalData.systemInfo)
        }
      })
    }
  },
  //引导用户授权
  showModal: function () {
    wx.showModal({
      title: '提示',
      content: '若不授权获取用户信息，停车联盟的部分重要功能将无法使用；请点击【重新授权】——选中【用户信息】和【地理位置】方可使用。',
      showCancel: false,
      confirmText: "重新授权",
      success: function (res) {
        if (res.confirm) {
          vm.openSetting()
        }
      }
    })
  },
  openSetting: function () {
    wx.openSetting({
      success: (res) => {
        console.log("Result" + JSON.stringify(res))
        if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
          vm.showModal()
        }
        else {
          vm.updateUserInfo(function (ret) {
          })
        }
      }
    })
  },
  //全局变量
  globalData: {
    userInfo: null,
    systemInfo: null,
    userLocation: {
      lat: "",
      lon: ""
    },
    addressComponent: {}
  },
  addListener: function (callback) {
    this.callback = callback
  },
  setChangedData: function (data) {
    this.data = data
    if (this.callback != null) {
      this.callback(data)
    }
  }
})