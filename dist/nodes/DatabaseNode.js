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
exports.DatabaseNode = void 0;
const lodash = __importStar(require("lodash"));
const BaseNode_1 = require("./BaseNode");
class DatabaseNode extends BaseNode_1.BaseNode {
    constructor(payload = {}) {
        super();
        this._name = 'Database';
        this.kinds = [];
        this.types = [];
        this.tags = [];
        this.typeTags = [];
        this.traits = [];
        this.traitModifiers = [];
        this.civilizations = [];
        this.civilizationItems = [];
        this.civilizationTags = [];
        this.civilizationTraits = [];
        this.civilizationUnlocks = [];
        this.legacyCivilizationTraits = [];
        this.legacyCivilizations = [];
        this.leaderUnlocks = [];
        this.leaderCivilizationBias = [];
        this.buildings = [];
        this.improvements = [];
        this.constructibles = [];
        this.constructibleMaintenances = [];
        this.constructibleValidDistricts = [];
        this.constructibleValidBiomes = [];
        this.constructibleValidFeatures = [];
        this.constructibleValidTerrains = [];
        this.constructibleValidResources = [];
        this.constructibleYieldChanges = [];
        this.adjacencyYieldChanges = [];
        this.constructibleAdjacencies = [];
        this.warehouseYieldChanges = [];
        this.constructibleWarehouseYields = [];
        this.constructiblePlunders = [];
        this.cityNames = [];
        this.districtFreeConstructibles = [];
        this.progressionTreeAdvisories = [];
        this.progressionTrees = [];
        this.progressionTreeNodes = [];
        this.progressionTreeNodeUnlocks = [];
        this.progressionTreePrereqs = [];
        this.traditions = [];
        this.traditionModifiers = [];
        this.units = [];
        this.unitCosts = [];
        this.unitReplaces = [];
        this.unitUpgrades = [];
        this.unitStats = [];
        this.unitAdvisories = [];
        this.englishText = [];
        this.localizedText = [];
        this.iconDefinitions = [];
        this.visualRemaps = [];
        this.uniqueQuarters = [];
        this.uniqueQuarterModifiers = [];
        this.gameModifiers = [];
        this.unlocks = [];
        this.unlockRewards = [];
        this.unlockRequirements = [];
        this.unlockConfigurationValues = [];
        this.requirementSets = [];
        this.requirements = [];
        this.requirementArguments = [];
        this.requirementSetRequirements = [];
        this.startBiasBiomes = [];
        this.startBiasResources = [];
        this.startBiasTerrains = [];
        this.startBiasRivers = [];
        this.startBiasFeatureClasses = [];
        this.startBiasAdjacentToCoasts = [];
        this.visArtCivilizationBuildingCultures = [];
        this.visArtCivilizationUnitCultures = [];
        this.fill(payload);
    }
    push(payload = {}) {
        for (const [key, value] of Object.entries(payload)) {
            this[key] = this[key].concat(value);
        }
    }
    toXmlElement() {
        //check if all nodes is empty
        if (Object.keys(this).filter(key => Array.isArray(this[key])).every(key => this[key].length === 0)) {
            return null;
        }
        const except = [];
        const additionalMapping = {
            constructibleMaintenances: 'Constructible_Maintenances',
            constructibleValidDistricts: 'Constructible_ValidDistricts',
            constructibleValidBiomes: 'Constructible_ValidBiomes',
            constructibleValidFeatures: 'Constructible_ValidFeatures',
            constructibleValidTerrains: 'Constructible_ValidTerrains',
            constructibleValidResources: 'Constructible_ValidResources',
            constructibleYieldChanges: 'Constructible_YieldChanges',
            constructibleAdjacencies: 'Constructible_Adjacencies',
            constructiblePlunders: 'Constructible_Plunders',
            districtFreeConstructibles: 'District_FreeConstructibles',
            adjacencyYieldChanges: 'Adjacency_YieldChanges',
            warehouseYieldChanges: 'Warehouse_YieldChanges',
            constructibleWarehouseYields: 'Constructible_WarehouseYields',
            progressionTreeAdvisories: 'ProgressionTree_Advisories',
            visArtCivilizationBuildingCultures: 'VisArt_CivilizationBuildingCultures',
            visArtCivilizationUnitCultures: 'VisArt_CivilizationUnitCultures',
            unitCosts: 'Unit_Costs',
            unitStats: 'Unit_Stats',
            unitAdvisories: 'Unit_Advisories',
        };
        const data = Object.keys(this)
            .filter(key => !except.includes(key))
            .reduce((prev, current) => {
            if (Array.isArray(this[current])) {
                if (this[current].length === 0) {
                    return prev;
                }
                let key = additionalMapping[current]
                    ? additionalMapping[current]
                    : lodash.startCase(current).replace(/ /g, "");
                return Object.assign(Object.assign({}, prev), { [key]: this[current].map(item => item.toXmlElement()) });
            }
            return prev;
        }, {});
        return {
            Database: Object.assign({}, data)
        };
    }
}
exports.DatabaseNode = DatabaseNode;
//# sourceMappingURL=DatabaseNode.js.map