import { offset } from './drag';

export const start = {
  x: 0,
  y: 0,
};
export const distance = {
  x: 0,
  y: 0,
};
export const translate = {
  bottom: 0,
  top: 0,
};

export const edges: { x: number; y: number }[] = [];

export namespace sortable {
  let sortElement: HTMLCollection | undefined;
  let dragElement: HTMLElement | null = null;
  let dragIndex = 0;

  document.addEventListener('dragstart', function (ev) {
    if (!ev.target) return;

    if ((<HTMLElement>ev.target).nodeType !== Node.ELEMENT_NODE) return;

    dragElement = <HTMLElement>ev.target;
    dragIndex = +(dragElement.dataset.index || 0);

    sortElement = dragElement.parentElement?.children;

    if (!sortElement) return;

    for (let index = 0; index < sortElement.length; index++) {
      const element = sortElement[index] as HTMLElement;
      element.style.transform = 'translate3d(0,0,0)';
      element.style.transition = 'transform .2s ease';

      let _y = 0;
      let _x = 0;

      if (index > dragIndex) {
        _y =
          element.offsetTop -
          dragElement.offsetTop -
          dragElement.offsetHeight +
          element.offsetHeight / 2;
        _x =
          element.offsetLeft -
          dragElement.offsetLeft -
          dragElement.offsetWidth +
          element.offsetWidth / 2;
      }
      if (index < dragIndex) {
        _y =
          element.offsetTop - dragElement.offsetTop + element.offsetHeight / 2;
        _x =
          element.offsetLeft - dragElement.offsetLeft + element.offsetWidth / 2;
      }

      edges[index] = {
        x: _x,
        y: _y,
      };
    }

    start.x = ev.clientX;
    start.y = ev.clientY;

    if (dragElement && dragElement.nextSibling) {
      translate.bottom =
        (dragElement.nextSibling as HTMLElement).offsetTop -
        dragElement.offsetTop;
    }

    if (dragElement && dragElement.previousSibling) {
      translate.top =
        dragElement.offsetTop -
        (dragElement.previousSibling as HTMLElement).offsetTop -
        (dragElement.previousSibling as HTMLElement).offsetHeight +
        dragElement.offsetHeight;
    }
  });

  document.addEventListener('dragover', function (ev) {
    ev.preventDefault();

    distance.x = ev.clientX - start.x;
    distance.y = ev.clientY - start.y;

    for (let index = 0; index < sortElement!.length; index++) {
      const element = sortElement![index] as HTMLElement;
      const edge = edges[index];
      if (distance.y > edge.y) {
        if (index > dragIndex) {
          element.style.transform = `translate3d(${0}px,-${
            translate.bottom
          }px,0)`;
        }
        if (index < dragIndex) {
          element.style.transform = `translate3d(0px,0px,0)`;
        }
      }

      if (distance.y < edge.y) {
        if (index < dragIndex) {
          element.style.transform = `translate3d(${0}px,${translate.top}px,0)`;
        }
        if (index > dragIndex) {
          element.style.transform = `translate3d(0px,0px,0)`;
        }
      }
    }
  });

  document.addEventListener('dragend', function (ev) {
    for (let index = 0; index < sortElement!.length; index++) {
      const element = sortElement![index] as HTMLElement;
      const edge = edges[index];
      element.style.transform = `translate3d(0px,0px,0)`;
    }
  });

  const computeElementOffset = () => {};
}
