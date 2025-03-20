import moment from 'moment'
import CryptoJS from 'crypto-js'
import { sm2 } from 'sm-crypto'

/**
 * 获取对象下的字段值
 * @param record {}
 * @param key 'a.b.c'
 * @param defaultValue
 * @returns
 */
export const getValueByKeys = (record, key, defaultValue) => {
  const keys = key.split(".");
  for (let i = 0; i < keys.length; i++) {
    record = record[keys[i]] || (i === keys.length - 1 ? defaultValue : {});
  }
  return record || defaultValue;
};

/**
 * 数组转对象
 * @param {*} rs 集合
 * @param {*} key 需要转换目标key的名称
 */
export const arrayToObject = (rs = [], key, render) => {
  const o = {};
  rs.forEach((x) => {
    o[typeof key === "function" ? key(x) : x[key]] = render ? render(x) : x;
  });
  return o;
};

/**
 * 全局组件安装
 * @param component
 * @param alias
 * @returns
 */
export const withInstall = (component, alias) => {
  const comp = component;
  comp.install = (app) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component;
};

/**
 * 是否只null和undefined值
 * @param vl
 * @returns
 */
export const isNullOrUndefined = (vl) => {
  return vl === null || typeof vl === "undefined";
};

/**
 * 日期格式化
 * @param {*} data 
 * @param {*} formatStr 
 * @returns 
 */
export const dateFormat = (data, formatStr = "YYYY-MM-DD HH:mm:ss") => {
  return moment(data).format(formatStr)
}

/**
 * 插入字符串
 * @param {*} s 
 * @param {*} index 
 * @param {*} insert 
 */
export const insertStr = (s, index, insert) => {
  var arr = s.split('')
  arr.splice(index, 0, insert)
  return arr.join('')
}

/**
 * 是否外链
 * @param path
 * @returns
 */
export const isExternalLink = (path) => {
  return /^(https?:|\/\/|mailto:|tel:|^{{\s?ApiUrl\s?}})/.test(path);
};

/**
 * 复制
 * @param value
 */
export const copyToClipboard = (value) => {
  const transfer = document.createElement("textarea");
  document.body.appendChild(transfer);
  transfer.value = value;
  transfer.focus();
  transfer.select();
  if (Document.execCommand("copy")) {
    Document.execCommand("copy");
  }
  transfer.blur();
  document.body.removeChild(transfer);
};

/**
 * 检查是否有权限
 * @param permission
 * @param key
 * @returns
 */
export const checkPermission = (permission, key) => {
  return permission.includes(key);
};

/**
 * 获取uuid
 */
export const getUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 邮箱
 * @param {*} s
 */
export const isEmail = (s) => {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
};

/**
 * 手机号码
 * @param {*} s
 */
export const isMobile = (s) => {
  return /^1[0-9]{10}$/.test(s);
};

/**
 * 电话号码
 * @param {*} s
 */
export const isPhone = (s) => {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
};

/**
 * URL地址
 * @param {*} s
 */
export const isURL = (s) => {
  return /^http[s]?:\/\/.*/.test(s);
};

/**
 * 正整数
 * @param {*} s
 */
export const isNumber = (s) => {
  return /^\+?[1-9][0-9]*$/.test(s);
};

/**
 * 获取字典数据列表
 * @param dictType  字典类型
 */
export const getDictDataList = (list, dictType) => {
  const type = list.find((element) => element.dictType === dictType);
  if (type) {
    return type.dataList;
  } else {
    return [];
  }
};

/**
 * 获取字典名称
 * @param dictType  字典类型
 * @param dictValue  字典值
 */
export const getDictLabel = (list, dictType, dictValue) => {
  const type = list.find((element) => element.dictType === dictType);
  if (type) {
    const val = type.dataList.find((element) => element.dictValue === dictValue + "");
    if (val) {
      return val.dictLabel;
    } else {
      return dictValue;
    }
  } else {
    return dictValue;
  }
};

/**
 * 获取svg图标(id)列表
 */
export const getIconList = () => {
  const rs = [];
  const list = document.querySelectorAll("svg symbol");
  for (let i = 0; i < list.length; i++) {
    rs.push(list[i].id);
  }
  return rs;
};

