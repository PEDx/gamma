import { remove } from "lodash";
import { LayoutViewData } from "@/runtime/LayoutViewData";
import { RootViewData } from "@/runtime/RootViewData";


export class LayoutViewDataManager {
    root: RootViewData;
    constructor(root: RootViewData) {
        this.root = root
    }
}