const util = require('../../utils/util.js')
const event = require('../../utils/event.js')

var vm = null
var app = getApp()

Page({
  data: {
    imgUrls: [],
    address: "正在定位",
    city: '',
    district: '',
    street: '',
    addressComponent: {},
    indexInfo: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  onLoad: function (options) {
    vm = this;

    console.log('globalData is : ' + JSON.stringify(app.globalData))

    event.addEventListener('refreshIndexInfo', this, this.refreshIndexInfo.bind(this))

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
  refreshIndexInfo: function () {
    console.log('refreshIndexInfo begin')
    vm.getIndexInfo({ city: vm.data.city })
    console.log('refreshIndexInfo end')
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
    vm.refreshIndexInfo({ city: vm.data.city })
  },
  onUnload: function () {
    event.removeEventListener('refreshIndexInfo', this, this.refreshIndexInfo.bind(this));
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

    console.log('getIndexInfo begin')
    util.getIndexInfo(param, function (ret) {
      var data = ret.data.ret
	    console.log('getIndexInfo data is : ' + JSON.stringify(data))

      for (var i = 0; i < data.length; i++) {
        data[i].diff_time = util.getDiffentTime(data[i].created_at, Date.parse(new Date()))
      }

      vm.setData({
        indexInfo: data
      })
      
      console.log('getIndexInfo is : ' + JSON.stringify(data))

      wx.stopPullDownRefresh()

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

      app.globalData.addressComponent = addressComponent

      console.log('data is : ' + JSON.stringify(vm.data))
      vm.getIndexInfo({ city: vm.data.city })
    }, function (err) {

    })
  },
  clickOpenReport: function () {
    wx.navigateTo({
      url: '/pages/report/report',
    })
  },
  clickOpenPark: function () {
    vm.getByIdWithToken()
  },
  getByIdWithToken: function () {
    util.getByIdWithToken({ id: app.globalData.userInfo.id}, function (ret) {
      console.log('getByIdWithToken ret is : ' + JSON.stringify(ret))

      wx.setStorage({
        key: "userInfo",
        data: ret.data.ret
      })

      app.globalData.userInfo = ret.data.ret

      var stroage_userInfo = wx.getStorageSync('userInfo')

      console.log('stroage_userInfo is : ' + JSON.stringify(stroage_userInfo))
      console.log('globalData userInfo is : ' + JSON.stringify(app.globalData.userInfo))

      var due_timestamp = Date.parse(app.globalData.userInfo.member_due.substr(0, 10).replace(/-/g, '/'))
      var now_timestamp = Date.parse(new Date())

      console.log('due_timestamp is : ' + JSON.stringify(due_timestamp))
      console.log('now_timestamp is : ' + JSON.stringify(now_timestamp))

      console.log('due is : ' + app.globalData.userInfo.member_due.substr(0, 10).replace(/-/g, '/'))
      console.log('now is : ' + new Date())

      console.log('due_timestamp is : ' + vm.formatDateTime(due_timestamp / 1000))
      console.log('now_timestamp is : ' + vm.formatDateTime(now_timestamp / 1000))

      if (now_timestamp >= due_timestamp) {
        console.log('会员已过期')
        wx.showModal({
          title: '你还不是停车联盟会员',
          content: '成为会员后可使用本功能',
          confirmText: '成为会员',
          confirmColor: '#606898',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '/pages/recharge/recharge',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        console.log('会员未过期')
        wx.navigateTo({
          url: '/pages/park/park',
        })
      }
    }, function (err) {
      console.log('getByIdWithToken err is : ' + JSON.stringify(err))
    })
  },
  formatDateTime: function (timeStamp) {   
    var date = new Date();  
    date.setTime(timeStamp * 1000);  
    var y = date.getFullYear();      
    var m = date.getMonth() + 1;      
    m = m < 10 ? ('0' + m) : m;      
    var d = date.getDate();      
    d = d < 10 ? ('0' + d) : d;      
    var h = date.getHours();    
    h = h < 10 ? ('0' + h) : h;    
    var minute = date.getMinutes();    
    var second = date.getSeconds();    
    minute = minute < 10 ? ('0' + minute) : minute;      
    second = second < 10 ? ('0' + second) : second;     
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;      
  }
})