export default function importScript(url: string) {
  // @ts-ignore
  const defineTemp = window.define; // 将 window 下的 define 方法暂存起来。
  // @ts-ignore
  window.define = (depends: string[], func: Function) => {
    // 自定义 define 方法，
    console.log(depends);
    console.log(func);
  };
  // @ts-ignore
  window.define.amd = true; // 伪装成 amd 的 define。
  return new Promise(function (resolve, reject) {
    const el = document.createElement('script'); // 创建 script 元素
    el.src = url;
    el.async = false; // 保持时序
    const loadCallback = function () {
      // 加载完成之后处理
      el.removeEventListener('load', loadCallback);
      // @ts-ignore
      window.define = defineTemp;
      resolve(null);
    };
    const errorCallback = function () {
      // 加载失败之后处理
      el.removeEventListener('error', errorCallback);
      // @ts-ignore
      window.define = defineTemp;
      var error = new Error('Load javascript failed. src=' + url);
      reject(error);
    };
    el.addEventListener('load', loadCallback); // 绑定事件
    el.addEventListener('error', errorCallback); // 绑定事件
    document.body.appendChild(el); // 插入元素
  });
}

export class UMDLoader {
  constructor() {}
}
