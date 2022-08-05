export namespace addible {
  let element: HTMLElement;
  export const initNode = (node: HTMLElement) => {
    element = node;
    element.addEventListener('dragenter', (e) => {
      // console.log(e.clientY);
    });
  };
}
