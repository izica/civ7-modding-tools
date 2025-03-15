import * as lodash from "lodash"

import { TClassProperties, TPartialRequired } from "../types";
import { DatabaseNode, GameEffectNode, TraditionModifierNode, TraditionNode, TTraditionNode, TypeNode } from "../nodes";
import { ProgressionTreeNodeLocalization, TraditionLocalization, TTraditionLocalization } from "../localizations";
import { XmlFile } from "../files";
import { ACTION_GROUP_ACTION, KIND } from "../constants";
import { locale, trim } from "../utils";

import { ModifierBuilder } from "./ModifierBuilder";
import { ConstructibleBuilder } from "./ConstructibleBuilder";
import { UnitBuilder } from "./UnitBuilder";
import { BaseBuilder } from "./BaseBuilder";

type TTraditionBuilder = TClassProperties<TraditionBuilder>

export class TraditionBuilder extends BaseBuilder<TTraditionBuilder> {
    _current: DatabaseNode = new DatabaseNode();
    _gameEffects: GameEffectNode = new GameEffectNode();
    _localizations: DatabaseNode = new DatabaseNode();

    tradition: TPartialRequired<TTraditionNode, 'traditionType'> = {
        traditionType: 'TRADITION_CUSTOM'
    }

    localizations: Partial<TTraditionLocalization>[] = [];

    constructor(payload: Partial<TTraditionBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        this._current.fill({
            types: [new TypeNode({ kind: KIND.TRADITION, type: this.tradition.traditionType })],
            traditions: [new TraditionNode({
                name: locale(this.tradition.traditionType, 'name'),
                description: locale(this.tradition.traditionType, 'description'),
                ...this.tradition,
            })]
        });

        this.localizations.forEach(item => {
            this._localizations.push(
                new TraditionLocalization({
                    prefix: this.tradition.traditionType,
                    ...item
                }).getNodes()
            );
        });

        return this;
    }

    bind(items: (ModifierBuilder | ConstructibleBuilder | UnitBuilder)[]) {
        items.forEach(item => {
            if (item instanceof ModifierBuilder) {
                item._gameEffects.modifiers.forEach((modifier) => {
                    this._gameEffects.modifiers.push(modifier);

                    if(!item.isDetached) {
                        this._current.traditionModifiers.push(new TraditionModifierNode({
                            traditionType: this.tradition.traditionType,
                            modifierId: modifier.id
                        }))
                    }
                });

                this._localizations.englishText = [
                    ...this._localizations.englishText,
                    ...item._localizations.englishText
                ];
            }
        });

        return this;
    }

    build() {
        const path = `/traditions/${lodash.kebabCase(trim(this.tradition.traditionType))}/`;
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
                name: 'localization.xml',
                content: this._localizations.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_TEXT]
            }),
        ]
    }
}
