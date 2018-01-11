//测试标识
var TESTMODE = false;
//服务器地址
var SERVER_URL = "http://tclm.isart.me";
var DEBUG_URL = "http://localhost/tclm/public";
var SERVER_URL = (TESTMODE) ? DEBUG_URL : SERVER_URL;

//////接口相关//////////////////////////////////////////
//进行接口调用的基本方法
function wxRequest(url, param, method, successCallback, errorCallback) {
  showLoading();
  console.log("wxRequest url:" + JSON.stringify(url) + " medhot:" + method + " param:" + JSON.stringify(param));
  if (!judgeIsAnyNullStr(getApp().globalData.userInfo)) {
    //user_id未设置
    if (judgeIsAnyNullStr(param.user_id)) {
      param.user_id = getApp().globalData.userInfo.id;
    }
    param.token = getApp().globalData.userInfo.token;
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
  wxRequest(SERVER_URL + '/api/user/getQiniuToken', param, "GET", successCallback, errorCallback);
}

//获取用户的OpenId
function getOpenId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/getXCXOpenId', param, "GET", successCallback, errorCallback);
}

//登录
function loginServer(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/login', param, "POST", successCallback, errorCallback);
}

//发送验证码
function sendVertifyCode(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/sendVertifyCode', param, "POST", successCallback, errorCallback);
}

//注册
function register(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/user/register', param, "POST", successCallback, errorCallback);
}

//获取首页轮播图
function getIndexADs(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/api/index/getXCXADs', param, "GET", successCallback, errorCallback);
}

//获取首页信息

function getIndexInfo(param, successCallback, errorCallback) {
  // wxRequest(SERVER_URL + '/api/index/getXCXADs', param, "GET", successCallback, errorCallback);
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
    return false;
  } else {
    return true;
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

  console.log("navigateToRegister param:" + JSON.stringify(param));
  wx.navigateTo({
    url: '/pages/register/register?jsonStr=' + JSON.stringify(param),
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
  var str = formatStr;
  var Week = ['日', '一', '二', '三', '四', '五', '六'];

  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

  str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
  str = str.replace(/M/g, this.getMonth());

  str = str.replace(/w|W/g, Week[this.getDay()]);

  str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
  str = str.replace(/d|D/g, this.getDate());

  str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
  str = str.replace(/h|H/g, this.getHours());
  str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
  str = str.replace(/m/g, this.getMinutes());

  str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
  str = str.replace(/s|S/g, this.getSeconds());

  return str;
}

//+---------------------------------------------------  
//| 求两个时间的天数差 日期格式为 YYYY-MM-dd   
//+---------------------------------------------------  
function daysBetween(DateOne, DateTwo) {
  var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
  var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
  var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

  var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
  var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
  var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

  var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
  return Math.abs(cha);
}


//+---------------------------------------------------  
//| 日期计算  
//+---------------------------------------------------  
Date.prototype.DateAdd = function (strInterval, Number) {
  var dtTmp = this;
  switch (strInterval) {
    case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
    case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
    case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
    case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
    case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
    case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
  }
}

//+---------------------------------------------------  
//| 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串  
//+---------------------------------------------------  
Date.prototype.DateDiff = function (strInterval, dtEnd) {
  var dtStart = this;
  if (typeof dtEnd == 'string')//如果是字符串转换为日期型  
  {
    dtEnd = StringToDate(dtEnd);
  }
  switch (strInterval) {
    case 's': return parseInt((dtEnd - dtStart) / 1000);
    case 'n': return parseInt((dtEnd - dtStart) / 60000);
    case 'h': return parseInt((dtEnd - dtStart) / 3600000);
    case 'd': return parseInt((dtEnd - dtStart) / 86400000);
    case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));
    case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
    case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
  }
}

//+---------------------------------------------------  
//| 日期输出字符串，重载了系统的toString方法  
//+---------------------------------------------------  
Date.prototype.toString = function (showWeek) {
  var myDate = this;
  var str = myDate.toLocaleDateString();
  if (showWeek) {
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str += ' 星期' + Week[myDate.getDay()];
  }
  return str;
}

