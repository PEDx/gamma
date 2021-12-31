/**
 * 内置基础组件
 */

import { Configurator, EConfiguratorType } from '../configurator/Configurator';
import { FontValueEntity, TFontKey } from '../values/FontValueEntity';
import { UnitNumberValueEntity } from '../values/UnitNumberValueEntity';
import { ColorValueEntity } from '../values/ColorValueEntity';
import { EElementType, IElement, IElementMeta } from './IElement';

export class BaseElement implements IElement {
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
    div.style.setProperty('position', `absolute`);
    div.style.setProperty('top', `0`);
    div.style.setProperty('left', `0`);
    div.style.setProperty('overflow', `hidden`);
    div.style.setProperty('display', `flex`);
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
      div.style.setProperty('width', valueEntity.view());
    });

    const height = new Configurator({
      valueEntity: new UnitNumberValueEntity({ value: 100, unit: 'px' }),
      type: EConfiguratorType.Height,
      lable: 'H',
    }).effect((valueEntity) => {
      div.style.setProperty('height', valueEntity.view());
    });

    const x = new Configurator({
      valueEntity: new UnitNumberValueEntity({ value: 0, unit: 'px' }),
      type: EConfiguratorType.X,
      lable: 'X',
    }).effect((valueEntity) => {
      updatePosition({ x: valueEntity.view() });
    });

    const y = new Configurator({
      valueEntity: new UnitNumberValueEntity({ value: 0, unit: 'px' }),
      type: EConfiguratorType.Y,
      lable: 'Y',
    }).effect((valueEntity) => {
      updatePosition({ y: valueEntity.view() });
    });
    const a = y.value;

    const font = new Configurator({
      valueEntity: new FontValueEntity({
        fontSize: new UnitNumberValueEntity({ value: 12, unit: 'px' }),
        lineHeight: new UnitNumberValueEntity({ value: 12, unit: 'px' }),
        letterSpacing: new UnitNumberValueEntity({ value: 12, unit: 'px' }),
        color: new ColorValueEntity({ r: 3, g: 3, b: 3, a: 1 }),
      }),
      type: EConfiguratorType.Y,
      lable: 'font',
    }).effect((valueEntity) => {
      const style = valueEntity.view();
      (Object.keys(style) as TFontKey[]).forEach(
        (key) => (div.style[key] = style[key] || ''),
      );
    });

    return {
      element: div,
      configurators: { width, height, x, y, font },
    };
  }
}
