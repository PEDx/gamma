import { FC, useCallback, useEffect, useRef, useState } from 'react';
import './style.scss';
import { Editable } from '@/class/Editable';
import { DIRECTIONS } from '@/utils';

const Test: FC = () => {
  const [selectElement, setSelectElement] = useState<Element>();
  const element = useRef<HTMLDivElement>(null);
  const editable = useRef<Editable | null>(null);
  useEffect(() => {
    const elements = document.getElementsByClassName('m-box');
    const arr = Array.from(elements);
    arr.forEach((node) => {
      const ed_node = new Editable({
        element: node as HTMLElement,
        distance: 10,
        effect: (rect) => {
          console.log(rect);
        },
      });
      node.addEventListener('mousedown', (e) => {
        arr.forEach((ele) => {
          ele.classList.remove('m-box-active');
        });
        const node = e.target as HTMLElement;
        node.classList.add('m-box-active');
        setSelectElement(node);
        editable.current = ed_node;
        ed_node.setShadowElement(element.current!);
        e.stopPropagation();
        e.preventDefault();
      });
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
        <div className="edit-box" ref={element} onMouseDown={handleMousedown}>
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
      <div className="root-container">
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
