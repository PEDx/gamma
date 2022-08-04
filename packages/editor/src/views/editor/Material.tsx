import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import './drag';
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

export const Material = () => {
  const elements = useRef<HTMLDivElement[]>([]);

  useEffect(() => {}, []);

  return (
    <Box>
      {materials.map((element, idx) => (
        <div
          className="material"
          key={idx}
          draggable="true"
          data-draggable-show={true}
          ref={(node) => (elements.current[idx] = node!)}
        >
          {idx} - {element.name}
          <div className="col-line"></div>
          <div className="row-line"></div>
        </div>
      ))}
    </Box>
  );
};
