import { ViewData } from '@/runtime/ViewData';
import { WidgetType } from '@/runtime/CreationView';

// 页面配置对象

interface IRootViewDataParams {
    element: HTMLElement
}

const meta = {
    id: 'gamma-root-container',
    name: '根容器',
    icon: '',
    type: WidgetType.DOM,
};


export class RootViewData extends ViewData {
    override readonly isRoot: boolean = true;
    constructor({ element }: IRootViewDataParams) {
        super({
            meta,
            element,
            configurators: {}
        })
    }
}