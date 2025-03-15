import * as lodash from "lodash"

import { TClassProperties, TPartialRequired } from "../types";
import { DatabaseNode, GameEffectNode, GameModifierNode, IconDefinitionNode, TIconDefinitionNode, TypeNode, UniqueQuarterModifierNode, UniqueQuarterNode } from "../nodes";
import { TraditionLocalization, TUniqueQuarterLocalization, UniqueQuarterLocalization } from "../localizations";
import { XmlFile } from "../files";
import { ACTION_GROUP_ACTION, KIND } from "../constants";
import { locale } from "../utils";

import { ModifierBuilder } from "./ModifierBuilder";
import { ConstructibleBuilder } from "./ConstructibleBuilder";
import { BaseBuilder } from "./BaseBuilder";

type TUniqueQuarterBuilder = TClassProperties<UniqueQuarterBuilder>

export class UniqueQuarterBuilder extends BaseBuilder<TUniqueQuarterBuilder> {
    _always: DatabaseNode = new DatabaseNode();
    _localizations: DatabaseNode = new DatabaseNode();
    _gameEffects: GameEffectNode = new GameEffectNode();
    _icons: DatabaseNode = new DatabaseNode();

    uniqueQuarter: TPartialRequired<UniqueQuarterNode, 'uniqueQuarterType' | 'buildingType1' | 'buildingType2'> = {
        uniqueQuarterType: 'QUARTER_CUSTOM',
        buildingType1: 'BUILDING_CUSTOM1',
        buildingType2: 'BUILDING_CUSTOM2',
    }

    icon: TPartialRequired<TIconDefinitionNode, 'path'> = {
        path: 'fs://game/civ_sym_han'
    }

    localizations: Partial<TUniqueQuarterLocalization>[] = [];

    constructor(payload: Partial<TUniqueQuarterBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        this._always.fill({
            types: [new TypeNode({ kind: KIND.QUARTER, type: this.uniqueQuarter.uniqueQuarterType })],
            uniqueQuarters: [new UniqueQuarterNode({
                name: locale(this.uniqueQuarter.uniqueQuarterType, 'name'),
                description: locale(this.uniqueQuarter.uniqueQuarterType, 'description'),
                ...this.uniqueQuarter,
            })]
        });

        this._icons.fill({
            iconDefinitions: [new IconDefinitionNode({
                id: this.uniqueQuarter.uniqueQuarterType,
                ...this.icon,
            })]
        })

        this.localizations.forEach(item => {
            this._localizations.push(
                new UniqueQuarterLocalization({
                    prefix: this.uniqueQuarter.uniqueQuarterType,
                    ...item
                }).getNodes()
            );
        });

        return this;
    }

    bind(items: (ModifierBuilder | ConstructibleBuilder)[]) {
        items.forEach(item => {
            if (item instanceof ModifierBuilder) {
                item._gameEffects.modifiers.forEach((modifier) => {
                    this._gameEffects.modifiers.push(modifier);
                });

                if(!item.isDetached){
                    item._gameEffects.modifiers.forEach((modifier) => {
                        this._always.gameModifiers.push(new GameModifierNode({
                            modifierId: modifier.id
                        }));

                        this._always.uniqueQuarterModifiers.push(new UniqueQuarterModifierNode({
                            uniqueQuarterType: this.uniqueQuarter.uniqueQuarterType,
                            modifierId: modifier.id
                        }));
                    });
                }

                this._localizations.englishText = [
                    ...this._localizations.englishText,
                    ...item._localizations.englishText
                ];
            }
        });

        return this;
    }

    build() {
        const path = `/constructibles/${lodash.kebabCase(this.uniqueQuarter.uniqueQuarterType)}/`;
        return [
            new XmlFile({
                path,
                name: 'always.xml',
                content: this._always.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new XmlFile({
                path,
                name: 'icons.xml',
                content: this._icons.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_ICONS]
            }),
            new XmlFile({
                path,
                name: 'game-effects.xml',
                content: this._gameEffects.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
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
