//测试标识
var TESTMODE = false;
//服务器地址
var SERVER_URL = "https://tclm.isart.me";
var DEBUG_URL = "http://localhost/tclm/public";
var SERVER_URL = (TESTMODE) ? DEBUG_URL : SERVER_URL;

//////接口相关//////////////////////////////////////////
//进行接口调用的基本方法
function wxRequest(url, param, method, successCallback, errorCallback) {
  showLoading()
  console.log("wxRequest url:" + JSON.stringify(url) + " medhot:" + method + " param:" + JSON.stringify(param))
  if (!judgeIsAnyNullStr(getApp().globalData.userInfo)) {
    //user_id未设置
    if (judgeIsAnyNullStr(param.user_id)) {
      param.user_id = getApp().globalData.userInfo.id
    }
    param.token = getApp().globalData.userInfo.token
  }
  console.log("param：" + JSON.stringify(param))
  wx.request({
    url: url,
    data: param,
    header: { "content-Type": "application/json" },
    // header: { 'content-type': 'application/x-www-form-urlencoded' },
    method: method,
    success: function (ret) {
      console.log("ret:" + JSON.stringify(ret))
      successCallback(ret)
    },
    fail: function (err) {
      console.log("wxRequest fail:" + JSON.stringify(err))
    },
    complete: function () {
      hideLoading()
    }
  });
}

//获取七牛token
function getQiniuToken(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/getQiniuToken', param, "GET", successCallback, errorCallback)
}

//获取用户的OpenId
function getOpenId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/getXCXOpenId', param, "GET", successCallback, errorCallback)
} 

// 获取用户UnionId
function getUnionId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/getUnionId', param, "GET", successCallback, errorCallback)
}

//登录
function loginServer(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/login', param, "POST", successCallback, errorCallback)
}

//发送验证码
function sendVertifyCode(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/sendVertifyCode', param, "POST", successCallback, errorCallback)
}

//注册
function register(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/register', param, "POST", successCallback, errorCallback)
}

//获取用户信息
function getByIdWithToken(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/getByIdWithToken', param, "GET", successCallback, errorCallback)

}

//获取首页轮播图
function getIndexADs(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/index/getXCXADs', param, "GET", successCallback, errorCallback);
}

//获取首页信息
function getIndexInfo(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/busi/getInformation', param, "GET", successCallback, errorCallback);
}

//首页周边巡检信息接口
function getNearlyReportInfo(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/busi/getNearlyReportInfo', param, "GET", successCallback, errorCallback);
}

//根据经纬度获取位置信息
function getAddress(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/map/getAddress', param, "GET", successCallback, errorCallback);
}

//上报信息
function uploadInfo(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/busi/uploadInfo', param, "POST", successCallback, errorCallback);
}

//停车
function parkingCar(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/busi/parkingCar', param, "POST", successCallback, errorCallback);
}

//获取会员充值信息
function getMemberLevel(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/recharge/getMemberLevel', param, "GET", successCallback, errorCallback);
}

//订购会员
function beMember(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/wechat/beMember', param, "POST", successCallback, errorCallback);
}

//上传车主信息
function certification(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/certification', param, "POST", successCallback, errorCallback);
}

// 验证车主信息
function certificationByUserId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/CertificationByUserId', param, "POST", successCallback, errorCallback);
} 

//积分兑换申请
function requestExchange(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/requestExchange', param, "POST", successCallback, errorCallback);
} 


// 转换真实地址
function getImgRealUrl(key) {
  return 'http://dsyy.isart.me/' + key
}



///////////////////////////////////////////////
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//判断是否有空字符串
function judgeIsAnyNullStr() {
  if (arguments.length > 0) {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] == null || arguments[i] == "" || arguments[i] == undefined || arguments[i] == "undefined" || arguments[i] == "未设置") {
        return true;
      }
    }
  }
  return false;
}

//是否为手机号
function isPoneAvailable(str) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false
  } else {
    return true
  }
}


//展示toast
function showToast(msg, img) {
  console.log(img);
  if (judgeIsAnyNullStr(img)) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
    })
  } else {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
      image: img
    })
  }
}

//展示modal
function showModal(title, content, confirmCallBack, cancelCallBack) {
  wx.showModal({
    title: title,
    content: content,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        confirmCallBack(res)
      } else if (res.cancel) {
        console.log('用户点击取消')
        cancelCallBack(res)
      }
    }
  })
}

