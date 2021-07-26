import ReactDOM from 'react-dom';
import { useState, forwardRef, useRef, useEffect, FC } from 'react';
import { ViewData } from '@/runtime/ViewData';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/runtime/Configurator';
import { CreationView, WidgetType, WidgetMeta } from '@/runtime/CreationView';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';
import { RGBColor } from 'react-color';
import { createPolysemyConfigurator } from '@/runtime/PolysemyConfigurator';

type TupleToUnion<T extends unknown[]> = T[number];

const meta: WidgetMeta = {
  id: 'gamma-tab-container-view-widget',
  name: 'Tab容器',
  icon: '',
  type: WidgetType.DOM,
};

interface ITabContainerProps {
  tabCount: number;
  tabTextColor: { [key: string]: RGBColor };
}
interface IVDContainerProps {
  visiable: boolean;
}

const VDContainer: FC<IVDContainerProps> = ({ visiable }) => {
  const container = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!container.current) return;
    // 此处是异步添加 container 到 viewdata，即 viewdata 先创建，然后 caontainer 再异步添加
    const vd = ViewData.collection.findViewData(container.current);
    if (!vd) return;
    new ViewDataContainer({
      element: container.current,
      parent: vd.id,
    });
  }, []);
  return (
    <div
      ref={container}
      style={{
        height: '100%',
        width: '100%',
        // FIXME 此处的 React容器组件还是必须用样式来控制显示和不显示
        display: visiable ? 'block' : 'none',
      }}
    ></div>
  );
};

const TabContainer: FC<ITabContainerProps> = ({ tabCount, tabTextColor }) => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <>
      <div className="tab-list">
        {Array.from({ length: tabCount }).map((_, idx) => {
          const color =
            tabIndex === idx ? tabTextColor.active : tabTextColor.inactive;
          return (
            <div
              className="tab"
              onClick={() => setTabIndex(idx)}
              key={idx}
              style={{
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
              }}
            >
              tab 0{idx}
            </div>
          );
        })}
      </div>
      <div className="tab-container">
        {Array.from({ length: tabCount }).map((tab, idx) => (
          <VDContainer visiable={tabIndex === idx} key={idx} />
        ))}
      </div>
    </>
  );
};

// TODO 复杂组件的样式文件怎么注入到 viewport

export function createTabContainerView(): CreationView {
  const element = document.createElement('DIV');
  element.style.setProperty('position', `absolute`);
  element.style.setProperty('top', `0`);
  element.style.setProperty('left', `0`);

  element.className = 'tab-view';

  const tabCount = createConfigurator({
    type: ConfiguratorValueType.Number,
    lable: 'tab数量',
    value: 3,
  }).attachEffect(() => {
    render();
  });

  type TabStatuKeys = ['active', 'inactive'];

  const tabTextColor = createPolysemyConfigurator(
    {
      type: ConfiguratorValueType.Color,
      name: 'color',
      lable: '文字顔色',
      value: {
        r: 241,
        g: 112,
        b: 19,
        a: 1,
      } as RGBColor,
    },
    ['active', 'inactive'] as TabStatuKeys,
  ).attachPolysemyValueEffect(() => {
    render();
  });

  const activeMode = createConfigurator<TupleToUnion<TabStatuKeys>>({
    type: ConfiguratorValueType.Select,
    lable: 'tab样式',
    value: 'active',
  }).attachEffect((value) => {
    tabTextColor.switch(value);
  });

  activeMode.setConfig<ISelectOption[]>([
    {
      value: 'active',
      label: '选中',
    },
    {
      value: 'inactive',
      label: '未选中',
    },
  ]);

  const render = () => {
    ReactDOM.render(
      <TabContainer
        tabCount={tabCount.value}
        tabTextColor={tabTextColor.valueMap}
      />,
      element,
    );
  };

  return {
    meta,
    element: element,
    containers: [],
    configurators: { tabCount, activeMode, tabTextColor },
  };
}
