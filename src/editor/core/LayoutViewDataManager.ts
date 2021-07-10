import { remove } from "lodash";
import { LayoutViewData } from "@/runtime/LayoutViewData";


export class LayoutViewDataManager {
    element: HTMLElement;
    list: LayoutViewData[] = []
    constructor(element: HTMLElement) {
        this.element = element
    }
    addLayoutViewData(layoutViewData: LayoutViewData) {
        this.list.push(layoutViewData)
        this.element.appendChild(layoutViewData.element)
        this._freshList()
    }
    deleteLayoutViewData(index: number) {
        if (!this.list[index]) return
        const viewData = remove(this.list, (_, idx) => idx === index)[0]
        this.element.removeChild(viewData.element)
        this._freshList()
    }
    private _freshList() {
        this.list.forEach((val, idx) => {
            val.setIndex(idx)
            idx !== 0 ? val.element.style.setProperty('margin-top', '18px') :
                val.element.style.setProperty('margin-top', '0px')
            if (idx === this.list.length - 1) {
                val.isLast = true;
                return
            }
            val.isLast = false
        })
    }
}