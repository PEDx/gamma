const previewImage = new Image();
previewImage.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAAAAAFAAFkeJU4AAAAAElFTkSuQmCC';
const styles = document.createElement('style');
styles.textContent = `[dragging]{position:static!important;box-sizing:border-box!important;margin:0!important;} .fake-element{position:fixed;left:0;top:0;z-index:999;pointer-events:none;}`;
document.querySelector('head')?.appendChild(styles);

export interface IDraggableOption {
  axis: 'X' | 'Y' | '';
  dragShow: boolean;
  disable: boolean;
}
export interface IPosition {
  x: number;
  y: number;
}
const zeroPos = {
  x: 0,
  y: 0,
};

export class Draggable {
  private node: HTMLElement;
  private fake: HTMLElement | null = null;
  private option: IDraggableOption;
  private mouse: IPosition = {
    ...zeroPos,
  };
  private offset: IPosition = {
    ...zeroPos,
  };
  private dragging: boolean;
  private _axis = '';
  constructor(node: HTMLElement, option?: IDraggableOption) {
    this.node = node;
    this.node.draggable = true;
    this.dragging = false;
    this.option = { axis: '', dragShow: false, disable: false, ...option };
    this.init();
  }
  init() {
    this.node.addEventListener('dragstart', this.handleDragstart);
    this.node.addEventListener('dragover', this.handleDragover);
    this.node.addEventListener('dragend', this.handleDragend);
  }
  destory() {
    this.node.removeEventListener('dragstart', this.handleDragstart);
    this.node.removeEventListener('dragover', this.handleDragover);
    this.node.removeEventListener('dragend', this.handleDragend);
  }
  protected handleDragstart = (ev: DragEvent) => {
    if (this.dragging) return;

    console.log('_axis');

    const node = this.node;

    ev.dataTransfer?.setData('text', '');
    ev.dataTransfer?.setDragImage(previewImage, 0, 0);
    const rect = node.getBoundingClientRect();
    const left = rect.left;
    const top = rect.top;

    this.mouse.x = ev.clientX;
    this.mouse.y = ev.clientY;
    this.offset.x = this.mouse.x - left;
    this.offset.y = this.mouse.y - top;

    node.style.transition = 'none';
    this.fake = document.createElement('DIV');
    const fakeElement = node.cloneNode(true) as HTMLElement;
    fakeElement.style.width = node.offsetWidth + 'px';
    fakeElement.style.height = node.offsetHeight + 'px';
    fakeElement.style.transform = 'translate3d(0,0,0)';
    fakeElement.setAttribute('dragging', '');
    this.fake.appendChild(fakeElement);
    this.fake.className = 'fake-element';
    this.fake.setAttribute(
      'style',
      `transform : translate3d(${left}px,${top}px,0);`,
    );
    document.body.appendChild(this.fake);

    this.dragging = true;
  };
  protected handleDragover = (ev: DragEvent) => {
    ev.preventDefault();

    const dropElement = (<HTMLElement>ev.target).closest('[allowdrop]');

    ev.dataTransfer!.dropEffect = dropElement ? 'copy' : 'move';

    if (!this.fake) return;

    this.node.style.visibility = 'hidden';

    let worldX = ~~(ev.clientX - this.offset.x);
    let worldY = ~~(ev.clientY - this.offset.y);

    if (ev.shiftKey || this.option.axis) {
      if (this._axis === 'X') {
        worldY = ~~(this.mouse.y - this.offset.y);
      } else if (this._axis === 'Y') {
        worldX = ~~(this.mouse.x - this.offset.x);
      } else {
        this._axis =
          (~~Math.abs(ev.clientX - this.mouse.x) >
            ~~Math.abs(ev.clientY - this.mouse.y) &&
            'X') ||
          (~~Math.abs(ev.clientX - this.mouse.x) <
            ~~Math.abs(ev.clientY - this.mouse.y) &&
            'Y') ||
          '';
      }
    } else {
      this._axis = '';
    }

    this.mouse.x = worldX + this.offset.x;
    this.mouse.y = worldY + this.offset.y;
    this.fake.style.transform = `translate3d(${worldX}px, ${worldY}px, 0)`;
  };

  protected handleDragend = (ev: DragEvent) => {
    if (!this.fake) return;

    const rect = (<HTMLElement>ev.target).getBoundingClientRect();
    const left = rect.left;
    const top = rect.top;
    const reset = this.fake.animate(
      [
        { transform: this.fake.style.transform },
        { transform: 'translate3d(' + left + 'px,' + top + 'px,0)' },
      ],
      {
        duration: 150,
        easing: 'ease-in-out',
      },
    );

    reset.onfinish = () => {
      if (!this.fake) return;
      document.body.removeChild(this.fake);
      this.fake = null;
      this.node.style.visibility = 'visible';
      this.dragging = false;
    };
  };
}
