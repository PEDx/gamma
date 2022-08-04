export const swap = <T>(idx1: number, idx2: number, array: T[]) => {
  const t = array[idx1];
  array[idx1] = array[idx2];
  array[idx2] = t;
  return [...array];
};
export const move = <T>(idx1: number, idx2: number, array: T[]) => {
  const arr = [...array];
  const item = arr.splice(idx1, 1)[0];
  arr.splice(idx2, 0, item);
  return [...arr];
};

export const insertAfter = (newEl: Element, targetEl: Element) => {
  const parentEl = targetEl.parentNode;
  if (!parentEl) return;

  if (parentEl.lastChild == targetEl) {
    parentEl.appendChild(newEl);
  } else {
    parentEl.insertBefore(newEl, targetEl.nextSibling);
  }
};

export function getRandomStr(len: number): string {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
