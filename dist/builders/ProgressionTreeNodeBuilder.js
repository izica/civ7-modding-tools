"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressionTreeNodeBuilder = void 0;
const nodes_1 = require("../nodes");
const constants_1 = require("../constants");
const BaseBuilder_1 = require("./BaseBuilder");
const utils_1 = require("../utils");
const ModifierBuilder_1 = require("./ModifierBuilder");
const ConstructibleBuilder_1 = require("./ConstructibleBuilder");
const UnitBuilder_1 = require("./UnitBuilder");
const localizations_1 = require("../localizations");
const TraditionBuilder_1 = require("./TraditionBuilder");
class ProgressionTreeNodeBuilder extends BaseBuilder_1.BaseBuilder {
    constructor(payload = {}) {
        super();
        this._current = new nodes_1.DatabaseNode();
        this._localizations = new nodes_1.DatabaseNode();
        this._gameEffects = new nodes_1.GameEffectNode();
        this.progressionTreeNode = {
            progressionTreeNodeType: 'NODE_CIVIC_'
        };
        this.progressionTreeAdvisories = [];
        this.localizations = [];
        this.fill(payload);
    }
    migrate() {
        this._current.fill({
            types: [new nodes_1.TypeNode({
                    type: this.progressionTreeNode.progressionTreeNodeType,
                    kind: constants_1.KIND.TREE_NODE,
                })],
            progressionTreeNodes: [new nodes_1.ProgressionTreeNodeNode(Object.assign({ name: (0, utils_1.locale)(this.progressionTreeNode.progressionTreeNodeType, 'name') }, this.progressionTreeNode))],
            progressionTreeAdvisories: this.progressionTreeAdvisories.map(item => {
                return new nodes_1.ProgressionTreeAdvisoryNode({
                    progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                    advisoryClassType: item
                });
            }),
        });
        this.localizations.forEach(item => {
            this._localizations.push(new localizations_1.ProgressionTreeNodeLocalization(Object.assign({ prefix: this.progressionTreeNode.progressionTreeNodeType }, item)).getNodes());
        });
        return this;
    }
    bind(items, unlockDepth = 1, hidden = null) {
        items.forEach(item => {
            if (item instanceof ModifierBuilder_1.ModifierBuilder) {
                item._gameEffects.modifiers.forEach((modifier) => {
                    this._gameEffects.modifiers.push(modifier);
                    if (!item.isDetached) {
                        this._current.progressionTreeNodeUnlocks.push(new nodes_1.ProgressionTreeNodeUnlockNode({
                            progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                            targetKind: constants_1.KIND.MODIFIER,
                            targetType: modifier.id,
                            unlockDepth: unlockDepth,
                            hidden: hidden
                        }));
                    }
                });
                this._localizations.push(item._localizations);
            }
            if (item instanceof ConstructibleBuilder_1.ConstructibleBuilder) {
                item._always.constructibles.forEach((constructible) => {
                    this._current.progressionTreeNodeUnlocks.push(new nodes_1.ProgressionTreeNodeUnlockNode({
                        progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                        targetKind: constants_1.KIND.CONSTRUCTIBLE,
                        targetType: constructible.constructibleType,
                        unlockDepth: unlockDepth,
                        hidden: hidden
                    }));
                });
            }
            if (item instanceof UnitBuilder_1.UnitBuilder) {
                item._current.units.forEach((unit) => {
                    this._current.progressionTreeNodeUnlocks.push(new nodes_1.ProgressionTreeNodeUnlockNode({
                        progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                        targetKind: constants_1.KIND.UNIT,
                        targetType: unit.unitType,
                        unlockDepth: unlockDepth,
                        hidden: hidden
                    }));
                });
            }
            if (item instanceof TraditionBuilder_1.TraditionBuilder) {
                item._current.traditions.forEach((tradition) => {
                    this._current.progressionTreeNodeUnlocks.push(new nodes_1.ProgressionTreeNodeUnlockNode({
                        progressionTreeNodeType: this.progressionTreeNode.progressionTreeNodeType,
                        targetKind: constants_1.KIND.TRADITION,
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
exports.ProgressionTreeNodeBuilder = ProgressionTreeNodeBuilder;
//# sourceMappingURL=ProgressionTreeNodeBuilder.js.map