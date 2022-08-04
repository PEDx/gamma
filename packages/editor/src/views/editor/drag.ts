/**
 * draggable
 */

export namespace draggable {
  export let fakeElement: HTMLElement | null = null;
  let lastDropElement: Element | null = null;
  let dragElement: HTMLElement | null = null;
  let dragging = false;

  const mouse = {
    x: 0,
    y: 0,
  };
  const offset = {
    x: 0,
    y: 0,
  };

  let _axis = '';
  let _draggableShow = false;

  let previewImage = new Image();
  previewImage.src =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAAAAAFAAFkeJU4AAAAAElFTkSuQmCC';
  const styles = document.createElement('style');
  styles.textContent = `[dragging]{position:static!important;box-sizing:border-box!important;margin:0!important;} .fake-element{position:fixed;left:0;top:0;z-index:999;pointer-events:none;}`;
  document.querySelector('head')?.appendChild(styles);

  document.addEventListener('dragstart', function (ev) {
    if (dragging) return;
    dragging = true;

    const node = ev.target as HTMLElement;

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    _draggableShow = node.dataset.draggableShow === 'true';
    _axis = node.dataset.draggableAxis || '';

    dragElement = node;

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
    fakeElement = document.createElement('DIV');
    const element = dragElement.cloneNode(true) as HTMLElement;
    element.style.width = dragElement.offsetWidth + 'px';
    element.style.height = dragElement.offsetHeight + 'px';
    element.style.transform = 'translate3d(0,0,0)';
    element.setAttribute('dragging', '');
    fakeElement.appendChild(element);
    fakeElement.className = 'fake-element';
    fakeElement.setAttribute(
      'style',
      `transform : translate3d(${left}px,${top}px,0);`,
    );
    document.body.appendChild(fakeElement);
  });

  export const claerFakeFixedElementWrap = () => {
    document.body.removeChild(fakeElement!);
    fakeElement = null;
    dragElement!.style.visibility = 'visible';
    dragging = false;
  };

  document.addEventListener('dragover', function (ev) {
    ev.preventDefault();

    const dropElement = (<HTMLElement>ev.target).closest('[allowdrop]');

    ev.dataTransfer!.dropEffect = dropElement ? 'copy' : 'move';

    if (!fakeElement) return;

    if (!_draggableShow) dragElement!.style.visibility = 'hidden';

    let worldX = ~~(ev.clientX - offset.x);
    let worldY = ~~(ev.clientY - offset.y);

    if (_axis === 'X') {
      worldY = ~~(mouse.y - offset.y);
    }
    if (_axis === 'Y') {
      worldX = ~~(mouse.x - offset.x);
    }

    mouse.x = worldX + offset.x;
    mouse.y = worldY + offset.y;
    fakeElement.style.transform = `translate3d(${worldX}px, ${worldY}px, 0)`;
  });

  document.addEventListener('dragend', function (ev) {
    if (_draggableShow) claerFakeFixedElementWrap();
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
}