export const resetSize = (vm) => {
    var img_width, img_height, bar_width, bar_height;	//图片的宽度、高度，移动条的宽度、高度

    var parentWidth = vm.$el.parentNode.offsetWidth || window.offsetWidth
    var parentHeight = vm.$el.parentNode.offsetHeight || window.offsetHeight
    if (vm.imgSize.width.indexOf('%') != -1) {
        img_width = parseInt(vm.imgSize.width) / 100 * parentWidth + 'px'
    } else {
        img_width = vm.imgSize.width;
    }

    if (vm.imgSize.height.indexOf('%') != -1) {
        img_height = parseInt(vm.imgSize.height) / 100 * parentHeight + 'px'
    } else {
        img_height = vm.imgSize.height
    }

    if (vm.barSize.width.indexOf('%') != -1) {
        bar_width = parseInt(vm.barSize.width) / 100 * parentWidth + 'px'
    } else {
        bar_width = vm.barSize.width
    }

    if (vm.barSize.height.indexOf('%') != -1) {
        bar_height = parseInt(vm.barSize.height) / 100 * parentHeight + 'px'
    } else {
        bar_height = vm.barSize.height
    }

    return {imgWidth: img_width, imgHeight: img_height, barWidth: bar_width, barHeight: bar_height}
}

export const _code_chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const _code_color1 = ['#fffff0', '#f0ffff', '#f0fff0', '#fff0f0']
export const _code_color2 = ['#FF0033', '#006699', '#993366', '#FF9900', '#66CC66', '#FF33CC']

export const doEncrypt = (text, word) => {
  //let keyPair = sm2.generateKeyPairHex()
  //var publicKey = keyPair.publicKey
  //var privateKey = keyPair.privateKey
  //console.log(publicKey)
  //console.log(privateKey)
  if(text == null || text == "") return null
  let source = text.concat(".", new Date().getTime())
  let aesKey = randomStr(16)
  let iv = randomStr(16)
  const cipher = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(source), CryptoJS.enc.Utf8.parse(aesKey), {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: CryptoJS.enc.Utf8.parse(iv)
  })
  let json = {aesKey, iv, "binary": cipher.toString()}
  return sm2.doEncrypt(JSON.stringify(json), word)
}

/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
 export const aesEncrypt = (word, keyWord = "XwKsGlMcdPMEhR1B") => {
  var key = CryptoJS.enc.Utf8.parse(keyWord);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}

/**
 * 生成随机字符串
 * @param {*} size 
 * @returns 
 */
export const randomStr = (size) => {
  var str = "1234567890ABCDEFGHIGKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz$&@?!~#%^*+="
  var text = ''
  for(var i = 0; i < size; i++){
    text += str.charAt(Math.floor(Math.random() * str.length));
  }
  return text
}

/**
 * 洗牌算法随机
 * @param {*} arr 
 * @returns 
 */
export const shuffle = (arr) => {
  var result = [],
      random;
  while (arr.length > 0) {
      random = Math.floor(Math.random() * arr.length);
      result.push(arr[random])
      arr.splice(random, 1)
  }
  return result;
}

/**
 * 判断一个元素是否在数组中
 * @param {*} arr 
 * @param {*} val 
 * @returns 
 */
export const contains = (arr, val) => {
  return arr.indexOf(val) != -1 ? true : false;
}

/**
 * 检查密码强度
 * @param {*} str 
 * @returns 
 */
export const checkPwd = (str) => {
  var Lv = 0;
  if (str.length < 6) {
    return Lv
  }
  if (/[0-9]/.test(str)) {
    Lv++
  }
  if (/[a-z]/.test(str)) {
    Lv++
  }
  if (/[A-Z]/.test(str)) {
    Lv++
  }
  if (/[.|-|_]/.test(str)) {
    Lv++
  }
  return Lv;
}

/**
 * 判断集合类型
 * @param {*} str 
 * @param {*} type 
 * @returns 
 */
export const checkStr = (str, type) => {
  switch (type) {
    case 'phone':   //手机号码
      return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
    case 'tel':     //座机
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
    case 'card':    //身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
    case 'pwd':     //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
      return /^[a-zA-Z]\w{5,17}$/.test(str)
    case 'postal':  //邮政编码
      return /[1-9]\d{5}(?!\d)/.test(str);
    case 'QQ':      //QQ号
      return /^[1-9][0-9]{4,9}$/.test(str);
    case 'email':   //邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    case 'money':   //金额(小数点2位)
      return /^\d*(?:\.\d{0,2})?$/.test(str);
    case 'URL':     //网址
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
    case 'IP':      //IP
      return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
    case 'date':    //日期时间
      return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
    case 'number':  //数字
      return /^[0-9]$/.test(str);
    case 'english': //英文
      return /^[a-zA-Z]+$/.test(str);
    case 'chinese': //中文
      return /^[\\u4E00-\\u9FA5]+$/.test(str);
    case 'lower':   //小写
      return /^[a-z]+$/.test(str);
    case 'upper':   //大写
      return /^[A-Z]+$/.test(str);
    case 'HTML':    //HTML标记
      return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
    default:
      return true;
  }
}