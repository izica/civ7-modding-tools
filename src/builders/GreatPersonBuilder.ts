import { kebabCase } from "lodash";

import { TClassProperties, TPartialRequired } from "../types";
import { DatabaseNode, TIconDefinitionNode, TUnitNode } from "../nodes";
import { ACTION_GROUP_ACTION } from "../constants";
import { XmlFile } from "../files";

import { BaseBuilder } from "./BaseBuilder";

type TUnlockRewardBuilder = TClassProperties<GreatPersonBuilder>;

export class GreatPersonBuilder extends BaseBuilder<TUnlockRewardBuilder> {
    _current: DatabaseNode = new DatabaseNode();
    _shell: DatabaseNode = new DatabaseNode();
    _icons: DatabaseNode = new DatabaseNode();
    _localizations: DatabaseNode = new DatabaseNode();

    type = 'LOGIOS';

    icon: TPartialRequired<TIconDefinitionNode, 'path'> = {
        path: 'fs://game/civ_sym_han'
    }

    constructor(payload: Partial<TUnlockRewardBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {

        return this;
    }

    build() {
        const path = `/great-persons/${kebabCase('')}/`;
        return [
            new XmlFile({
                path,
                name: 'current.xml',
                content: this._current.toXmlElement(),
                actionGroups: [this.actionGroupBundle.current],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new XmlFile({
                path,
                name: 'shell.xml',
                content: this._shell.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new XmlFile({
                path,
                name: 'localization.xml',
                content: this._localizations.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_TEXT]
            }),
        ]
    }
}