//错误modal
function showErrorModal(msg) {
  wx.showModal({
    title: '调用失败',
    content: msg,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

//展示loadding
function showLoading(msg) {
  if (!wx.canIUse('showLoading')) {
    return;
  }
  if (judgeIsAnyNullStr(msg)) {
    msg = "加载中";
  }
  wx.showLoading({
    title: msg,
  })
}

//隐藏loadding
function hideLoading() {
  if (!wx.canIUse('hideLoading')) {
    return;
  }
  wx.hideLoading();
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//优化字符串输出，如果str为空，则返回r_str
function conStr(str, r_str) {
  if (judgeIsAnyNullStr(str)) {
    return r_str;
  }
  return str;
}

//返回
function navigateBack(delta) {
  wx.navigateBack({
    delta: delta
  })
}

//跳转到主页
function navigateToIndex(param) {
  console.log("navigateToIndex param:" + JSON.stringify(param));
  wx.navigateTo({
    url: '/pages/index/index?jsonStr=' + JSON.stringify(param),
  })

}

//跳转到注册页面
function navigateToRegister(param) {
  console.log("navigateToRegister param:" + JSON.stringify(param))
  wx.navigateTo({
    url: '/pages/register/register?jsonStr=' + JSON.stringify(param)
  })
}


//---------------------------------------------------  
// 日期格式化  
// 格式 YYYY/yyyy/YY/yy 表示年份  
// MM/M 月份  
// W/w 星期  
// dd/DD/d/D 日期  
// hh/HH/h/H 时间  
// mm/m 分钟  
// ss/SS/s/S 秒  
//---------------------------------------------------  
Date.prototype.Format = function (formatStr) {
  var str = formatStr
  var Week = ['日', '一', '二', '三', '四', '五', '六']

  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100))

  str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth())
  str = str.replace(/M/g, this.getMonth())

  str = str.replace(/w|W/g, Week[this.getDay()])

  str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate())
  str = str.replace(/d|D/g, this.getDate())

  str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours())
  str = str.replace(/h|H/g, this.getHours());
  str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes())
  str = str.replace(/m/g, this.getMinutes())

  str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds())
  str = str.replace(/s|S/g, this.getSeconds())

  return str
}

//+---------------------------------------------------  
//| 求两个时间的天数差 日期格式为 YYYY-MM-dd   
//+---------------------------------------------------  
function daysBetween(DateOne, DateTwo) {
  var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'))
  var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1)
  var OneYear = DateOne.substring(0, DateOne.indexOf('-'))

  var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'))
  var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1)
  var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'))

  var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000)
  return Math.abs(cha)
}


//+---------------------------------------------------  
//| 日期计算  
//+---------------------------------------------------  
Date.prototype.DateAdd = function (strInterval, Number) {
  var dtTmp = this
  switch (strInterval) {
    case 's': return new Date(Date.parse(dtTmp) + (1000 * Number))
    case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number))
    case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number))
    case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number))
    case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number))
    case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds())
    case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds())
    case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds())
  }
}

//+---------------------------------------------------  
//| 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串  
//+---------------------------------------------------  
Date.prototype.DateDiff = function (strInterval, dtEnd) {
  var dtStart = this
  if (typeof dtEnd == 'string')//如果是字符串转换为日期型  
  {
    dtEnd = StringToDate(dtEnd)
  }
  switch (strInterval) {
    case 's': return parseInt((dtEnd - dtStart) / 1000)
    case 'n': return parseInt((dtEnd - dtStart) / 60000)
    case 'h': return parseInt((dtEnd - dtStart) / 3600000)
    case 'd': return parseInt((dtEnd - dtStart) / 86400000)
    case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7))
    case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1)
    case 'y': return dtEnd.getFullYear() - dtStart.getFullYear()
  }
}

//+---------------------------------------------------  
//| 日期输出字符串，重载了系统的toString方法  
//+---------------------------------------------------  
Date.prototype.toString = function (showWeek) {
  var myDate = this;
  var str = myDate.toLocaleDateString()
  if (showWeek) {
    var Week = ['日', '一', '二', '三', '四', '五', '六']
    str += ' 星期' + Week[myDate.getDay()]
  }
  return str;
}

