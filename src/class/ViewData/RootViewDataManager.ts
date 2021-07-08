import { remove } from "lodash";
import { RootViewData } from "./RootViewData";


export class RootViewDataManager {
    element: HTMLElement;
    list: RootViewData[] = []
    constructor(element: HTMLElement) {
        this.element = element
    }
    addRootViewData(rootViewData: RootViewData) {
        this.list.push(rootViewData)
        this.element.appendChild(rootViewData.element)
        this._freshList()
    }
    deleteRootViewData(index: number) {
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