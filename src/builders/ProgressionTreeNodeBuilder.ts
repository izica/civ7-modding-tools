import { TClassProperties, TObjectValues, TPartialRequired } from "../types";
import { DatabaseNode, GameEffectNode, ProgressionTreeAdvisoryNode, ProgressionTreeNodeNode, ProgressionTreeNodeUnlockNode, TProgressionTreeNodeNode, TypeNode } from "../nodes";
import { ADVISORY, KIND } from "../constants";

import { BaseBuilder } from "./BaseBuilder";
import { locale } from "../utils";
import { ModifierBuilder } from "./ModifierBuilder";
import { ConstructibleBuilder } from "./ConstructibleBuilder";
import { UnitBuilder } from "./UnitBuilder";
import { ProgressionTreeLocalization, ProgressionTreeNodeLocalization, TProgressionTreeNodeLocalization } from "../localizations";
import { TraditionBuilder } from "./TraditionBuilder";

type TProgressionTreeNodeBuilder = TClassProperties<ProgressionTreeNodeBuilder>

export class ProgressionTreeNodeBuilder extends BaseBuilder<TProgressionTreeNodeBuilder> {
    _current: DatabaseNode = new DatabaseNode();
    _localizations: DatabaseNode = new DatabaseNode();
    _gameEffects: GameEffectNode = new GameEffectNode();

    progressionTreeNode: TPartialRequired<TProgressionTreeNodeNode, 'progressionTreeNodeType'> = {
        progressionTreeNodeType: 'NODE_CIVIC_'
    }
    progressionTreeAdvisories: TObjectValues<typeof ADVISORY>[] = [];
    localizations: TProgressionTreeNodeLocalization[] = [];

    constructor(payload: Partial<TProgressionTreeNodeBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        this._current.fill({
            types: [new TypeNode({
                type: this.progressionTreeNode.progressionTreeNodeType,
                kind: KIND.TREE_NODE,
            })],
            progressionTreeNodes: [new ProgressionTreeNodeNode({
                name: locale(this.progressionTreeNode.progressionTreeNodeType, 'name'),
                ...this.progressionTreeNode
            })],
            progressionTreeAdvisories: this.progressionTreeAdvisories.map(item => {
                return new ProgressionTreeAdvisoryNode({
                    progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                    advisoryClassType: item
                });
            }),
        });

        this.localizations.forEach(item => {
            this._localizations.push(
                new ProgressionTreeNodeLocalization({
                    prefix: this.progressionTreeNode.progressionTreeNodeType,
                    ...item
                }).getNodes()
            );
        });

        return this;
    }

    bind(items: (ModifierBuilder | ConstructibleBuilder | UnitBuilder | TraditionBuilder)[], unlockDepth = 1, hidden: boolean | null = null) {
        items.forEach(item => {
            if (item instanceof ModifierBuilder) {
                item._gameEffects.modifiers.forEach((modifier) => {
                    this._gameEffects.modifiers.push(modifier);

                    if (!item.isDetached) {
                        this._current.progressionTreeNodeUnlocks.push(new ProgressionTreeNodeUnlockNode({
                            progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                            targetKind: KIND.MODIFIER,
                            targetType: modifier.id,
                            unlockDepth: unlockDepth,
                            hidden: hidden
                        }));
                    }
                });

                this._localizations.push(item._localizations);
            }

            if (item instanceof ConstructibleBuilder) {
                item._always.constructibles.forEach((constructible) => {
                    this._current.progressionTreeNodeUnlocks.push(new ProgressionTreeNodeUnlockNode({
                        progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                        targetKind: KIND.CONSTRUCTIBLE,
                        targetType: constructible.constructibleType,
                        unlockDepth: unlockDepth,
                        hidden: hidden
                    }));
                });
            }

            if (item instanceof UnitBuilder) {
                item._current.units.forEach((unit) => {
                    this._current.progressionTreeNodeUnlocks.push(new ProgressionTreeNodeUnlockNode({
                        progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                        targetKind: KIND.UNIT,
                        targetType: unit.unitType,
                        unlockDepth: unlockDepth,
                        hidden: hidden
                    }));
                });
            }

            if (item instanceof TraditionBuilder) {
                item._current.traditions.forEach((tradition) => {
                    this._current.progressionTreeNodeUnlocks.push(new ProgressionTreeNodeUnlockNode({
                        progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                        targetKind: KIND.TRADITION,
                        targetType: tradition.traditionType,
                        unlockDepth: unlockDepth,
                        hidden: hidden
                    }));
                });
            }
        });

        return this;
    }

    build() {
        return [];
    }
}
