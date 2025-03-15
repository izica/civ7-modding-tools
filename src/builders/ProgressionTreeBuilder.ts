import * as lodash from "lodash";

import { TClassProperties, TPartialRequired } from "../types";
import { DatabaseNode, GameEffectNode, ProgressionTreeNode, ProgressionTreePrereqNode, TProgressionTreeNode, TProgressionTreePrereqNode, TypeNode } from "../nodes";
import { ACTION_GROUP_ACTION, AGE, KIND } from "../constants";
import { locale, trim } from "../utils";
import { XmlFile } from "../files";

import { ProgressionTreeNodeBuilder } from "./ProgressionTreeNodeBuilder";
import { BaseBuilder } from "./BaseBuilder";
import { ModifierLocalization, ProgressionTreeLocalization, TProgressionTreeLocalization } from "../localizations";

type TProgressionTreeBuilder = TClassProperties<ProgressionTreeBuilder>

export class ProgressionTreeBuilder extends BaseBuilder<TProgressionTreeBuilder> {
    _current: DatabaseNode = new DatabaseNode();
    _gameEffects: GameEffectNode = new GameEffectNode();
    _localizations: DatabaseNode = new DatabaseNode();

    progressionTree: TPartialRequired<TProgressionTreeNode, 'progressionTreeType' | 'ageType'> = {
        progressionTreeType: 'TREE_CIVICS_CUSTOM',
        ageType: AGE.ANTIQUITY
    }
    progressionTreePrereqs: TProgressionTreePrereqNode[] = [];

    localizations: TProgressionTreeLocalization[] = [];

    constructor(payload: Partial<TProgressionTreeBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        this._current.fill({
            types: [new TypeNode({
                type: this.progressionTree.progressionTreeType,
                kind: KIND.TREE,
            })],
            progressionTrees: [new ProgressionTreeNode({
                ...this.progressionTree,
                name: locale(this.progressionTree.progressionTreeType, 'name')
            })],
            progressionTreePrereqs: this.progressionTreePrereqs.map(item => {
                return new ProgressionTreePrereqNode(item)
            })
        });

        this.localizations.forEach(item => {
            this._localizations.push(
                new ProgressionTreeLocalization({
                    prefix: this.progressionTree.progressionTreeType,
                    ...item
                }).getNodes()
            );
        });

        return this;
    }

    bind(items: ProgressionTreeNodeBuilder[]) {
        items.forEach(item => {
            item._current.progressionTreeNodes.forEach(item => {
                item.fill({
                    progressionTree: this.progressionTree.progressionTreeType,
                });
            })
            this._current.types = [
                ...this._current.types,
                ...item._current.types,
            ];
            this._current.progressionTreeNodes = [
                ...this._current.progressionTreeNodes,
                ...item._current.progressionTreeNodes,
            ];
            this._current.progressionTreeAdvisories = [
                ...this._current.progressionTreeAdvisories,
                ...item._current.progressionTreeAdvisories,
            ];
            this._current.progressionTreeNodeUnlocks = [
                ...this._current.progressionTreeNodeUnlocks,
                ...item._current.progressionTreeNodeUnlocks,
            ];
            this._current.progressionTreePrereqs = [
                ...this._current.progressionTreePrereqs,
                ...item._current.progressionTreePrereqs,
            ];
            this._gameEffects.modifiers = [
                ...this._gameEffects.modifiers,
                ...item._gameEffects.modifiers
            ];

            this._localizations.englishText = [
                ...this._localizations.englishText,
                ...item._localizations.englishText
            ];
        })
        return this;
    }

    build() {
        const path = `/progression-trees/${lodash.kebabCase(trim(this.progressionTree.progressionTreeType))}/`;
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
                name: 'game-effects.xml',
                content: this._gameEffects?.toXmlElement(),
                actionGroups: [this.actionGroupBundle.current],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new XmlFile({
                path,
                name: 'localization.xml',
                content: this._localizations.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_TEXT]
            }),
        ];
    }
}
