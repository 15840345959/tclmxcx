// pages/register/register.js
const util = require('../../utils/util.js')

var vm = null

//获取应用实例
var app = getApp()

var param;  //注册参数，后续进行参数封装

var wait = 60; //发送验证码等时计数器

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonenum: "",
    vertify_code: "",
    sendVertifyCodeBtn_text: "发送验证码",
    sendVertifyCodeBtn_disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad options:" + JSON.stringify(options));
    param = JSON.parse(options.jsonStr);
    console.log("param:" + JSON.stringify(param));
    vm = this;
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

  //输入手机号
  inputPhonenum: function (e) {
    console.log("inputPhonenum e:" + JSON.stringify(e));
    this.setData({
      phonenum: e.detail.value
    })
  },
  //输入验证码
  inputVervityCode: function (e) {
    console.log("inputVertifyCode e:" + JSON.stringify(e));
    this.setData({
      vertify_code: e.detail.value
    })
  },
  //点击发送验证码
  clickSendSMS: function (e) {
    var phonenum = this.data.phonenum;
    //判断是否输入手机号
    if (util.judgeIsAnyNullStr(phonenum) || !util.isPoneAvailable(phonenum)) {
      util.showModal('提示信息', '请输入手机号', function (ret) { }, function (ret) { });
      return;
    }
    //进行验证码发送
    var param = {
      phonenum: phonenum
    }
    util.showToast("发送验证码");
    this.time();
    util.sendVertifyCode(param, function (ret) {
      if (ret.data.result) {
        util.showToast("发送成功");
      }
    })
  },
  //倒计时
  time: function (e) {
    console.log("time wait:" + wait);
    if (wait == 0) {
      this.setData({
        sendVertifyCodeBtn_text: "发送验证码",
        sendVertifyCodeBtn_disabled: false
      })
    } else {
      this.setData({
        sendVertifyCodeBtn_text: wait,
        sendVertifyCodeBtn_disabled: true
      })
      wait--;
      setTimeout(function () {
        vm.time()
      }, 1000)
    }
  },
  //点击绑定手机号时，button绑定事件
  clickRegister: function (e) {
    console.log("clickRegister e:" + JSON.stringify(e));
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      util.showModal("提示信息", "请允许授权，否则无法使用关键功能", function (ret) { }, function (ret) { });
      return;
    }
    //封装对象
    var phonenum = this.data.phonenum;
    var vertify_code = this.data.vertify_code;
    //合规校验
    if (util.judgeIsAnyNullStr(phonenum)) {
      util.showModal("提示信息", "请输入手机号", function (ret) { }, function (ret) { });
      return;
    }
    if (util.judgeIsAnyNullStr(vertify_code)) {
      util.showModal("提示信息", "请输入验证码", function (ret) { }, function (ret) { });
      return;
    }
    console.log("bindgetuserinfo e:" + JSON.stringify(e));
    //进行参数封装
    param.phonenum = phonenum;
    param.vertify_code = vertify_code;
    param.nick_name = e.detail.userInfo.nickName;
    param.avatar = e.detail.userInfo.avatarUrl;
    param.gender = e.detail.userInfo.gender;
    param.province = e.detail.userInfo.province;
    param.city = e.detail.userInfo.city;
    util.register(param, function (ret) {
      //注册成功
      if (ret.data.result) {
        //进行数据缓存
        app.storeUserInfo(ret.data.ret);
        //关闭注册页面
        util.navigateBack(1);
      } else {
        util.showToast(ret.data.message);
      }
    })
  }
})