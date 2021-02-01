// 给定值和排序好的数组,找到距离值最近两边的数组值
export function binarySearchRange(array, left, right, value) {
  const mid_idx = Math.ceil((right + left) / 2);
  if (value > array[right]) {
    return [array[right]];
  }
  if (value < array[left]) {
    return [array[left]];
  }
  if (right - left <= 1 || array[mid_idx] === value) {
    return [array[left], array[right]];
  }
  if (array[mid_idx] > value) {
    return binarySearchRange(array, left, mid_idx, value);
  }
  if (array[mid_idx] < value) {
    return binarySearchRange(array, mid_idx, right, value);
  }
}

export function binarySearchSidesValue(array, value) {
  return binarySearchRange(array, 0, array.length - 1, value);
}

// const arr = [100, 123, 123, 133, 234, 234, 235, 235, 256, 300, 400, 500, 600];
// console.log(binarySearchSidesValue(arr, 130));

export const storage = {
  set: function (variable, value, ttl_ms) {
    const data = { value: value, expires_at: new Date(ttl_ms).getTime() };
    localStorage.setItem(variable.toString(), JSON.stringify(data));
  },
  get: function (variable) {
    const data = JSON.parse(localStorage.getItem(variable.toString()));
    if (data !== null) {
      if (data.expires_at !== null && data.expires_at < new Date().getTime()) {
        localStorage.removeItem(variable.toString());
      } else {
        return data.value;
      }
    }
    return null;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

const restArguments = function (func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    const length = Math.max(arguments.length - startIndex, 0);
    const rest = Array(length);
    let index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
      default:
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
};
const delay = restArguments(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
});

// 函数去抖
export function debounce(func, wait, immediate) {
  var timeout, result;

  var later = function (context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArguments(function (args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

// 函数节流
export function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

export function scaleLoop(callback) {
  const next = (gap) => {
    setTimeout(callback, gap);
  };
  callback(next);
}
export const isIphonex = () =>
  /iphone/gi.test(navigator.userAgent) &&
  window.screen &&
  window.screen.height >= 812;

export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var sch = window.location.href.split('?')[1] || '';
  var r = sch.match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

export function couponValueTime(startDate, valueTime) {
  var date = new Date(startDate);
  var newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + valueTime
  );
  var year2 = newDate.getFullYear();
  var month2 = newDate.getMonth() + 1;
  var day2 = newDate.getDate();
  return `${year2}-${month2}-${day2}`;
}
export function tenThousand(num) {
  if (+num >= 10000) return `${(num / 10000).toFixed(1)}万`;
  return num;
}

export function getPlatform() {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return 'ios';
  } else if (/(Android)/i.test(navigator.userAgent)) {
    return 'android';
  }
  return 'web';
}
export function parseTime(str, format) {
  str = parseInt(str);
  var D = false;
  if (isNaN(str)) {
    D = new Date();
  } else {
    D = new Date(str);
  }
  var ret = '';
  if (D && !isNaN(D.getTime())) {
    var fullyear = D.getFullYear();
    var month = D.getMonth() + 1;
    var date = D.getDate();
    var hours = D.getHours();
    var minute = D.getMinutes();
    var second = D.getSeconds();
    var doublemonth = month > 9 ? month : '0' + month;
    var doubledate = date > 9 ? date : '0' + date;
    var doubleyear = fullyear.toString().substr(2);
    var doublehours = hours > 9 ? hours : '0' + hours;
    var doubleminues = minute > 9 ? minute : '0' + minute;
    var doublesecond = second > 9 ? second : '0' + second;
    ret = format;
    ret = ret.replace(/YYYY/g, fullyear);
    ret = ret.replace(/YY/g, doubleyear);
    ret = ret.replace(/mm/g, doublemonth);
    ret = ret.replace(/m/g, month);
    ret = ret.replace(/dd/g, doubledate);
    ret = ret.replace(/d/g, date);
    ret = ret.replace(/hh/g, doublehours);
    ret = ret.replace(/h/g, hours);
    ret = ret.replace(/ii/g, doubleminues);
    ret = ret.replace(/i/g, minute);
    ret = ret.replace(/ss/g, doublesecond);
    ret = ret.replace(/s/g, second);
  }
  return ret;
}

export function getRandomStr(len) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// 系统黑暗模式偏好
export const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
  .matches;
