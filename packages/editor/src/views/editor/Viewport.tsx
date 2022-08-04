import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { sortable } from './sort';
import { addible } from './add';
import { move, getRandomStr } from './utils';
import { useForceRender } from '@/hooks/useForceRender';

const nodeList = [
  {
    name: 'node-base',
    height: 50,
    id: getRandomStr(8),
  },
  {
    name: 'node-button',
    height: 80,
    id: getRandomStr(8),
  },
  {
    name: 'node-image',
    height: 120,
    id: getRandomStr(8),
  },
  {
    name: 'node-container1',
    height: 240,
    id: getRandomStr(8),
  },
  {
    name: 'node-container2',
    height: 140,
    id: getRandomStr(8),
  },
  {
    name: 'node-base',
    height: 50,
    id: getRandomStr(8),
  },
  {
    name: 'node-button',
    height: 80,
    id: getRandomStr(8),
  },
  {
    name: 'node-container3',
    height: 360,
    id: getRandomStr(8),
  },
  {
    name: 'node-base',
    height: 50,
    id: getRandomStr(8),
  },
  {
    name: 'node-button',
    height: 80,
    id: getRandomStr(8),
  },
  {
    name: 'node-base',
    height: 50,
    id: getRandomStr(8),
  },
  {
    name: 'node-button',
    height: 80,
    id: getRandomStr(8),
  },
  {
    name: 'node-container3',
    height: 360,
    id: getRandomStr(8),
  },
  {
    name: 'node-button',
    height: 80,
    id: getRandomStr(8),
  },
  {
    name: 'node-base',
    height: 50,
    id: getRandomStr(8),
  },
  {
    name: 'node-button',
    height: 80,
    id: getRandomStr(8),
  },
];

export const Viewport = () => {
  const render = useForceRender();
  const nodes = useRef(nodeList);
  const viewport = useRef<HTMLDivElement | null>(null);
  const elements = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    console.log('useEffect');

    sortable.onSortEnd = (idx1, idx2) => {
      nodes.current = move(idx1, idx2, nodes.current);
      render();
    };
  }, []);

  return (
    <Box
      className="viewport"
      ref={(node) => {
        if (node) addible.initNode(node);
      }}
    >
      {nodes.current.map((node, idx) => (
        <div
          className="instance"
          key={node.id}
          draggable={true}
          data-draggable-sortable={true}
          data-draggable-axis={'Y'}
          data-draggable-show={false}
          style={{
            height: `${node.height}px`,
          }}
          ref={(node) => (elements.current[idx] = node!)}
        >
          {node.name}
          <div className="col-line"></div>
          <div className="row-line"></div>
        </div>
      ))}
    </Box>
  );
};