//+---------------------------------------------------  
//| 日期合法性验证  
//| 格式为：YYYY-MM-DD或YYYY/MM/DD  
//+---------------------------------------------------  
function IsValidDate(DateStr) {
  var sDate = DateStr.replace(/(^\s+|\s+$)/g, ''); //去两边空格;   
  if (sDate == '') return true
  //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''   
  //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式   
  var s = sDate.replace(/[\d]{ 4,4 }[\-/]{ 1 }[\d]{ 1,2 }[\-/]{ 1 }[\d]{ 1,2 }/g, '')
  if (s == '') //说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D   
  {
    var t = new Date(sDate.replace(/\-/g, '/'))
    var ar = sDate.split(/[-/:]/)
    if (ar[0] != t.getYear() || ar[1] != t.getMonth() + 1 || ar[2] != t.getDate()) {
      //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。') 
      return false;
    }
  }
  else {
    //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。') 
    return false;
  }
  return true;
}

//+---------------------------------------------------  
//| 日期时间检查  
//| 格式为：YYYY-MM-DD HH:MM:SS  
//+---------------------------------------------------  
function CheckDateTime(str) {
  var reg = /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/
  var r = str.match(reg)
  if (r == null) return false
  r[2] = r[2] - 1
  var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6])
  if (d.getFullYear() != r[1]) return false
  if (d.getMonth() != r[2]) return false
  if (d.getDate() != r[3]) return false
  if (d.getHours() != r[4]) return false
  if (d.getMinutes() != r[5]) return false
  if (d.getSeconds() != r[6]) return false
  return true
}

//+---------------------------------------------------  
//| 把日期分割成数组  
//+---------------------------------------------------  
Date.prototype.toArray = function () {
  var myDate = this
  var myArray = Array()
  myArray[0] = myDate.getFullYear()
  myArray[1] = myDate.getMonth()
  myArray[2] = myDate.getDate()
  myArray[3] = myDate.getHours()
  myArray[4] = myDate.getMinutes()
  myArray[5] = myDate.getSeconds()
  return myArray
}

//+---------------------------------------------------  
//| 取得日期数据信息  
//| 参数 interval 表示数据类型  
//| y 年 m月 d日 w星期 ww周 h时 n分 s秒  
//+---------------------------------------------------  
Date.prototype.DatePart = function (interval) {
  var myDate = this
  var partStr = ''
  var Week = ['日', '一', '二', '三', '四', '五', '六']
  switch (interval) {
    case 'y': partStr = myDate.getFullYear()
      break
    case 'm': partStr = myDate.getMonth() + 1
      break
    case 'd': partStr = myDate.getDate()
      break
    case 'w': partStr = Week[myDate.getDay()]
      break
    case 'ww': partStr = myDate.WeekNumOfYear()
      break
    case 'h': partStr = myDate.getHours()
      break
    case 'n': partStr = myDate.getMinutes()
      break
    case 's': partStr = myDate.getSeconds()
      break
  }
  return partStr
}

//+---------------------------------------------------  
//| 取得当前日期所在月的最大天数  
//+---------------------------------------------------  
Date.prototype.MaxDayOfDate = function () {
  var myDate = this
  var ary = myDate.toArray()
  var date1 = (new Date(ary[0], ary[1] + 1, 1))
  var date2 = date1.dateAdd(1, 'm', 1)
  var result = dateDiff(date1.Format('yyyy-MM-dd'), date2.Format('yyyy-MM-dd'))
  return result
}


//+---------------------------------------------------  
//| 字符串转成日期类型   
//| 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd  
//+---------------------------------------------------  
function StringToDate(DateStr) {
  var converted = Date.parse(DateStr)
  var myDate = new Date(converted)
  if (isNaN(myDate)) {
    //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-'
    var arys = DateStr.split('-')
    myDate = new Date(arys[0], --arys[1], arys[2])
  }
  return myDate
}


// 获取今天日期
function getToday() {
  var now = new Date()
  var today = ""
  var year = now.getFullYear()       //年
  today += year + "-"
  var month = now.getMonth() + 1     //月
  if (month < 10)
    today += "0"
  today += month + "-"
  var day = now.getDate()            //日
  if (day < 10)
    today += "0"
  return year + "-" + month + "-" + day
}

// 获取现在时间
function getNowTime() {
  var now = new Date()

  var year = now.getFullYear()       //年
  
  var month = now.getMonth() + 1     //月
  if (month < 10)
    month = "0" + month

  var day = now.getDate()            //日
  if (day < 10)
    day = "0" + day

  var hour = now.getHours()            //时
  if (hour < 10)
    hour = "0" + hour

  var minute = now.getMinutes()            //分
  if (minute < 10)
    minute = "0" + minute

  var second = now.getSeconds()           //秒
  if (second < 10)
    second = "0" + second

  return year + "-" + month + "-" + day + ' ' + hour + ':' + minute + ':' + second
}

