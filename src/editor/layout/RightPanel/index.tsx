import { FC, useCallback, Profiler, useMemo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/editor/components/ConfiguratorWrap';
import { useEditorState } from '@/editor/store/editor';
import { FoldPanel } from '@/editor/components/FoldPanel';
import { commandHistory } from '@/editor/core/CommandHistory';
import { DeleteWidgetCommand } from '@/editor/commands';
import { logger } from '@/common/Logger';

export const RightPanel: FC = () => {
  const { activeViewData } = useEditorState();

  const handleDeleteClick = useCallback(() => {
    if (!activeViewData) return;
    commandHistory.push(new DeleteWidgetCommand(activeViewData.id));
  }, [activeViewData]);

  const handleFunctionClick = useCallback(() => {
    console.log(activeViewData);
  }, [activeViewData]);

  const onRenderCallback = useCallback(
    (
      id, // 发生提交的 Profiler 树的 “id”
      phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
      actualDuration, // 本次更新 committed 花费的渲染时间
      baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
      startTime, // 本次更新中 React 开始渲染的时间
      commitTime, // 本次更新中 React committed 的时间
      interactions,
    ) => {
      console.log({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      });
    },
    [],
  );

  return useMemo(() => {
    if (!activeViewData) return null;
    logger.debug('render configurator list');

    const keys = Object.keys(activeViewData.configurators);
    const option = {
      title: '控制',
      component: (
        <Box p="8px">
          <div className="configurator-list">
            {keys.map((key) => {
              const configurator = activeViewData.configurators[key];
              if (configurator.hidden) return null;
              return (
                /**
                 * 单个组件渲染耗时过大依旧会生成 longtask
                 * 优化方向：编辑器载入时，就生成一遍各个配置组件
                 * 多个相同组件以数量下标来标记 key
                 */
                <ConfiguratorWrap
                  key={`${configurator.type}-${key}`}
                  configurator={configurator}
                />
              );
            })}
          </div>
          <Button size="xs" mt="8px" width="100%" onClick={handleDeleteClick}>
            删除
          </Button>
          <Button size="xs" mt="8px" width="100%" onClick={handleFunctionClick}>
            功能
          </Button>
        </Box>
      ),
    };
    return <FoldPanel panelList={[option]} name="right_panel" />;
  }, [activeViewData?.id]);
};
