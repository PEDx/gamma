import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';
import {
  EditPageLayer,
  EditPageLayerMethods,
} from '@/components/EditPageLayer';
import {
  HoverHighlightLayer,
  HoverHighlightLayerMethods,
} from '@/components/HoverHighlightLayer';
import { MiniMap } from '@/components/MiniMap';
import { useEditorState, useEditorDispatch, ActionType } from '@/store/editor';
import { ViewData } from '@/class/ViewData/ViewData';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { ViewDataContainer } from '@/class/ViewData/ViewDataContainer';
import {
  DropItem,
  setDragEnterStyle,
  clearDragEnterStyle,
} from '@/class/DragAndDrop/drop';
import { DragType } from '@/class/DragAndDrop/drag';
import { viewTypeMap } from '@/packages';
import { WidgetDragMeta } from '@/components/WidgetSource';
import { ShadowView } from '@/components/ShadowView';
import { useSettingState } from '@/store/setting';
import { storage } from '@/utils';
import { IViewStaticDataMap } from '@/class/ViewData/ViewDataCollection';
import { Render } from '@/class/Render';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import './style.scss';

// TODO 命令模式：实现撤销和重做
// TODO 动态添加 Configurator
// TODO 动态添加 Container

export const Viewport: FC = () => {
  const { selectViewData } = useEditorState();
  const dispatch = useEditorDispatch();
  const { viewportDevice } = useSettingState();
  const editBoxLayer = useRef<EditBoxLayerMethods>(null);
  const editPageLayer = useRef<EditPageLayerMethods>(null);
  const hoverHighlightLayer = useRef<HoverHighlightLayerMethods | null>(null);
  const [rootContainer, setRootContainer] = useState<HTMLElement | null>(null);
  const [viewport, setViewport] = useState<HTMLElement | null>(null);

  const rootContainerRef = useCallback((node) => {
    if (!node) return;
    // TODO 根节点有特殊的配置选项，比如可以定义页面标题，配置页面高度，页面布局模式
    const rootViewData = new RootViewData({
      element: node as HTMLElement,
      configurators: {
        height: createConfigurator({
          type: ConfiguratorValueType.Height,
          name: 'height',
          lable: '高度',
          value: 100,
        }).attachEffect((value) => {
          node.style.setProperty('height', `${value}px`);
        }),
      },
    });
    dispatch({
      type: ActionType.SetRootViewData,
      data: rootViewData,
    });
    setRootContainer(node);

    let dragEnterContainer: HTMLElement | null = null;
    const dropItem = new DropItem<WidgetDragMeta>({
      node,
      type: DragType.widget,
      onDragenter: (evt) => {
        const node = evt.target as HTMLElement;
        hoverHighlightLayer.current?.block(true);
        const container = ViewDataContainer.collection.findContainer(node);
        if (!container) return;
        dragEnterContainer = container;
        setDragEnterStyle(container);
      },
      onDragleave: (evt) => {
        const node = evt.target as HTMLElement;

        const container = ViewDataContainer.collection.findContainer(node);
        // ANCHOR 此处保证拿到的是最近父级有 ViewData 的 dom
        // TODO 组件可禁用拖拽功能
        if (!container) return false;
        if (dragEnterContainer === container) return false;
        // 从子元素移动到父元素，父元素不选中
        clearDragEnterStyle(container);
      },
      onDrop: (evt) => {
        if (!dragEnterContainer) return false;
        clearDragEnterStyle(dragEnterContainer);
        const dragMeta = dropItem.getDragMeta(evt);

        if (!dragMeta) throw 'connot found draged widget meta';

        const createView = viewTypeMap.get(dragMeta.data);
        if (!createView) return;
        const { element, configurators, containers, meta } = createView();
        // ANCHOR 此处插入组件到父组件中
        // TODO 此处应该有一次保存到本地的操作
        const viewDataContainer =
          ViewDataContainer.collection.getViewDataContainerByElement(
            dragEnterContainer,
          );

        const vd = new ViewData({
          element,
          meta,
          configurators,
          containerElements: containers,
        });

        viewDataContainer?.addViewData(vd);
        vd.editableConfigurators?.x?.setValue(evt.offsetX);
        vd.editableConfigurators?.y?.setValue(evt.offsetY);
        activeViewData(vd);
      },
      onDragend: () => {
        hoverHighlightLayer.current?.block(false);
        dragEnterContainer && clearDragEnterStyle(dragEnterContainer);
      },
    });

    const renderData = storage.get<IViewStaticDataMap>('collection');
    if (!renderData) return;
    const target = new Render({
      target: rootViewData,
    });
    target.render(renderData);
  }, []);

  const activeViewData = useCallback((viewData: ViewData) => {
    if (!viewData) return;
    dispatch({
      type: ActionType.SetSelectViewData,
      data: viewData,
    });
    editBoxLayer.current!.visible(true);
    editBoxLayer.current!.setShadowViewData(viewData);
    viewData.initViewByConfigurators();
  }, []);
  const activeRootViewData = useCallback((rootViewData: ViewData) => {
    if (!rootViewData) return;
    editPageLayer.current!.visible(true);
    editPageLayer.current!.setShadowViewData(rootViewData as RootViewData);
  }, []);

  useEffect(() => {
    if (!selectViewData && editBoxLayer.current)
      editBoxLayer.current!.visible(false);
  }, [selectViewData]);

  useEffect(() => {
    if (!rootContainer) return;
    let activeVDNode: HTMLElement | null = null;
    const clearActive = () => {
      activeVDNode = null;
      editBoxLayer.current!.visible(false);
      editPageLayer.current!.visible(false);
      dispatch({
        type: ActionType.SetSelectViewData,
        data: null,
      });
    };
    clearActive();

    // TODO 多次点击同一个元素，实现逐级向上选中父可编辑元素

    rootContainer.addEventListener('mousedown', (e) => {
      const activeNode = e.target as HTMLElement;
      // 只有实例化了 ViewData 的节点才能被选中
      const viewData = ViewData.collection.findViewData(activeNode);

      if (activeVDNode === viewData?.element) {
        editBoxLayer.current!.attachMouseDownEvent(e);
        return;
      }
      clearActive();
      if (viewData?.getIsRoot()) {
        activeRootViewData(viewData);
        return;
      }
      if (
        rootContainer?.contains(activeNode) &&
        rootContainer !== activeNode &&
        viewData
      ) {
        activeViewData(viewData);
        activeVDNode = viewData.element;
        editBoxLayer.current!.attachMouseDownEvent(e);
      }
    });
  }, [rootContainer]);

  useEffect(() => {
    document.addEventListener('mouseup', () => {
      hoverHighlightLayer.current?.block(false);
    });
  }, []);

  return (
    <div className="viewport-wrap">
      {viewport && <MiniMap host={viewport} />}
      <div
        className="viewport"
        id="viewport"
        ref={(node) => setViewport(node)}
        style={{
          width: `${viewportDevice?.resolution.width}px`,
          height: `${viewportDevice?.resolution.height}px`,
        }}
      >
        <EditBoxLayer
          ref={editBoxLayer}
          onEditStart={() => {
            hoverHighlightLayer.current?.block(true);
          }}
          onMoveStart={() => {
            hoverHighlightLayer.current?.block(true);
          }}
        />
        <EditPageLayer ref={editPageLayer} />
        {rootContainer && (
          <HoverHighlightLayer
            root={rootContainer}
            out={viewport}
            ref={hoverHighlightLayer}
          />
        )}
        <ShadowView>
          <div
            ref={rootContainerRef}
            style={{
              height: '100%',
              position: 'relative',
              backgroundColor: '#fff',
            }}
          ></div>
        </ShadowView>
      </div>
    </div>
  );
};
