import ReactDOM from 'react-dom';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
  FC,
} from 'react';
import { CreationView } from '@/packages';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { WidgetType, WidgetMeta } from '@/class/Widget';

const meta: WidgetMeta = {
  id: 'gamma-tab-container-view-widget',
  name: 'Tab容器',
  icon: '',
  type: WidgetType.DOM,
};

interface ReactContainerMethods {
  appendChild: (content: HTMLElement) => void;
}
interface ITabContainerProps {
  tabCount: number;
}
interface IHTMLContainerProps {
  elment: HTMLElement | null;
  idx: number;
  visiable: boolean;
}

const HTMLContainer: FC<IHTMLContainerProps> = ({ elment, idx, visiable }) => {
  const container = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!container.current || !elment) return;
    container.current.appendChild(elment);
  }, [elment]);
  return (
    <div
      data-is-container="true"
      className="container"
      ref={container}
      style={{
        display: visiable ? 'block' : 'none',
      }}
    >
      container 0{idx}
    </div>
  );
};

const TabContainer = forwardRef<ReactContainerMethods, ITabContainerProps>(
  ({ tabCount }, ref) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [contentList, setContentList] = useState<HTMLElement[]>([]);

    useImperativeHandle(
      ref,
      () => ({
        appendChild(content: HTMLElement) {
          const newArr = [...contentList];
          newArr[tabIndex] = content;
          setContentList(newArr);
        },
      }),
      [contentList, tabIndex],
    );

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
          {Array.from({ length: tabCount }).map((tab, idx) => {
            return (
              <HTMLContainer
                visiable={tabIndex === idx}
                elment={contentList[idx]}
                key={idx}
                idx={idx}
              />
            );
          })}
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
    ReactDOM.render(
      <TabContainer
        tabCount={value as number}
        ref={(node) => {
          if (!node) return;
          meta.data = node;
        }}
      />,
      element,
    );
  });

  return {
    meta,
    element: element,
    configurators: { tabCount },
  };
}
