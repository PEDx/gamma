import ReactDOM from 'react-dom';
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';

const meta = {
  id: 'gamma-tab-container-view-widget',
  name: 'Tab容器',
  icon: '',
  type: WidgetType.DOM,
};

interface TabContainerMethods {
  getContainerElement: () => HTMLDivElement[] | null[];
}

const TabContainer = forwardRef<TabContainerMethods>(({}, ref) => {
  const [tabIndex, setTabIndex] = useState(1);
  const containers = useRef<HTMLDivElement[] | null[]>([]);
  useImperativeHandle(
    ref,
    () => ({
      getContainerElement() {
        return containers.current;
      },
    }),
    [],
  );
  return (
    <>
      <div className="tab-list">
        <div className="tab" onClick={() => setTabIndex(1)}>
          tab 01
        </div>
        <div className="tab" onClick={() => setTabIndex(2)}>
          tab 02
        </div>
        <div className="tab" onClick={() => setTabIndex(3)}>
          tab 03
        </div>
      </div>
      <div className="tab-container">
        {tabIndex === 1 && (
          <div
            className="container"
            ref={(node) => (containers.current[0] = node)}
          >
            container 01
          </div>
        )}
        {tabIndex === 2 && (
          <div
            className="container"
            ref={(node) => (containers.current[1] = node)}
          >
            container 02
          </div>
        )}
        {tabIndex === 3 && (
          <div
            className="container"
            ref={(node) => (containers.current[2] = node)}
          >
            container 03
          </div>
        )}
      </div>
    </>
  );
});

export function createTabContainerView(): CreationView {
  const element = document.createElement('DIV') as HTMLImageElement;
  element.style.setProperty('width', `100%`);
  element.style.setProperty('height', `600px`);
  element.style.setProperty('display', `block`);
  console.log('render TabContainer');

  let _containers: HTMLElement[] = [];

  ReactDOM.render(
    <TabContainer
      ref={(node) => {
        if (!node) return;
        _containers = node?.getContainerElement() as HTMLElement[];
      }}
    />,
    element,
  );

  return {
    meta,
    containers: [..._containers],
    element: element,
    configurators: {},
  };
}
