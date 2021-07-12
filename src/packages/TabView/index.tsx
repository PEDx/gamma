import ReactDOM from 'react-dom';
import { useState, forwardRef, useRef, useEffect, FC } from 'react';
import { ViewData } from '@/runtime/ViewData';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/runtime/Configurator';
import { CreationView, WidgetType, WidgetMeta } from '@/runtime/CreationView';
import { ViewDataContainer } from '@/runtime/ViewDataContainer';

const meta: WidgetMeta = {
  id: 'gamma-tab-container-view-widget',
  name: 'Tab容器',
  icon: '',
  type: WidgetType.DOM,
};

interface ReactContainerMethods {}
interface ITabContainerProps {
  tabCount: number;
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
      parentViewData: vd,
    });
  }, []);
  return (
    <div
      ref={container}
      style={{
        height: '100%',
        width: '100%',
        // FIXME 此处的React容器组件还是必须用样式来控制显示和不显示
        display: visiable ? 'block' : 'none',
      }}
    ></div>
  );
};

const TabContainer = forwardRef<ReactContainerMethods, ITabContainerProps>(
  ({ tabCount }, ref) => {
    const [tabIndex, setTabIndex] = useState(0);
    return (
      <>
        <div className="tab-list">
          {Array.from({ length: tabCount }).map((tab, idx) => (
            <div className="tab" onClick={() => setTabIndex(idx)} key={idx}>
              tab 0{idx}
            </div>
          ))}
        </div>
        <div className="tab-container">
          {Array.from({ length: tabCount }).map((tab, idx) => (
            <VDContainer visiable={tabIndex === idx} key={idx} />
          ))}
        </div>
      </>
    );
  },
);

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
  }).attachEffect((value) => {
    ReactDOM.render(<TabContainer tabCount={value} />, element);
  });

  const y = createConfigurator({
    type: ConfiguratorValueType.Y,
    name: 'y',
    lable: 'Y',
    value: 0,
  }).attachEffect((value) => {
    element.style.setProperty('transform', `translate3d(0px, ${value}px, 0px)`);
  });

  return {
    meta,
    element: element,
    containers: [],
    configurators: { tabCount, y },
  };
}
