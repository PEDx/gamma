import { debounce } from 'lodash';

export function joinClassName(classNameArr: string[]) {
  return classNameArr.join(' ');
}

export function preventDefaultHandler(e: Event): void {
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }
}

export function clearClassName(node: Element, name: string) {
  return node.classList.remove(name);
}

export function observerStyle(callback: (list: HTMLElement[]) => void) {
  let list: HTMLElement[] = [];
  // 一次性添加完
  const addStyle = debounce(function () {
    callback(list);
    list = [];
  }, 30);
  // 为实现自定义控制器, 传递 iframe 样式给顶层 window
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((val) => {
      const styleTarget = val.target as HTMLElement;
      const styleTargetName = styleTarget.tagName;
      if (styleTargetName === 'STYLE') {
        list.push(styleTarget);
        addStyle();
      }
    });
  });
  mutationObserver.observe(document.head, {
    characterData: true,
    childList: true,
    attributes: true,
    subtree: true,
  });
}
