/**
 * draggable polyfill
 */

export const dragData = {
  left: 0,
  top: 0,
};
export const offset = {
  x: 0,
  y: 0,
};
export const mouse = {
  x: 0,
  y: 0,
};

export namespace draggable {
  let fakeFixedElementWrap: HTMLElement | null = null;
  let dragElement: HTMLElement | null = null;
  let lastDropElement: Element | null = null;
  let axis = 'Y';
  let _axis = '';
  let drag_end = true;

  let previewImage = new Image();
  previewImage.src =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAAAAAFAAFkeJU4AAAAAElFTkSuQmCC';
  const styles = document.createElement('style');
  styles.textContent = `[dragging]{position:static!important;box-sizing:border-box!important;margin:0!important;} .fake-element{position:fixed;left:0;top:0;z-index:999;pointer-events:none;}`;
  document.querySelector('head')?.appendChild(styles);

  document.addEventListener('dragstart', function (ev) {
    if (!ev.target) return;
    if (!drag_end) return;

    drag_end = false;

    if ((<HTMLElement>ev.target).nodeType !== Node.ELEMENT_NODE) return;

    dragElement = <HTMLElement>ev.target;
    _axis = axis;
    ev.dataTransfer?.setData('text', '');
    ev.dataTransfer?.setDragImage(previewImage, 0, 0);
    const rect = dragElement.getBoundingClientRect();
    const left = rect.left;
    const top = rect.top;
    mouse.x = ev.clientX;
    mouse.y = ev.clientY;
    offset.x = mouse.x - left;
    offset.y = mouse.y - top;
    dragElement.style.transition = 'none';
    fakeFixedElementWrap = document.createElement('DIV');
    const fakeElement = dragElement.cloneNode(true) as HTMLElement;
    fakeElement.style.width = dragElement.offsetWidth + 'px';
    fakeElement.style.height = dragElement.offsetHeight + 'px';
    fakeElement.style.transform = 'translate3d(0,0,0)';
    fakeElement.setAttribute('dragging', '');
    fakeFixedElementWrap.appendChild(fakeElement);
    fakeFixedElementWrap.className = 'fake-element';
    fakeFixedElementWrap.setAttribute(
      'style',
      `transform : translate3d(${left}px,${top}px,0);`,
    );
    document.body.appendChild(fakeFixedElementWrap);
  });

  document.addEventListener('dragend', function (ev) {
    if (!fakeFixedElementWrap) return;

    const rect = (<HTMLElement>ev.target).getBoundingClientRect();
    const left = rect.left;
    const top = rect.top;
    const reset = fakeFixedElementWrap.animate(
      [
        { transform: fakeFixedElementWrap.style.transform },
        { transform: 'translate3d(' + left + 'px,' + top + 'px,0)' },
      ],
      {
        duration: 150,
        easing: 'ease-in-out',
      },
    );

    reset.onfinish = function () {
      document.body.removeChild(fakeFixedElementWrap!);
      fakeFixedElementWrap = null;
      dragData.left = 0;
      dragData.top = 0;
      dragElement!.style.visibility = 'visible';
      drag_end = true;
    };
  });

  document.addEventListener('drop', function (ev) {
    const dropElement = (<HTMLElement>ev.target).closest('[allowdrop]');
    ev.preventDefault();
    if (dropElement) {
      ev.stopPropagation();
      dropElement.removeAttribute('over');
    }
  });

  document.addEventListener('dragenter', function (ev) {
    if (lastDropElement) {
      lastDropElement.toggleAttribute('over', false);
    }
    const dropElement = (<HTMLElement>ev.target).closest('[allowdrop]'); // 获取最近的放置目标
    if (dropElement) {
      dropElement.toggleAttribute('over', true);
      lastDropElement = dropElement;
    }
  });

  document.addEventListener('dragover', function (ev) {
    ev.preventDefault();

    const dropElement = (<HTMLElement>ev.target).closest('[allowdrop]');

    ev.dataTransfer!.dropEffect = dropElement ? 'copy' : 'move';

    if (!fakeFixedElementWrap) return;

    dragElement!.style.visibility = 'hidden';

    let worldX = ~~(ev.clientX - offset.x);
    let worldY = ~~(ev.clientY - offset.y);

    if (ev.shiftKey || axis) {
      if (_axis === 'X') {
        worldY = ~~(mouse.y - offset.y);
      } else if (_axis === 'Y') {
        worldX = ~~(mouse.x - offset.x);
      } else {
        _axis =
          (~~Math.abs(ev.clientX - mouse.x) >
            ~~Math.abs(ev.clientY - mouse.y) &&
            'X') ||
          (~~Math.abs(ev.clientX - mouse.x) <
            ~~Math.abs(ev.clientY - mouse.y) &&
            'Y') ||
          '';
      }
    } else {
      _axis = '';
    }

    mouse.x = worldX + offset.x;
    mouse.y = worldY + offset.y;
    fakeFixedElementWrap.style.transform = `translate3d(${worldX}px, ${worldY}px, 0)`;
    dragData.left = worldX;
    dragData.top = worldY;
  });
}
