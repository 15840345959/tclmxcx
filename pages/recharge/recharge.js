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
		rechargeData: [],
		privilege: [
			{
				name: '短信提醒',
				url: 'asdasdas',
				icon: '/images/privilege/message.png'
			},
			{
				name: '优先资源',
				url: 'asdasdas',
        icon: '/images/privilege/diamond.png'
			},
			{
				name: '会员礼物',
				url: 'asdasdas',
        icon: '/images/privilege/gift.png'
			},
			{
				name: '额外积分',
				url: 'asdasdas',
        icon: '/images/privilege/score.png'
			},
			{
				name: '闪电提醒',
				url: 'asdasdas',
        icon: '/images/privilege/lightning.png'
			},
			{
				name: '会员独享',
				url: 'asdasdas',
        icon: '/images/privilege/member.png'
			},
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		vm = this;

    var globalDataUserInfo = app.globalData.userInfo

    console.log('recharge globalDataUserInfo is : ' + JSON.stringify(globalDataUserInfo))

    var due_timestamp = Date.parse(app.globalData.userInfo.member_due)
    var now_timestamp = Date.parse(new Date())

    globalDataUserInfo.expire = Math.floor((due_timestamp - now_timestamp) / 86400000)
    
		vm.setData({
			userInfo: app.globalData.userInfo
		})

		vm.getMemberLevel()

    event.addEventListener('refresh', this, this.refresh.bind(this))
	},
	refresh: function (data) {
		vm.getMemberLevel()
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
    event.removeEventListener('refresh', this, this.refresh.bind(this));
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
	getMemberLevel: function () {
		util.getMemberLevel({}, function (ret) {

			console.log('getMemberLevel ret is : ' + JSON.stringify(ret))

			vm.setData({
				rechargeData: ret.data.ret
			})
		}, function (err) {

		})
	},
	clickOpenResult: function (e) {
		console.log('clickOpenResult e is : ' + JSON.stringify(e))

		var id = e.currentTarget.dataset.id

		vm.beMember(id)
	},
  getByIdWithToken: function () {
		var param = {
			id: vm.data.userInfo.id
		}

    util.getByIdWithToken(param, function (ret) {
			wx.setStorage({
				key: "userInfo",
				data: ret.data.ret
			})
			
      var due_timestamp = Date.parse(ret.data.ret.member_due)
      var now_timestamp = Date.parse(new Date())

      ret.data.ret.expire = Math.floor((due_timestamp - now_timestamp) / 86400000)

      console.log('recharge ret is : ' + JSON.stringify(ret.data.ret))

      app.globalData.userInfo = ret.data.ret

      vm.setData({
        userInfo: ret.data.ret
      })

      console.log('recharge userInfo is : ' + JSON.stringify(vm.data.userInfo))

		}, function (err) {

		})
	},
	beMember: function (id) {

		var param = {
			member_level_id: id
		}

		util.beMember(param, function (ret) {

			var data = ret.data.ret

			wx.requestPayment({
				'timeStamp': data.timeStamp,
				'nonceStr': data.nonceStr,
				'package': data.package,
				'signType': data.signType,
				'paySign': data.paySign,
				'success': function (res) {
					console.log('requestPayment success res is : ' + JSON.stringify(res))

          vm.getByIdWithToken()

					wx.navigateTo({
						url: '/pages/result/result?result=success'
					})
				},
				'fail': function (res) {
					console.log('requestPayment fail res is : ' + JSON.stringify(res))

          vm.getByIdWithToken()
					
					wx.navigateTo({
						url: '/pages/result/result?result=fail'
					})
				}
			})
		}, function (err) {

		})
	}
}) 