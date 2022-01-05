import { FC, useCallback, useEffect, useMemo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useEditorState } from '@/store/editor';
import { FoldPanel } from '@/components/FoldPanel';
import { logger } from '@/core/Logger';
import { getRandomStr } from '@/utils';

export const RightPanel: FC = () => {
  const { activeViewData } = useEditorState();

  const handleDeleteClick = useCallback(() => {}, [activeViewData]);

  const handleFunctionClick = useCallback(() => {}, [activeViewData]);

  const handleKeyup = useCallback((e) => {
    if (e.keyCode === 13) e.target?.blur();
  }, []);

  useEffect(() => {}, []);

  /**
   * 单个组件渲染耗时过大依旧会造成 longtask
   * 优化方向：编辑器载入时，就生成一遍各个配置组件
   * 多个相同组件以数量下标来标记 key
   */
  if (!activeViewData) return null;

  logger.debug('render configurator list');

  const option = {
    title: '控制',
    component: (
      <Box p="8px">
        <div className="configurator-list" onKeyUp={handleKeyup}></div>
        <Button size="xs" mt="8px" width="100%" onClick={handleDeleteClick}>
          删除
        </Button>
        <Button size="xs" mt="8px" width="100%" onClick={handleFunctionClick}>
          添加
        </Button>
      </Box>
    ),
  };
  return <FoldPanel panelList={[option]} name="right_panel" />;
};