//+---------------------------------------------------  
//| 日期合法性验证  
//| 格式为：YYYY-MM-DD或YYYY/MM/DD  
//+---------------------------------------------------  
function IsValidDate(DateStr) {
  var sDate = DateStr.replace(/(^\s+|\s+$)/g, ''); //去两边空格;   
  if (sDate == '') return true;
  //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''   
  //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式   
  var s = sDate.replace(/[\d]{ 4,4 }[\-/]{ 1 }[\d]{ 1,2 }[\-/]{ 1 }[\d]{ 1,2 }/g, '');
  if (s == '') //说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D   
  {
    var t = new Date(sDate.replace(/\-/g, '/'));
    var ar = sDate.split(/[-/:]/);
    if (ar[0] != t.getYear() || ar[1] != t.getMonth() + 1 || ar[2] != t.getDate()) {
      //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');   
      return false;
    }
  }
  else {
    //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');   
    return false;
  }
  return true;
}

//+---------------------------------------------------  
//| 日期时间检查  
//| 格式为：YYYY-MM-DD HH:MM:SS  
//+---------------------------------------------------  
function CheckDateTime(str) {
  var reg = /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/;
  var r = str.match(reg);
  if (r == null) return false;
  r[2] = r[2] - 1;
  var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
  if (d.getFullYear() != r[1]) return false;
  if (d.getMonth() != r[2]) return false;
  if (d.getDate() != r[3]) return false;
  if (d.getHours() != r[4]) return false;
  if (d.getMinutes() != r[5]) return false;
  if (d.getSeconds() != r[6]) return false;
  return true;
}

//+---------------------------------------------------  
//| 把日期分割成数组  
//+---------------------------------------------------  
Date.prototype.toArray = function () {
  var myDate = this;
  var myArray = Array();
  myArray[0] = myDate.getFullYear();
  myArray[1] = myDate.getMonth();
  myArray[2] = myDate.getDate();
  myArray[3] = myDate.getHours();
  myArray[4] = myDate.getMinutes();
  myArray[5] = myDate.getSeconds();
  return myArray;
}

//+---------------------------------------------------  
//| 取得日期数据信息  
//| 参数 interval 表示数据类型  
//| y 年 m月 d日 w星期 ww周 h时 n分 s秒  
//+---------------------------------------------------  
Date.prototype.DatePart = function (interval) {
  var myDate = this;
  var partStr = '';
  var Week = ['日', '一', '二', '三', '四', '五', '六'];
  switch (interval) {
    case 'y': partStr = myDate.getFullYear(); break;
    case 'm': partStr = myDate.getMonth() + 1; break;
    case 'd': partStr = myDate.getDate(); break;
    case 'w': partStr = Week[myDate.getDay()]; break;
    case 'ww': partStr = myDate.WeekNumOfYear(); break;
    case 'h': partStr = myDate.getHours(); break;
    case 'n': partStr = myDate.getMinutes(); break;
    case 's': partStr = myDate.getSeconds(); break;
  }
  return partStr;
}

//+---------------------------------------------------  
//| 取得当前日期所在月的最大天数  
//+---------------------------------------------------  
Date.prototype.MaxDayOfDate = function () {
  var myDate = this;
  var ary = myDate.toArray();
  var date1 = (new Date(ary[0], ary[1] + 1, 1));
  var date2 = date1.dateAdd(1, 'm', 1);
  var result = dateDiff(date1.Format('yyyy-MM-dd'), date2.Format('yyyy-MM-dd'));
  return result;
}


//+---------------------------------------------------  
//| 字符串转成日期类型   
//| 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd  
//+---------------------------------------------------  
function StringToDate(DateStr) {

  var converted = Date.parse(DateStr);
  var myDate = new Date(converted);
  if (isNaN(myDate)) {
    //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
    var arys = DateStr.split('-');
    myDate = new Date(arys[0], --arys[1], arys[2]);
  }
  return myDate;
}


// 获取今天日期
function getToday() {
  var now = new Date();
  var today = "";
  var year = now.getFullYear();       //年
  today += year + "-";
  var month = now.getMonth() + 1;     //月
  if (month < 10)
    today += "0";
  today += month + "-";
  var day = now.getDate();            //日
  if (day < 10)
    today += "0";
  return year + "-" + month + "-" + day;
}

module.exports = {
  getQiniuToken: getQiniuToken,
  getOpenId: getOpenId,
  loginServer: loginServer,
  register: register,
  sendVertifyCode: sendVertifyCode,

  // 首页接口
  getIndexADs: getIndexADs,
  getIndexInfo: getIndexInfo,

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
  navigateToIndex: navigateToIndex	//跳转到首页

}
