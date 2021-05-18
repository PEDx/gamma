import { FC, useCallback, useEffect, useRef, useState } from 'react';
import './style.scss';
import { Editable } from '@/class/Editable';
import { ViewData } from '@/class/ViewData';
import { DIRECTIONS } from '@/utils';

const clearClassName = (node: Element, name: string) => {
  return node.classList.remove(name);
};

const ACTIVE_CLASSNAME = 'm-box-active';

const Test: FC = () => {
  const [editBoxShow, setEditBoxShow] = useState<Boolean>(true);
  const element = useRef<HTMLDivElement>(null);
  const editBoxLayer = useRef<HTMLDivElement>(null);
  const rootContainer = useRef<HTMLDivElement>(null);

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

    arr.forEach((element) => new ViewData({ element: element as HTMLElement }));

    const clearActive = () => {
      setEditBoxShow(false);
      clearClassName(rootContainer.current!, ACTIVE_CLASSNAME);
      arr.forEach((ele) => clearClassName(ele, ACTIVE_CLASSNAME));
    };
    clearActive();
    document.addEventListener('mousedown', (e) => {
      clearActive();
      const activeNode = e.target as HTMLElement;
      if (
        rootContainer.current?.contains(activeNode) &&
        rootContainer.current !== activeNode
      ) {
        setEditBoxShow(true);
        activeNode.classList.add(ACTIVE_CLASSNAME);
        ed_node.setShadowElement(activeNode, e);
      }
    });

    editBoxLayer.current?.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });

    element.current?.addEventListener('mousedown', (e) => {
      const _direction = (e.target as HTMLDivElement).dataset.direction || '';
      if (!_direction || !ed_node) return;
      const direction = parseInt(_direction);
      ed_node.setDirection(direction as DIRECTIONS);
    });
  }, []);

  return (
    <div className="test">
      <div className="edit-box-layer" ref={editBoxLayer}>
        <div
          className="edit-box"
          ref={element}
          style={{
            display: editBoxShow ? 'block' : 'none',
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
