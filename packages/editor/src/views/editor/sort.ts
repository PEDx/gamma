import { draggable } from './drag';
import { insertAfter } from './utils';

export namespace sortable {
  let sortElements: HTMLCollection | undefined;
  let dragElement: HTMLElement | null = null;
  let containerElement: HTMLElement | null = null;
  let srcIndex = 0;
  let destIndex = 0;
  let _sortable = false;
  let _scroll = false;

  const start = {
    x: 0,
    y: 0,
    scrollTop: 0,
  };
  const distance = {
    x: 0,
    y: 0,
  };
  const translate = {
    bottom: 0,
    top: 0,
  };

  const edges: { x: number; y: number }[] = [];
  const rects: DOMRect[] = [];

  const translateZero = 'translate3d(0,0,0)';

  document.addEventListener('dragstart', function (ev) {
    if (!ev.target) return;
    const node = ev.target as HTMLElement;

    _sortable = node.dataset.draggableSortable === 'true';

    if (!_sortable) return;

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    dragElement = node;

    containerElement = dragElement.parentElement;

    if (!containerElement) return;

    sortElements = containerElement.children;

    _scroll = containerElement.scrollHeight > containerElement.clientHeight;

    if (!sortElements) return;

    for (let index = 0; index < sortElements.length; index++) {
      const element = sortElements[index] as HTMLElement;
      if (element === dragElement) srcIndex = index;
    }

    for (let index = 0; index < sortElements.length; index++) {
      const element = sortElements[index] as HTMLElement;
      element.style.transform = translateZero;
      element.style.transition = 'transform .2s ease';

      let _y = 0;
      let _x = 0;

      if (index > srcIndex) {
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
      if (index < srcIndex) {
        _y =
          element.offsetTop - dragElement.offsetTop + element.offsetHeight / 2;
        _x =
          element.offsetLeft - dragElement.offsetLeft + element.offsetWidth / 2;
      }

      edges[index] = {
        x: _x,
        y: _y,
      };
      rects[index] = element.getBoundingClientRect();
    }

    start.x = ev.clientX;
    start.y = ev.clientY;
    start.scrollTop = containerElement.scrollTop;

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
    if (!_sortable) return;

    ev.preventDefault();

    const scrollTop = containerElement?.scrollTop || 0;

    distance.x = ev.clientX - start.x;
    distance.y = ev.clientY - start.y + scrollTop - start.scrollTop;

    destIndex = srcIndex;

    for (let index = 0; index < sortElements!.length; index++) {
      const element = sortElements![index] as HTMLElement;
      const edge = edges[index];

      // 从上往下拖动
      if (distance.y > edge.y) {
        if (index > srcIndex) {
          element.style.transform = `translate3d(${0}px,-${
            translate.bottom
          }px,0)`;
          destIndex = index;
        }
        if (index < srcIndex) {
          element.style.transform = translateZero;
        }
      }

      // 从下往上拖动
      if (distance.y < edge.y) {
        if (index < srcIndex) {
          element.style.transform = `translate3d(${0}px,${translate.top}px,0)`;
          if (index < destIndex) destIndex = index;
        }
        if (index > srcIndex) {
          element.style.transform = translateZero;
        }
      }
    }

    // 自动滚动
    if (!_scroll) return;

  });

  document.addEventListener('dragend', function (ev) {
    if (!_sortable) return;

    let top = 0;
    let left = 0;
    /**
     * 从下往上拖动后，坐标就是目的元素位置的原始坐标
     */
    const scrollTop = containerElement?.scrollTop || 0;
    top = rects[destIndex].top + start.scrollTop - scrollTop;
    left = rects[destIndex].left;

    /**
     * 从上往下拖动后，坐标需要计算
     */
    if (srcIndex < destIndex) {
      const ele = sortElements![destIndex];
      top = ele.getBoundingClientRect().bottom;
    }

    const reset = draggable.fakeElement?.animate(
      [
        { transform: draggable.fakeElement.style.transform },
        { transform: `translate3d(${left}px,${top}px,0)` },
      ],
      {
        duration: 150,
        easing: 'ease-in-out',
      },
    );

    if (!reset) return;

    reset.onfinish = () => {
      if (!draggable.fakeElement) return;

      draggable.fakeElement.style.transform = `translate3d(${left}px,${top}px,0)`;
      draggable.claerFakeFixedElementWrap();

      for (let index = 0; index < sortElements!.length; index++) {
        const element = sortElements![index] as HTMLElement;
        element.style.transition = 'none';
        element.style.transform = translateZero;
      }

      /**
       * 移动真实 dom
       * 防止交换 react 数据层引起的位置闪动
       * */

      const srcNode = sortElements![srcIndex];
      const destNode = sortElements![destIndex];

      if (destIndex > srcIndex) {
        insertAfter(srcNode, destNode);
      } else {
        if (destNode.parentNode)
          destNode.parentNode.insertBefore(srcNode, destNode);
      }

      // console.log(`${srcIndex} => ${destIndex}`);
      onSortEnd(srcIndex, destIndex);
    };
  });

  export let onSortEnd: (src_idx: number, dist_idx: number) => void = () => {};
}
