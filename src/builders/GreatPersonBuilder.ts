import { kebabCase } from "lodash";

import { TClassProperties, TPartialRequired } from "../types";
import {
    DatabaseNode, GameEffectNode,
    GreatPersonClassNode,
    GreatPersonIndividualNode,
    TGreatPersonClassNode,
    TGreatPersonIndividualActionModifierNode,
    TGreatPersonIndividualNode,
    TIconDefinitionNode,
    TModifierNode,
    TypeNode
} from "../nodes";
import { ACTION_GROUP_ACTION, KIND } from "../constants";
import { XmlFile } from "../files";

import { BaseBuilder } from "./BaseBuilder";
import { locale } from "../utils";

type TUnlockRewardBuilder = TClassProperties<GreatPersonBuilder>;

export class GreatPersonBuilder extends BaseBuilder<TUnlockRewardBuilder> {
    _current: DatabaseNode = new DatabaseNode();
    _gameEffects: GameEffectNode = new GameEffectNode();
    _shell: DatabaseNode = new DatabaseNode();
    _icons: DatabaseNode = new DatabaseNode();
    _localizations: DatabaseNode = new DatabaseNode();

    alias = 'LOGIOS';

    icon: TPartialRequired<TIconDefinitionNode, 'path'> = {
        path: 'fs://game/civ_sym_han'
    }

    greatPersonClass: Partial<TGreatPersonClassNode> = {};

    greatPersonIndividuals: (Partial<TGreatPersonIndividualNode> & {
        alias: string,
        greatPersonIndividualActionModifiers: (TPartialRequired<TGreatPersonIndividualActionModifierNode, 'attachmentTargetType'> & {
            modifier: Partial<TModifierNode>
        })[]
    })[] = [];

    constructor(payload: Partial<TUnlockRewardBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        const unitType = `UNIT_${this.alias}`;
        const greatPersonClassType = `GREAT_PERSON_CLASS_${this.alias}`;

        this._current.fill({
            types: [new TypeNode({ type: greatPersonClassType, kind: KIND.GREAT_PERSON_CLASS })],
            greatPersonClasses: [
                new GreatPersonClassNode({
                    greatPersonClassType,
                    unitType,
                    name: locale(unitType, 'name'),
                    ...this.greatPersonClass
                })
            ]
        });

        this.greatPersonIndividuals.forEach(item => {
            const greatPersonIndividualType = `GREAT_PERSON_INDIVIDUAL_${item.alias}`;

            this._current.types.push(new TypeNode({ type: greatPersonIndividualType, kind: KIND.GREAT_PERSON_INDIVIDUAL }));
            this._current.greatPersonIndividuals.push(
                new GreatPersonIndividualNode({
                    greatPersonIndividualType,
                    greatPersonClassType,
                    unitType,
                    name: locale(greatPersonIndividualType, 'name'),
                    actionEffectTextOverride: locale(greatPersonIndividualType, 'description'),
                    actionNameTextOverride: locale(greatPersonIndividualType, 'retire'),
                    ...item
                })
            );
        });

        return this;
    }

    build() {
        const path = `/great-persons/${kebabCase(this.alias)}/`;
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
                content: this._gameEffects.toXmlElement(),
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
