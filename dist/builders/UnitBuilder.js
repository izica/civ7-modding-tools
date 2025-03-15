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
exports.UnitBuilder = void 0;
const lodash = __importStar(require("lodash"));
const nodes_1 = require("../nodes");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const files_1 = require("../files");
const localizations_1 = require("../localizations");
const BaseBuilder_1 = require("./BaseBuilder");
class UnitBuilder extends BaseBuilder_1.BaseBuilder {
    constructor(payload = {}) {
        super();
        this._current = new nodes_1.DatabaseNode();
        this._localizations = new nodes_1.DatabaseNode();
        this._icons = new nodes_1.DatabaseNode();
        this._visualRemap = null;
        this.unit = { unitType: 'UNIT_CUSTOM' };
        this.unitStat = {};
        this.unitCost = {};
        this.icon = {
            path: 'fs://game/civ_sym_han'
        };
        this.unitReplace = null;
        this.unitUpgrade = null;
        this.visualRemap = null;
        this.unitAdvisories = [];
        this.localizations = [];
        this.typeTags = [];
        this.fill(payload);
    }
    migrate() {
        this._current.fill({
            types: [
                new nodes_1.TypeNode({
                    type: this.unit.unitType,
                    kind: constants_1.KIND.UNIT
                })
            ],
            units: [
                new nodes_1.UnitNode(Object.assign({ name: (0, utils_1.locale)(this.unit.unitType, 'name'), description: (0, utils_1.locale)(this.unit.unitType, 'description') }, this.unit))
            ],
            tags: [
                new nodes_1.TagNode({
                    category: 'UNIT_CLASS',
                    tag: this.unit.unitType.replace('UNIT_', 'UNIT_CLASS_')
                })
            ],
            typeTags: [
                new nodes_1.TypeTagNode({
                    type: this.unit.unitType,
                    tag: this.unit.unitType.replace('UNIT_', 'UNIT_CLASS_')
                }),
                ...this.typeTags.map(item => new nodes_1.TypeTagNode({
                    type: this.unit.unitType,
                    tag: item
                }))
            ],
            unitStats: [new nodes_1.UnitStatNode(Object.assign(Object.assign({}, this.unit), this.unitStat))],
            unitCosts: [new nodes_1.UnitCostNode(Object.assign(Object.assign({}, this.unit), this.unitCost))],
            unitReplaces: this.unitReplace ? [new nodes_1.UnitReplaceNode(Object.assign({ civUniqueUnitType: this.unit.unitType }, this.unitReplace))] : [],
            unitUpgrades: this.unitUpgrade ? [new nodes_1.UnitUpgradeNode(Object.assign({ unit: this.unit.unitType }, this.unitUpgrade))] : [],
            unitAdvisories: this.unitAdvisories.map(item => new nodes_1.UnitAdvisoryNode(Object.assign({ unitType: this.unit.unitType }, item)))
        });
        if (this.visualRemap) {
            this._visualRemap = new nodes_1.DatabaseNode({
                visualRemaps: [
                    new nodes_1.VisualRemapNode(Object.assign({ id: `REMAP_${this.unit.unitType}`, displayName: (0, utils_1.locale)(this.unit.unitType, 'name'), kind: 'UNIT', from: this.unit.unitType }, this.visualRemap))
                ]
            });
        }
        this._icons.fill({
            iconDefinitions: [new nodes_1.IconDefinitionNode(Object.assign({ id: this.unit.unitType }, this.icon))]
        });
        this.localizations.forEach(item => {
            this._localizations.push(new localizations_1.UnitLocalization(Object.assign({ prefix: this.unit.unitType }, item)).getNodes());
        });
        return this;
    }
    build() {
        var _a;
        const path = `/units/${lodash.kebabCase((0, utils_1.trim)(this.unit.unitType))}/`;
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
                name: 'visual-remap.xml',
                content: (_a = this._visualRemap) === null || _a === void 0 ? void 0 : _a.toXmlElement(),
                actionGroups: [this.actionGroupBundle.current],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_VISUAL_REMAPS]
            }),
            new files_1.XmlFile({
                path,
                name: 'localization.xml',
                content: this._localizations.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_TEXT]
            }),
            new files_1.XmlFile({
                path,
                name: 'icons.xml',
                content: this._icons.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.current],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_ICONS]
            }),
        ];
    }
}
exports.UnitBuilder = UnitBuilder;
//# sourceMappingURL=UnitBuilder.js.map