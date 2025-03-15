import * as lodash from "lodash"

import { TClassProperties } from "../types";
import { DatabaseNode, GameEffectNode, ModifierNode, StringNode, TModifierNode } from "../nodes";

import { BaseBuilder } from "./BaseBuilder";
import { CivilizationLocalization, ConstructibleLocalization, ModifierLocalization, TModifierLocalization } from "../localizations";
import { locale } from "../utils";

type TModifierBuilder = TClassProperties<ModifierBuilder>

export class ModifierBuilder extends BaseBuilder<TModifierBuilder> {
    _gameEffects: GameEffectNode = new GameEffectNode();
    _localizations: DatabaseNode = new DatabaseNode();

    /** @description if detached only adding into game effects file while binding*/
    isDetached = false;

    modifier: Partial<TModifierNode> = {}

    localizations: Partial<TModifierLocalization>[] = [];

    constructor(payload: Partial<TModifierBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        const modifier = new ModifierNode(this.modifier);

        if(this.localizations.length > 0) {
            Object.keys(this.localizations[0]).forEach(key => {
                modifier.strings.push({
                    context: lodash.capitalize(key),
                    value: locale(modifier.id, key)
                });
            });
        }

        this.localizations.forEach(item => {
            this._localizations.push(
                new ModifierLocalization({
                    prefix: modifier.id,
                    ...item
                }).getNodes()
            );
        });

        this._gameEffects.fill({
            modifiers: [modifier]
        });

        return this;
    }

    build() {
        return [];
    }
}
