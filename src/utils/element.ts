export function findEditableNode(node: HTMLElement) {
  let parent = node || null;
  let editableNode = null;
  do {
    if (parent.dataset && parent.dataset.editable) {
      editableNode = parent;
      break;
    }
  } while ((parent = parent.parentNode as HTMLElement));
  return editableNode;
}

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
