const blackImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

export function createEmptyBox() {
  const element = document.createElement('DIV');
  element.classList.add('m-box');
  element.classList.add('m-box-empty-box');
  return element;
}
export function createText() {
  const element = document.createElement('SPAN');
  element.classList.add('m-box');
  element.classList.add('m-box-text');
  element.textContent = '请输入文字';
  return element;
}
export function createImage() {
  const outElement = createEmptyBox();
  const element = document.createElement('IMG') as HTMLImageElement;
  element.classList.add('m-box-image');
  element.src = blackImage;
  outElement.appendChild(element);
  return outElement;
}
