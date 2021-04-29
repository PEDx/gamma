import { FC, useCallback, useEffect, useRef } from 'react';
import './style.scss';
import { Editable } from '@/class/Editable';
import { DIRECTIONS } from '@/utils';

const Test: FC = () => {
  const element = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const editable = useRef<Editable | null>(null);
  useEffect(() => {
    if (!container.current || !element.current) return;
    editable.current = new Editable({
      element: element.current as HTMLElement,
      container: container.current as HTMLElement,
      distance: 10,
      effect: (rect) => {
        console.log(rect);
      },
    });
  }, [element, container]);
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
      <div className="overtop-conainer" ref={container}>
        <div className="test-box" ref={element} onMouseDown={handleMousedown}>
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
    </div>
  );
};

export default Test;
