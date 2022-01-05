import { Configurator, EConfiguratorType } from '../configurator/Configurator';
import { FontValueEntity } from '../values/FontValueEntity';
import { UnitNumberValueEntity } from '../values/UnitNumberValueEntity';
import { EElementType, IViewElement, IElementMeta } from './IElement';
import { TypeValueEntity } from '../values/TypeValueEntity';
import { BorderValueEntity } from '../values/BorderValueEntity';
import { BackgroundValueEntity } from '../values/BackgroundValueEntity';

/**
 * 基础组件
 */
export class BaseViewElement implements IViewElement {
  constructor() {
    return {
      meta: this.meta,
      create: this.create,
    };
  }

  meta: IElementMeta = {
    id: 'base-element',
    name: '基础盒子',
    type: EElementType.View,
  };

  create() {
    const div = document.createElement('div');
    const originalDisplay = 'flex';
    div.style.setProperty('position', `absolute`);
    div.style.setProperty('top', `0`);
    div.style.setProperty('left', `0`);
    div.style.setProperty('overflow', `hidden`);
    div.style.setProperty('display', originalDisplay);
    div.style.setProperty('box-sizing', `border-box`);

    const updatePosition = (() => {
      let _x = '0px';
      let _y = '0px';
      return ({ x, y }: { x?: string; y?: string }) => {
        if (y) _y = y;
        if (x) _x = x;
        div.style.setProperty('transform', `translate3d(${_x}, ${_y}, 0px)`);
      };
    })();

    const width = new Configurator({
      valueEntity: new UnitNumberValueEntity({ value: 100, unit: 'px' }),
      type: EConfiguratorType.Width,
      lable: 'W',
    }).effect((valueEntity) => {
      div.style.setProperty('width', valueEntity.style());
    });

    const height = new Configurator({
      valueEntity: new UnitNumberValueEntity({ value: 100, unit: 'px' }),
      type: EConfiguratorType.Height,
      lable: 'H',
    }).effect((valueEntity) => {
      div.style.setProperty('height', valueEntity.style());
    });

    const x = new Configurator({
      valueEntity: new UnitNumberValueEntity({ value: 0, unit: 'px' }),
      type: EConfiguratorType.X,
      lable: 'X',
    }).effect((valueEntity) => {
      updatePosition({ x: valueEntity.style() });
    });

    const y = new Configurator({
      valueEntity: new UnitNumberValueEntity({ value: 0, unit: 'px' }),
      type: EConfiguratorType.Y,
      lable: 'Y',
    }).effect((valueEntity) => {
      updatePosition({ y: valueEntity.style() });
    });

    const visiable = new Configurator({
      valueEntity: new TypeValueEntity<'flex' | 'none'>(originalDisplay),
      type: EConfiguratorType.Switch,
      lable: 'visiable',
    }).effect((valueEntity) => {
      div.style.setProperty('display', valueEntity.style());
    });

    const zIndex = new Configurator({
      valueEntity: new TypeValueEntity(0),
      type: EConfiguratorType.Switch,
      lable: 'z-index',
    }).effect((valueEntity) => {
      div.style.setProperty('z-index', `${valueEntity.style()}`);
    });

    const background = new Configurator({
      type: EConfiguratorType.Background,
      lable: 'background',
      valueEntity: new BackgroundValueEntity(),
    }).effect((valueEntity) => {
      const style = valueEntity.style();
      (Object.keys(style) as (keyof typeof style)[]).forEach(
        (key) => (div.style[key] = style[key] || ''),
      );
    });

    const font = new Configurator({
      valueEntity: new FontValueEntity(),
      type: EConfiguratorType.Font,
      lable: 'font',
    }).effect((valueEntity) => {
      const style = valueEntity.style();
      (Object.keys(style) as (keyof typeof style)[]).forEach(
        (key) => (div.style[key] = style[key] || ''),
      );
    });

    const border = new Configurator({
      valueEntity: new BorderValueEntity(),
      type: EConfiguratorType.Y,
      lable: 'border',
    }).effect((valueEntity) => {
      const style = valueEntity.style();
      (Object.keys(style) as (keyof typeof style)[]).forEach(
        (key) => (div.style[key] = style[key] || ''),
      );
    });

    const text = new Configurator({
      valueEntity: new TypeValueEntity('text'),
      type: EConfiguratorType.Text,
      lable: 'text',
    });

    return {
      element: div,
      configurators: {
        x,
        y,
        width,
        height,
        visiable,
        zIndex,
        background,
        font,
        border,
        text,
      },
    };
  }
}
