import { TClassProperties, TObjectValues } from "../types";
import { ACTION_GROUP_ACTION } from "../constants";

import { Base } from "./Base";
import { ActionGroup } from "./ActionGroup";

type TFile<T> = TClassProperties<File<T>>;

export class File<T = any> extends Base<TFile<T>> implements TFile<T> {
    path: string = '/';
    name: string = 'file.txt';
    content: any = null;
    actionGroups: ActionGroup[] = [];
    actionGroupActions: TObjectValues<typeof ACTION_GROUP_ACTION>[] = [ACTION_GROUP_ACTION.UPDATE_DATABASE];

    constructor(payload: Partial<TFile<T>> = {}) {
        super();
        this.fill(payload);
    }

    get modInfoPath(){
        return `${this.path}${this.name}`;
    }

    write(dist: string) {
    }
}