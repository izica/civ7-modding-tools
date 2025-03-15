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
exports.ConstructibleBuilder = void 0;
const lodash = __importStar(require("lodash"));
const nodes_1 = require("../nodes");
const constants_1 = require("../constants");
const files_1 = require("../files");
const localizations_1 = require("../localizations");
const utils_1 = require("../utils");
const BaseBuilder_1 = require("./BaseBuilder");
const AdjacencyYieldChangeNode_1 = require("../nodes/AdjacencyYieldChangeNode");
const ConstructibleAdjacencyNode_1 = require("../nodes/ConstructibleAdjacencyNode");
class ConstructibleBuilder extends BaseBuilder_1.BaseBuilder {
    constructor(payload = {}) {
        super();
        this._always = new nodes_1.DatabaseNode();
        this._localizations = new nodes_1.DatabaseNode();
        this._icons = new nodes_1.DatabaseNode();
        this.typeTags = [];
        this.constructibleValidDistricts = [];
        this.constructibleValidBiomes = [];
        this.constructibleValidFeatures = [];
        this.constructibleValidTerrains = [];
        this.constructibleValidResources = [];
        this.constructiblePlunders = [];
        this.building = null;
        this.improvement = null;
        this.constructible = {
            constructibleType: 'BUILDING_CUSTOM',
        };
        this.constructibleYieldChanges = [];
        this.constructibleMaintenances = [];
        this.adjacencyYieldChanges = [];
        this.icon = {
            path: 'fs://game/civ_sym_han'
        };
        this.districtFreeConstructibles = [];
        this.localizations = [];
        this.fill(payload);
    }
    migrate() {
        if (!this.improvement && !this.building) {
            if (this.constructible.constructibleType.startsWith('BUILDING_')) {
                this.building = {};
            }
            if (this.constructible.constructibleType.startsWith('IMPROVEMENT_')) {
                this.improvement = {};
            }
        }
        this._always.fill({
            types: [new nodes_1.TypeNode({
                    type: this.constructible.constructibleType,
                    kind: constants_1.KIND.CONSTRUCTIBLE
                })],
            buildings: this.building ? [new nodes_1.BuildingNode(Object.assign(Object.assign({}, this.constructible), this.building))] : [],
            improvements: this.improvement ? [new nodes_1.ImprovementNode(Object.assign(Object.assign({}, this.constructible), this.improvement))] : [],
            typeTags: this.typeTags.map(item => new nodes_1.TypeTagNode({
                type: this.constructible.constructibleType,
                tag: item
            })),
            constructibles: [new nodes_1.ConstructibleNode(Object.assign({ name: (0, utils_1.locale)(this.constructible.constructibleType, 'name'), description: (0, utils_1.locale)(this.constructible.constructibleType, 'description'), tooltip: (0, utils_1.locale)(this.constructible.constructibleType, 'tooltip') }, this.constructible))],
            constructibleValidDistricts: this.constructibleValidDistricts.map(item => {
                return new nodes_1.ConstructibleValidDistrictNode(Object.assign(Object.assign({}, this.constructible), { districtType: item }));
            }),
            constructibleValidBiomes: this.constructibleValidBiomes.map(item => {
                return new nodes_1.ConstructibleValidBiomeNode(Object.assign(Object.assign({}, this.constructible), { biomeType: item }));
            }),
            constructibleValidFeatures: this.constructibleValidFeatures.map(item => {
                return new nodes_1.ConstructibleValidFeatureNode(Object.assign(Object.assign({}, this.constructible), { featureType: item }));
            }),
            constructibleValidTerrains: this.constructibleValidTerrains.map(item => {
                return new nodes_1.ConstructibleValidTerrainNode(Object.assign(Object.assign({}, this.constructible), { terrainType: item }));
            }),
            constructibleValidResources: this.constructibleValidResources.map(item => {
                return new nodes_1.ConstructibleValidResourceNode(Object.assign(Object.assign({}, this.constructible), item));
            }),
            constructiblePlunders: this.constructiblePlunders.map(item => {
                return new nodes_1.ConstructiblePlunderNode(Object.assign(Object.assign({}, this.constructible), item));
            }),
            constructibleMaintenances: this.constructibleMaintenances.map(item => {
                return new nodes_1.ConstructibleMaintenanceNode(Object.assign(Object.assign({}, this.constructible), item));
            }),
            constructibleYieldChanges: this.constructibleYieldChanges.map(item => {
                return new nodes_1.ConstructibleYieldChangeNode(Object.assign(Object.assign({}, this.constructible), item));
            }),
            districtFreeConstructibles: this.districtFreeConstructibles.map(item => {
                return new nodes_1.DistrictFreeConstructibleNode(Object.assign({ constructibleType: this.constructible.constructibleType }, item));
            }),
        });
        if (this.adjacencyYieldChanges.length) {
            this.adjacencyYieldChanges.forEach(item => {
                const adjacencyYieldChange = new AdjacencyYieldChangeNode_1.AdjacencyYieldChangeNode(item);
                this._always.constructibleAdjacencies.push(new ConstructibleAdjacencyNode_1.ConstructibleAdjacencyNode({
                    constructibleType: this.constructible.constructibleType,
                    yieldChangeId: adjacencyYieldChange.id,
                }));
                this._always.adjacencyYieldChanges.push(adjacencyYieldChange);
            });
        }
        this._icons.fill({
            iconDefinitions: [new nodes_1.IconDefinitionNode(Object.assign({ id: this.constructible.constructibleType }, this.icon))]
        });
        this.localizations.forEach(item => {
            this._localizations.push(new localizations_1.ConstructibleLocalization(Object.assign({ prefix: this.constructible.constructibleType }, item)).getNodes());
        });
        return this;
    }
    build() {
        const path = `/constructibles/${lodash.kebabCase((0, utils_1.trim)(this.constructible.constructibleType))}/`;
        return [
            new files_1.XmlFile({
                path,
                name: 'always.xml',
                content: this._always.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_DATABASE]
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
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_ICONS]
            }),
        ];
    }
}
exports.ConstructibleBuilder = ConstructibleBuilder;
//# sourceMappingURL=ConstructibleBuilder.js.map