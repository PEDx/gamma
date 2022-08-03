import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import './drag';
import './sort';
import './style.scss';

const materials = [
  {
    name: 'element-base',
  },
  {
    name: 'element-button',
  },
  {
    name: 'element-image',
  },
  {
    name: 'element-container',
  },
  {
    name: 'element-container',
  },
  {
    name: 'element-container',
  },
];

const DropArea = () => {
  const element = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    element.current?.setAttribute('allowdrop', '');
  }, []);
  return <div className="drop-area" ref={element}></div>;
};

export const Material = () => {
  const elements = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    elements.current.forEach((node, idx) => {
      node.addEventListener('dragstart', (ev) => {});
      node.addEventListener('dragend', () => {});
    });
  }, []);

  return (
    <Box>
      {materials.map((element, idx) => (
        <div
          className="material"
          key={idx}
          data-index={idx}
          draggable="true"
          ref={(node) => (elements.current[idx] = node!)}
        >
          {idx} - {element.name}
          <div className="col-line"></div>
          <div className="row-line"></div>
        </div>
      ))}
      <DropArea />
    </Box>
  );
};
