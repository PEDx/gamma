export const findEditableNode = (node) => {
  let parent = node;
  let editableNode = null;
  do {
    if (parent.dataset && parent.dataset.editable) {
      editableNode = parent;
      break;
    }
  } while ((parent = parent.parentNode));
  return editableNode;
};

export const joinClassName = (classNameArr) => classNameArr.join(' ');
