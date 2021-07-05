import ReactDOM from 'react-dom';
import { useState, forwardRef, useRef, useEffect, FC } from 'react';
import { CreationView } from '@/packages';
import { ViewData } from '@/class/ViewData/ViewData';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { WidgetType, WidgetMeta } from '@/class/Widget';
import { ViewDataContainer } from '@/class/ViewData/ViewDataContainer';

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
interface IHTMLContainerProps {
  idx: number;
  visiable: boolean;
}

const HTMLContainer: FC<IHTMLContainerProps> = ({ idx, visiable }) => {
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
        position: 'absolute',
        top: '0',
        left: '0',
        // FIXME 此处的React容器组件还是必须用样式来控制显示和不显示
        display: visiable ? 'block' : 'none',
      }}
    ></div>
  );
};

const TabContainer = forwardRef<ReactContainerMethods, ITabContainerProps>(
  ({ tabCount }, ref) => {
    console.log('render TabContainer');

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
            <HTMLContainer visiable={tabIndex === idx} idx={idx} key={idx} />
          ))}
        </div>
      </>
    );
  },
);

export function createTabContainerView(): CreationView {
  const element = document.createElement('DIV') as HTMLImageElement;
  element.style.setProperty('width', `100%`);
  element.style.setProperty('height', `600px`);
  element.style.setProperty('display', `block`);
  console.log('render TabContainer');

  const tabCount = createConfigurator({
    type: ConfiguratorValueType.Number,
    lable: 'tab数量',
    value: 3,
  }).attachEffect((value) => {
    ReactDOM.render(<TabContainer tabCount={value} />, element);
  });

  return {
    meta,
    element: element,
    containers: [],
    configurators: { tabCount },
  };
}
