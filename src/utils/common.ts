// 给定值和排序好的数组,找到距离值最近两边的数组值
export function binarySearchRange<T>(array: T[], left: number, right: number, value: T): T[] {
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
  return []
}

export function binarySearchSidesValue<T>(array: T[], value: T) {
  return binarySearchRange<T>(array, 0, array.length - 1, value);
}

// const arr = [100, 123, 123, 133, 234, 234, 235, 235, 256, 300, 400, 500, 600];
// console.log(binarySearchSidesValue(arr, 130));


export const storage = {
  set: function <T>(variable: string, value: T, ttl_ms?: number | Date) {
    const time = ttl_ms ? new Date(ttl_ms).getTime() : null
    const data = { value: value, expires_at: time };
    localStorage.setItem(variable.toString(), JSON.stringify(data));
  },
  get: function <T>(variable: string) {
    const data = JSON.parse(localStorage.getItem(variable.toString()) || '');
    if (data !== null) {
      if (data.expires_at !== null && data.expires_at < new Date().getTime()) {
        localStorage.removeItem(variable.toString());
      } else {
        return data.value as T;
      }
    }
    return null;
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
};


export function scaleLoop(callback: (arg: (gap: number) => void) => void) {
  const next = (gap: number) => {
    setTimeout(callback, gap);
  };
  callback(next);
}
export const isIphonex = () =>
  /iphone/gi.test(navigator.userAgent) &&
  window.screen &&
  window.screen.height >= 812;

export function getQueryString(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const sch = window.location.href.split('?')[1] || '';
  const r = sch.match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

export function couponValueTime(startDate: number, valueTime: number) {
  const date = new Date(startDate);
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + valueTime
  );
  const year2 = newDate.getFullYear();
  const month2 = newDate.getMonth() + 1;
  const day2 = newDate.getDate();
  return `${year2}-${month2}-${day2}`;
}
export function tenThousand(num: number) {
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
export function parseTime(str: string, format: string) {
  const _str = parseInt(str);
  let D = isNaN(_str) ? new Date() : new Date(_str);

  let ret = '';
  if (D && !isNaN(D.getTime())) {
    const fullyear = D.getFullYear();
    const month = D.getMonth() + 1;
    const date = D.getDate();
    const hours = D.getHours();
    const minute = D.getMinutes();
    const second = D.getSeconds();
    const doublemonth = month > 9 ? month : '0' + month;
    const doubledate = date > 9 ? date : '0' + date;
    const doubleyear = fullyear.toString().substr(2);
    const doublehours = hours > 9 ? hours : '0' + hours;
    const doubleminues = minute > 9 ? minute : '0' + minute;
    const doublesecond = second > 9 ? second : '0' + second;
    ret = format;
    ret = ret.replace(/YYYY/g, fullyear.toString());
    ret = ret.replace(/YY/g, doubleyear);
    ret = ret.replace(/mm/g, doublemonth.toString());
    ret = ret.replace(/m/g, month.toString());
    ret = ret.replace(/dd/g, doubledate.toString());
    ret = ret.replace(/d/g, date.toString());
    ret = ret.replace(/hh/g, doublehours.toString());
    ret = ret.replace(/h/g, hours.toString());
    ret = ret.replace(/ii/g, doubleminues.toString());
    ret = ret.replace(/i/g, minute.toString());
    ret = ret.replace(/ss/g, doublesecond.toString());
    ret = ret.replace(/s/g, second.toString());
  }
  return ret;
}

export function getRandomStr(len: number) {
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