/**
 * 获取指定时间与当前时间差异的友好时间字符串。
 * @param str 指定的时间字符串，如yyyy-MM-dd HH:mm:ss
 * @param now 当前时间，允许时间戳，GMT时间，如果该参数为undefined，则使用浏览器时间。
 */
function getDiffentTime(str) {

  // console.log('getDiffentTime str is : ' + str)
  // console.log('getDiffentTime now is : ' + new Date(now))
  // console.log('getDiffentTime now is : ' + now)

  var currentTime = new Date()
  var arr = str.split(/\s+/gi)
  var temp = 0, arr1, arr2, oldTime, delta
  var getIntValue = function (ss, defaultValue) {
    try {
      return parseInt(ss, 10)
    } catch (e) {
      return defaultValue
    }
  }
  var getWidthString = function (num) {
    return num < 10 ? ("0" + num) : num
  }
  if (arr.length >= 2) {
    arr1 = arr[0].split(/[\/\-]/gi)
    arr2 = arr[1].split(":")
    oldTime = new Date()
    oldTime.setYear(getIntValue(arr1[0], currentTime.getFullYear()))
    oldTime.setMonth(getIntValue(arr1[1], currentTime.getMonth() + 1) - 1)
    oldTime.setDate(getIntValue(arr1[2], currentTime.getDate()))
    oldTime.setHours(getIntValue(arr2[0], currentTime.getHours()))
    oldTime.setMinutes(getIntValue(arr2[1], currentTime.getMinutes()))
    oldTime.setSeconds(getIntValue(arr2[2], currentTime.getSeconds()))
    delta = currentTime.getTime() - oldTime.getTime()
    if (delta <= 6000) {
      return "1分钟内"
    }
    else if (delta < 60 * 60 * 1000) {
      return Math.floor(delta / (60 * 1000)) + "分钟前"
    }
    else if (delta < 24 * 60 * 60 * 1000) {
      return Math.floor(delta / (60 * 60 * 1000)) + "小时前"
    }
    else if (delta < 3 * 24 * 60 * 60 * 1000) {
      return Math.floor(delta / (24 * 60 * 60 * 1000)) + "天前"
    }
    else if (currentTime.getFullYear() != oldTime.getFullYear()) {
      return [getWidthString(oldTime.getFullYear()), getWidthString(oldTime.getMonth() + 1), getWidthString(oldTime.getDate())].join("-")
    }
    else {
      return [getWidthString(oldTime.getMonth() + 1), getWidthString(oldTime.getDate())].join("-")
    }
  }
  return ""
}

var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function transformlat(lng, lat) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret
}

function transformlng(lng, lat) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret
}

//wgs84坐标转gcj02坐标
function gcj02towgs84(lng, lat) {
  var dlat = transformlat(lng - 105.0, lat - 35.0);
  var dlng = transformlng(lng - 105.0, lat - 35.0);
  var radlat = lat / 180.0 * PI;
  var magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  var sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
  var mglat = lat + dlat;
  var mglng = lng + dlng;

  var location = {
    lat: mglat,
    lon: mglng
  }
  return location
}

module.exports = {
  getQiniuToken: getQiniuToken,
  getOpenId: getOpenId,
  getUnionId: getUnionId,
  loginServer: loginServer,
  register: register,
  sendVertifyCode: sendVertifyCode,
  getByIdWithToken: getByIdWithToken,

  getIndexADs: getIndexADs,
  getIndexInfo: getIndexInfo,
  getNearlyReportInfo: getNearlyReportInfo,
  getAddress: getAddress,
  uploadInfo: uploadInfo,
  getMemberLevel: getMemberLevel,
  beMember: beMember,
  parkingCar: parkingCar,
  requestExchange: requestExchange,
  certification: certification,
  certificationByUserId: certificationByUserId,


  getImgRealUrl: getImgRealUrl,

  formatTime: formatTime,
  showLoading: showLoading,
  hideLoading: hideLoading,
  showToast: showToast,
  showModal: showModal,
  judgeIsAnyNullStr: judgeIsAnyNullStr,
  getToday: getToday,
  isPoneAvailable: isPoneAvailable,

  navigateBack: navigateBack,   //进行页面跳回
  navigateToRegister: navigateToRegister,  //跳转到注册页面
  navigateToIndex: navigateToIndex,	//跳转到首页

  getDiffentTime:getDiffentTime,
  gcj02towgs84: gcj02towgs84,
  getNowTime: getNowTime
} 
