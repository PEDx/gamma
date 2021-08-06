import { FC, useCallback, useMemo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Parallel } from '@/editor/components/ConfiguratorWrap/Layout/Parallel';
import { LeftRight } from '@/editor/components/ConfiguratorWrap/Layout/LeftRight';
import { TopDown } from '@/editor/components/ConfiguratorWrap/Layout/TopDown';
import { useEditorState } from '@/editor/store/editor';
import { FoldPanel } from '@/editor/components/FoldPanel';
import { commandHistory } from '@/editor/core/CommandHistory';
import { DeleteWidgetCommand } from '@/editor/commands';
import { logger } from '@/common/Logger';
import { ViewData } from '@/runtime/ViewData';
import {
  Configurator,
  ConfiguratorValueType,
  LayoutConfiguratorValueType,
} from '@/runtime/Configurator';
import { ConfiguratorMap } from '@/runtime/CreationView';

/**
 * 找出布局
 */

function filterConfiguratorLayout(
  configurators: ConfiguratorMap,
  types: ConfiguratorValueType[],
): [Configurator<unknown>[], ConfiguratorMap] {
  const arr = [];
  for (const key in configurators) {
    const element = configurators[key];
    if (types.includes(element.type)) {
      arr.push(element);
      delete configurators[key];
    }
  }
  return [arr, configurators];
}

export const RightPanel: FC = () => {
  const { activeViewData } = useEditorState();

  const handleDeleteClick = useCallback(() => {
    if (!activeViewData) return;
    commandHistory.push(new DeleteWidgetCommand(activeViewData.id));
  }, [activeViewData]);

  const handleFunctionClick = useCallback(() => {
    console.log(ViewData.collection.getCollection());
  }, [activeViewData]);

  const handleKeyup = useCallback((e) => {
    if (e.keyCode === 13) e.target?.blur();
  }, []);

  /**
   * 单个组件渲染耗时过大依旧会造成 longtask
   * 优化方向：编辑器载入时，就生成一遍各个配置组件
   * 多个相同组件以数量下标来标记 key
   */

  return useMemo(() => {
    if (!activeViewData) return null;

    const [parallelLayotConfiguratorArr, configuratorMap] =
      filterConfiguratorLayout(
        { ...activeViewData.configurators },
        LayoutConfiguratorValueType,
      );

    logger.debug('render configurator list');

    const keys = Object.keys(configuratorMap);
    const option = {
      title: '控制',
      component: (
        <Box p="8px">
          <div className="configurator-list" onKeyUp={handleKeyup}>
            <Parallel configuratorArray={parallelLayotConfiguratorArr} />
            {keys.map((key) => {
              const configurator = activeViewData.configurators[key];
              if (configurator.hidden) return null;

              if (configurator.type === ConfiguratorValueType.RichText)
                return (
                  <TopDown
                    key={`${configurator.type}-${key}`}
                    configurator={configurator}
                    height={500}
                  />
                );

              return (
                <LeftRight
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
            添加
          </Button>
        </Box>
      ),
    };
    return <FoldPanel panelList={[option]} name="right_panel" />;
  }, [activeViewData?.id]);
};
