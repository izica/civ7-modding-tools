import { ActionGroupNode } from "../nodes";
import { TClassProperties } from "../types";
import { fill } from "../utils";


type TActionGroupBundleActionGroupBundle = TClassProperties<ActionGroupBundle>;
export class ActionGroupBundle {
    shell: ActionGroupNode = new ActionGroupNode();
    always: ActionGroupNode = new ActionGroupNode();
    current: ActionGroupNode = new ActionGroupNode();
    persist: ActionGroupNode = new ActionGroupNode();

    constructor(payload: Partial<TActionGroupBundleActionGroupBundle> = {}) {
        this.fill(payload);
    }

    fill = fill<TActionGroupBundleActionGroupBundle>;
}
