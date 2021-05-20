
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
