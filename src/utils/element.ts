export const findEditableNode = (node: HTMLElement) => {
  let parent = node || null;
  let editableNode = null;
  do {
    if (parent.dataset && parent.dataset.editable) {
      editableNode = parent;
      break;
    }
  } while ((parent = parent.parentNode as HTMLElement));
  return editableNode;
};

export const joinClassName = (classNameArr: string[]) => classNameArr.join(' ');
