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
exports.CivilizationBuilder = void 0;
const lodash = __importStar(require("lodash"));
const nodes_1 = require("../nodes");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const files_1 = require("../files");
const localizations_1 = require("../localizations");
const BaseBuilder_1 = require("./BaseBuilder");
const UnitBuilder_1 = require("./UnitBuilder");
const ConstructibleBuilder_1 = require("./ConstructibleBuilder");
const ProgressionTreeBuilder_1 = require("./ProgressionTreeBuilder");
const ModifierBuilder_1 = require("./ModifierBuilder");
const UniqueQuarterBuilder_1 = require("./UniqueQuarterBuilder");
class CivilizationBuilder extends BaseBuilder_1.BaseBuilder {
    constructor(payload = {}) {
        super();
        this._current = new nodes_1.DatabaseNode();
        this._shell = new nodes_1.DatabaseNode();
        this._legacy = new nodes_1.DatabaseNode();
        this._localizations = new nodes_1.DatabaseNode();
        this._icons = new nodes_1.DatabaseNode();
        this._gameEffects = new nodes_1.GameEffectNode();
        this.civilizationTraits = [];
        this.civilizationTags = [];
        this.trait = { traitType: 'TRAIT_' };
        this.traitAbility = { traitType: 'TRAIT_ABILITY_' };
        this.civilization = {
            civilizationType: 'CIVILIZATION_CUSTOM',
            domain: 'AntiquityAgeCivilizations'
        };
        this.civilizationLegacy = { age: constants_1.AGE.ANTIQUITY };
        this.localizations = [];
        this.icon = { path: 'fs://game/civ_sym_han' };
        this.civilizationItems = [];
        this.startBiasBiomes = [];
        this.startBiasResources = [];
        this.startBiasTerrains = [];
        this.startBiasRiver = null;
        this.startBiasFeatureClasses = [];
        this.startBiasAdjacentToCoast = null;
        this.visArtCivilizationBuildingCultures = [];
        this.visArtCivilizationUnitCulture = null;
        this.fill(payload);
    }
    migrate() {
        var _a, _b;
        if (this.trait.traitType === 'TRAIT_') {
            this.trait = {
                traitType: this.civilization.civilizationType.replace('CIVILIZATION_', 'TRAIT_'),
            };
        }
        if (this.traitAbility.traitType === 'TRAIT_ABILITY_') {
            this.traitAbility = {
                traitType: this.trait.traitType + '_ABILITY',
            };
        }
        const civilization = new nodes_1.CivilizationNode(Object.assign({ adjective: (0, utils_1.locale)(this.civilization.civilizationType, 'adjective'), capitalName: (0, utils_1.locale)(this.civilization.civilizationType, 'cityNames_1'), description: (0, utils_1.locale)(this.civilization.civilizationType, 'description'), fullName: (0, utils_1.locale)(this.civilization.civilizationType, 'fullName'), name: (0, utils_1.locale)(this.civilization.civilizationType, 'name') }, this.civilization));
        const trait = new nodes_1.TraitNode(Object.assign({ internalOnly: true }, this.trait));
        const traitAbility = new nodes_1.TraitNode(Object.assign({ name: (0, utils_1.locale)(this.civilization.civilizationType + '_ABILITY', 'name'), description: (0, utils_1.locale)(this.civilization.civilizationType + '_ABILITY', 'description'), internalOnly: true }, this.traitAbility));
        this._current.fill({
            types: [
                new nodes_1.TypeNode({
                    kind: constants_1.KIND.TRAIT,
                    type: this.trait.traitType
                }),
                new nodes_1.TypeNode({
                    kind: constants_1.KIND.TRAIT,
                    type: this.traitAbility.traitType
                }),
            ],
            traits: [trait, traitAbility],
            civilizations: [nodes_1.GameCivilizationNodeSlice.from(civilization)],
            civilizationTraits: [
                new nodes_1.CivilizationTraitNode(Object.assign(Object.assign({}, civilization), this.trait)),
                new nodes_1.CivilizationTraitNode(Object.assign(Object.assign({}, civilization), this.traitAbility)),
                ...this.civilizationTraits.map(item => {
                    return new nodes_1.CivilizationTraitNode(Object.assign(Object.assign({}, civilization), { traitType: item }));
                })
            ],
            startBiasBiomes: this.startBiasBiomes.map(item => {
                return new nodes_1.StartBiasBiomeNode(Object.assign(Object.assign({}, civilization), item));
            }),
            startBiasTerrains: this.startBiasTerrains.map(item => {
                return new nodes_1.StartBiasTerrainNode(Object.assign(Object.assign({}, civilization), item));
            }),
            startBiasFeatureClasses: this.startBiasFeatureClasses.map(item => {
                return new nodes_1.StartBiasFeatureClassNode(Object.assign(Object.assign({}, civilization), item));
            }),
            startBiasResources: this.startBiasResources.map(item => {
                return new nodes_1.StartBiasResourceNode(Object.assign(Object.assign({}, civilization), item));
            }),
            startBiasRivers: this.startBiasRiver !== null ? [
                new nodes_1.StartBiasRiverNode(Object.assign(Object.assign({}, civilization), { score: this.startBiasRiver }))
            ] : [],
            startBiasAdjacentToCoasts: this.startBiasAdjacentToCoast !== null ? [
                new nodes_1.StartBiasAdjacentToCoastNode(Object.assign(Object.assign({}, civilization), { score: this.startBiasAdjacentToCoast }))
            ] : [],
            visArtCivilizationBuildingCultures: this.visArtCivilizationBuildingCultures.map(item => {
                return new nodes_1.VisArtCivilizationBuildingCultureNode(Object.assign(Object.assign({}, civilization), { buildingCulture: item }));
            }),
            visArtCivilizationUnitCultures: this.visArtCivilizationUnitCulture !== null ? [
                new nodes_1.VisArtCivilizationUnitCultureNode(Object.assign(Object.assign({}, civilization), { unitCulture: this.visArtCivilizationUnitCulture }))
            ] : [],
        });
        this._shell.fill({
            civilizations: [nodes_1.ShellCivilizationNodeSlice.from(civilization)],
            civilizationTags: this.civilizationTags.map(item => {
                return new nodes_1.CivilizationTagNode(Object.assign({ civilizationDomain: this.civilization.domain, tagType: item }, civilization));
            }),
            civilizationItems: [
                new nodes_1.CivilizationItemNode(Object.assign(Object.assign(Object.assign({}, civilization), traitAbility), { civilizationDomain: this.civilization.domain, type: this.traitAbility.traitType, kind: constants_1.KIND.TRAIT })),
                ...this.civilizationItems.map(item => {
                    return new nodes_1.CivilizationItemNode(Object.assign(Object.assign({ civilizationDomain: this.civilization.domain }, civilization), item));
                })
            ],
        });
        this._legacy.fill({
            types: [
                new nodes_1.TypeNode({ type: this.civilization.civilizationType, kind: constants_1.KIND.CIVILIZATION }).insertOrIgnore(),
                new nodes_1.TypeNode({ kind: constants_1.KIND.TRAIT, type: this.trait.traitType }).insertOrIgnore(),
                new nodes_1.TypeNode({ kind: constants_1.KIND.TRAIT, type: this.traitAbility.traitType }).insertOrIgnore(),
            ],
            traits: [new nodes_1.TraitNode(trait).insertOrIgnore()],
            legacyCivilizations: [
                new nodes_1.LegacyCivilizationNode(Object.assign(Object.assign({}, civilization), this.civilizationLegacy))
            ],
            legacyCivilizationTraits: [
                new nodes_1.LegacyCivilizationTraitNode(Object.assign(Object.assign({}, civilization), this.trait))
            ]
        });
        this._icons.fill({
            iconDefinitions: [new nodes_1.IconDefinitionNode(Object.assign({ id: this.civilization.civilizationType }, this.icon))]
        });
        this.localizations.forEach(item => {
            this._localizations.push(new localizations_1.CivilizationLocalization(Object.assign({ prefix: this.civilization.civilizationType }, item)).getNodes());
        });
        const cityNamesCount = ((_b = (_a = lodash.maxBy(this.localizations, loc => { var _a; return ((_a = loc.cityNames) === null || _a === void 0 ? void 0 : _a.length) || 0; })) === null || _a === void 0 ? void 0 : _a.cityNames) === null || _b === void 0 ? void 0 : _b.length) || 0;
        for (let i = 1; i <= cityNamesCount; i++) {
            this._current.cityNames.push(new nodes_1.CityNameNode({
                civilizationType: this.civilization.civilizationType,
                cityName: (0, utils_1.locale)(this.civilization.civilizationType, `cityNames_${i}`)
            }));
        }
        return this;
    }
    /**
     * @description Bind entity as unique to this civilization
     * @param items
     */
    bind(items = []) {
        items.forEach(item => {
            if (item instanceof UnitBuilder_1.UnitBuilder) {
                item._current.units.forEach(unit => {
                    unit.traitType = this.trait.traitType;
                    this._shell.civilizationItems.push(new nodes_1.CivilizationItemNode(Object.assign({ civilizationDomain: this.civilization.domain, civilizationType: this.civilization.civilizationType, type: unit.unitType, kind: constants_1.KIND.UNIT, icon: unit.unitType }, unit)));
                });
            }
            if (item instanceof ModifierBuilder_1.ModifierBuilder) {
                item._gameEffects.modifiers.forEach(modifier => {
                    this._gameEffects.modifiers.push(modifier);
                    if (!item.isDetached) {
                        this._current.traitModifiers.push(new nodes_1.TraitModifierNode({
                            traitType: this.traitAbility.traitType,
                            modifierId: modifier.id
                        }));
                    }
                });
            }
            if (item instanceof UniqueQuarterBuilder_1.UniqueQuarterBuilder) {
                item._always.uniqueQuarters.forEach(uniqueQuarter => {
                    uniqueQuarter.traitType = this.trait.traitType;
                    this._shell.civilizationItems.push(new nodes_1.CivilizationItemNode(Object.assign({ civilizationDomain: this.civilization.domain, civilizationType: this.civilization.civilizationType, type: uniqueQuarter.uniqueQuarterType, kind: constants_1.KIND.QUARTER, icon: uniqueQuarter.uniqueQuarterType }, uniqueQuarter)));
                });
            }
            if (item instanceof ConstructibleBuilder_1.ConstructibleBuilder) {
                item._always.buildings.forEach(item => {
                    item.traitType = this.trait.traitType;
                });
                item._always.improvements.forEach(item => {
                    item.traitType = this.trait.traitType;
                });
                item._always.constructibles.forEach(constructible => {
                    this._shell.civilizationItems.push(new nodes_1.CivilizationItemNode(Object.assign({ civilizationDomain: this.civilization.domain, civilizationType: this.civilization.civilizationType, type: constructible.constructibleType, kind: constants_1.KIND.IMPROVEMENT, icon: '' }, constructible)));
                });
            }
            if (item instanceof ProgressionTreeBuilder_1.ProgressionTreeBuilder) {
                item._current.progressionTrees.forEach(progressionTree => {
                    this._gameEffects.modifiers.push(new nodes_1.ModifierNode({
                        id: `MOD_${progressionTree.progressionTreeType}_REVEAL`,
                        effect: constants_1.EFFECT.PLAYER_REVEAL_CULTURE_TREE,
                        requirements: [{
                                type: constants_1.REQUIREMENT.PLAYER_HAS_CIVILIZATION_OR_LEADER_TRAIT,
                                arguments: [{
                                        name: 'TraitType',
                                        value: this.trait.traitType
                                    }]
                            }],
                        arguments: [{
                                name: 'ProgressionTreeType',
                                value: progressionTree.progressionTreeType
                            }]
                    }));
                    item._current.progressionTreeNodeUnlocks.push(new nodes_1.ProgressionTreeNodeUnlockNode({
                        progressionTreeNodeType: 'NODE_CIVIC_AQ_MAIN_CHIEFDOM',
                        targetKind: constants_1.KIND.MODIFIER,
                        targetType: `MOD_${progressionTree.progressionTreeType}_REVEAL`,
                        unlockDepth: 1,
                        hidden: true
                    }));
                });
            }
        });
        return this;
    }
    build() {
        var _a;
        const path = `/civilizations/${lodash.kebabCase((0, utils_1.trim)(this.civilization.civilizationType))}/`;
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
                name: 'legacy.xml',
                content: this._legacy.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new files_1.XmlFile({
                path,
                name: 'shell.xml',
                content: this._shell.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new files_1.XmlFile({
                path,
                name: 'icons.xml',
                content: this._icons.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_ICONS]
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
                name: 'game-effects.xml',
                content: (_a = this._gameEffects) === null || _a === void 0 ? void 0 : _a.toXmlElement(),
                actionGroups: [this.actionGroupBundle.current],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
        ];
    }
}
exports.CivilizationBuilder = CivilizationBuilder;
//# sourceMappingURL=CivilizationBuilder.js.map