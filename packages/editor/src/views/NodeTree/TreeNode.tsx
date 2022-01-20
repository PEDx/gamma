import { Box } from '@chakra-ui/react';
import { MAIN_COLOR } from '@/color';
import { useEffect, useContext, useRef } from 'react';
import { DragItem, DragType } from '@/core/DragAndDrop/DragItem';
import { NodeTreeContext } from './index';
import { Editor } from '@/core/Editor';

interface ITreeNodeProps {
  level: number;
  id?: string | null;
}

export function TreeNode(props: ITreeNodeProps) {
  const element = useRef<HTMLDivElement>(null);
  const { level, id } = props;
  const { hightlightId, activeId, onClick, onMouseout, onMousoover } =
    useContext(NodeTreeContext);

  useEffect(() => {
    if (!element.current) return;
    new DragItem({
      node: element.current,
      type: DragType.node,
      data: id,
    });
  }, []);

  if (!id) return null;
  const node = Editor.runtime.getViewNodeByID(id);
  if (!node) return null;
  const children: string[] = node.children;
  const select = id === activeId;
  const hover = id === hightlightId;
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Box
        ref={element}
        cursor="pointer"
        _hover={{
          outline: `1px dashed ${MAIN_COLOR}`,
        }}
        outline={hover ? `1px dashed ${MAIN_COLOR}` : ''}
        bgColor={select ? 'rgba(255, 122, 71, 0.3)' : ''}
        p="4px"
        onClick={() => onClick && onClick(id)}
        onMouseOver={() => onMousoover && onMousoover(id)}
        onMouseOut={() => onMouseout && onMouseout(id)}
        color={node.suspend ? 'rgba(255, 122, 71, 0.4)' : ''}
      >
        {node.meta.name}
      </Box>
      {children.map((childId, idx) => {
        return (
          <Box ml="10px" key={id + idx}>
            <TreeNode level={level + 1} id={childId}></TreeNode>
          </Box>
        );
      })}
    </Box>
  );
}
