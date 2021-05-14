import { FC, useCallback, useEffect, useRef, useState } from 'react';
import './style.scss';
import { Editable } from '@/class/Editable';
import { DIRECTIONS } from '@/utils';

const Test: FC = () => {
  const [selectElement, setSelectElement] = useState<Element>();
  const element = useRef<HTMLDivElement>(null);
  const rootContainer = useRef<HTMLDivElement>(null);
  const editable = useRef<Editable | null>(null);
  useEffect(() => {
    const ed_node = new Editable({
      element: element.current as HTMLElement,
      distance: 10,
      effect: (rect) => {
        console.log(rect);
      },
    });
    const elements = document.getElementsByClassName('m-box');
    const arr = Array.from(elements);

    const clearActive = () => {
      arr.forEach((ele) => {
        ele.classList.remove('m-box-active');
      });
    };
    arr.forEach((node) => {
      node.addEventListener('mousedown', (e) => {
        clearActive();
        const node = e.target as HTMLElement;
        node.classList.add('m-box-active');
        setSelectElement(node);
        editable.current = ed_node;
        ed_node.setShadowElement(node);
        e.preventDefault();
      });
    });
    document.addEventListener('mousedown', (e) => {
      const node = e.target as HTMLElement;
      if (!rootContainer.current?.contains(node)) {
        clearActive();
      }
    });
  }, []);
  useEffect(() => {
    if (!selectElement) return;
  }, [selectElement]);
  const handleMousedown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e: any) => {
      const _direction = (e.target as HTMLDivElement).dataset.direction || '';
      if (!_direction || !editable.current) return;
      const direction = parseInt(_direction);
      editable.current.setDirection(direction as DIRECTIONS);
    },
    [editable],
  );

  return (
    <div className="test">
      <div className="edit-box-layer">
        <div
          className="edit-box"
          ref={element}
          onMouseDown={handleMousedown}
          style={{
            display: 'none',
          }}
        >
          <i
            className="arrow-handler corner top-left-arrow-handler"
            data-direction={DIRECTIONS.L | DIRECTIONS.T}
          />
          <i
            className="arrow-handler corner bottom-left-arrow-handler"
            data-direction={DIRECTIONS.L | DIRECTIONS.B}
          />
          <i
            className="arrow-handler corner top-right-arrow-handler"
            data-direction={DIRECTIONS.T | DIRECTIONS.R}
          />
          <i
            className="arrow-handler corner bottom-right-arrow-handler"
            data-direction={DIRECTIONS.B | DIRECTIONS.R}
          />
          <i
            className="arrow-handler top-arrow-handler"
            data-direction={DIRECTIONS.T}
          />
          <i
            className="arrow-handler left-arrow-handler"
            data-direction={DIRECTIONS.L}
          />
          <i
            className="arrow-handler bottom-arrow-handler"
            data-direction={DIRECTIONS.B}
          />
          <i
            className="arrow-handler right-arrow-handler"
            data-direction={DIRECTIONS.R}
          />
        </div>
      </div>
      <div className="root-container" ref={rootContainer}>
        <div className="m-box-01 m-box">
          <div className="m-box-02 m-box">
            <div className="m-box-03 m-box"></div>
          </div>
          <div className="m-box-02 m-box"></div>
        </div>
      </div>
    </div>
  );
};

export default Test;
