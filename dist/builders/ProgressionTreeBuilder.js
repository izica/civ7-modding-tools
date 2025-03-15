"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressionTreeBuilder = void 0;
const lodash = __importStar(require("lodash"));
const nodes_1 = require("../nodes");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const files_1 = require("../files");
const BaseBuilder_1 = require("./BaseBuilder");
const localizations_1 = require("../localizations");
class ProgressionTreeBuilder extends BaseBuilder_1.BaseBuilder {
    constructor(payload = {}) {
        super();
        this._current = new nodes_1.DatabaseNode();
        this._gameEffects = new nodes_1.GameEffectNode();
        this._localizations = new nodes_1.DatabaseNode();
        this.progressionTree = {
            progressionTreeType: 'TREE_CIVICS_CUSTOM',
            ageType: constants_1.AGE.ANTIQUITY
        };
        this.progressionTreePrereqs = [];
        this.localizations = [];
        this.fill(payload);
    }
    migrate() {
        this._current.fill({
            types: [new nodes_1.TypeNode({
                    type: this.progressionTree.progressionTreeType,
                    kind: constants_1.KIND.TREE,
                })],
            progressionTrees: [new nodes_1.ProgressionTreeNode(Object.assign(Object.assign({}, this.progressionTree), { name: (0, utils_1.locale)(this.progressionTree.progressionTreeType, 'name') }))],
            progressionTreePrereqs: this.progressionTreePrereqs.map(item => {
                return new nodes_1.ProgressionTreePrereqNode(item);
            })
        });
        this.localizations.forEach(item => {
            this._localizations.push(new localizations_1.ProgressionTreeLocalization(Object.assign({ prefix: this.progressionTree.progressionTreeType }, item)).getNodes());
        });
        return this;
    }
    bind(items) {
        items.forEach(item => {
            item._current.progressionTreeNodes.forEach(item => {
                item.fill({
                    progressionTree: this.progressionTree.progressionTreeType,
                });
            });
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
        });
        return this;
    }
    build() {
        var _a;
        const path = `/progression-trees/${lodash.kebabCase((0, utils_1.trim)(this.progressionTree.progressionTreeType))}/`;
        return [
            new files_1.XmlFile({
                path,
                name: 'current.xml',
                content: this._current.toXmlElement(),
                actionGroups: [this.actionGroupBundle.current],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new files_1.XmlFile({
                path,
                name: 'game-effects.xml',
                content: (_a = this._gameEffects) === null || _a === void 0 ? void 0 : _a.toXmlElement(),
                actionGroups: [this.actionGroupBundle.current],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new files_1.XmlFile({
                path,
                name: 'localization.xml',
                content: this._localizations.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_TEXT]
            }),
        ];
    }
}
exports.ProgressionTreeBuilder = ProgressionTreeBuilder;
//# sourceMappingURL=ProgressionTreeBuilder.js.map