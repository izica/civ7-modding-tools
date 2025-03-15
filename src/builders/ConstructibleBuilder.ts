import * as lodash from "lodash";

import { TClassProperties, TObjectValues, TPartialRequired } from "../types";
import {
    BuildingNode,
    ConstructibleMaintenanceNode,
    ConstructibleNode,
    ConstructiblePlunderNode,
    ConstructibleValidBiomeNode,
    ConstructibleValidDistrictNode,
    ConstructibleValidFeatureNode,
    ConstructibleValidResourceNode,
    ConstructibleValidTerrainNode,
    ConstructibleYieldChangeNode,
    DatabaseNode,
    DistrictFreeConstructibleNode,
    IconDefinitionNode,
    ImprovementNode,
    TBuildingNode,
    TConstructibleMaintenanceNode,
    TConstructibleNode,
    TConstructibleValidResourceNode,
    TConstructibleYieldChangeNode,
    TDistrictFreeConstructibleNode,
    TIconDefinitionNode,
    TImprovementNode,
    TypeNode,
    TypeTagNode
} from "../nodes";
import { ACTION_GROUP_ACTION, BIOME, CONSTRUCTIBLE_TYPE_TAG, DISTRICT, FEATURE, KIND, TERRAIN } from "../constants";
import { XmlFile } from "../files";
import { ConstructibleLocalization, TConstructibleLocalization } from "../localizations";
import { locale, trim } from "../utils";

import { BaseBuilder } from "./BaseBuilder";
import { AdjacencyYieldChangeNode, TAdjacencyYieldChangeNode } from "../nodes/AdjacencyYieldChangeNode";
import { ConstructibleAdjacencyNode } from "../nodes/ConstructibleAdjacencyNode";

type TConstructibleBuilder = TClassProperties<ConstructibleBuilder>

export class ConstructibleBuilder extends BaseBuilder<TConstructibleBuilder> {
    _always: DatabaseNode = new DatabaseNode();
    _localizations: DatabaseNode = new DatabaseNode();
    _icons: DatabaseNode = new DatabaseNode();

    typeTags: TObjectValues<typeof CONSTRUCTIBLE_TYPE_TAG>[] = [];
    constructibleValidDistricts: TObjectValues<typeof DISTRICT>[] = [];
    constructibleValidBiomes: TObjectValues<typeof BIOME>[] = [];
    constructibleValidFeatures: TObjectValues<typeof FEATURE>[] = [];
    constructibleValidTerrains: TObjectValues<typeof TERRAIN>[] = [];
    constructibleValidResources: TPartialRequired<TConstructibleValidResourceNode, 'resourceType'>[] = [];
    constructiblePlunders: TPartialRequired<ConstructiblePlunderNode, 'plunderType'>[] = [];

    building: Partial<TBuildingNode> | null = null;
    improvement: Partial<TImprovementNode> | null = null;
    constructible: TPartialRequired<TConstructibleNode, 'constructibleType'> = {
        constructibleType: 'BUILDING_CUSTOM',
    }
    constructibleYieldChanges: Partial<TConstructibleYieldChangeNode>[] = [];
    constructibleMaintenances: Partial<TConstructibleMaintenanceNode>[] = [];

    adjacencyYieldChanges: Partial<TAdjacencyYieldChangeNode>[] = [];

    icon: TPartialRequired<TIconDefinitionNode, 'path'> = {
        path: 'fs://game/civ_sym_han'
    }

    districtFreeConstructibles: TPartialRequired<TDistrictFreeConstructibleNode, 'districtType'>[] = [];

    localizations: TConstructibleLocalization[] = [];

    constructor(payload: Partial<TConstructibleBuilder> = {}) {
        super();
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
            types: [new TypeNode({
                type: this.constructible.constructibleType,
                kind: KIND.CONSTRUCTIBLE
            })],
            buildings: this.building ? [new BuildingNode({
                ...this.constructible,
                ...this.building
            })] : [],
            improvements: this.improvement ? [new ImprovementNode({
                ...this.constructible,
                ...this.improvement
            })] : [],
            typeTags: this.typeTags.map(item => new TypeTagNode({
                type: this.constructible.constructibleType,
                tag: item
            })),
            constructibles: [new ConstructibleNode({
                name: locale(this.constructible.constructibleType, 'name'),
                description: locale(this.constructible.constructibleType, 'description'),
                tooltip: locale(this.constructible.constructibleType, 'tooltip'),
                ...this.constructible
            })],
            constructibleValidDistricts: this.constructibleValidDistricts.map(item => {
                return new ConstructibleValidDistrictNode({
                    ...this.constructible,
                    districtType: item
                })
            }),
            constructibleValidBiomes: this.constructibleValidBiomes.map(item => {
                return new ConstructibleValidBiomeNode({
                    ...this.constructible,
                    biomeType: item
                })
            }),
            constructibleValidFeatures: this.constructibleValidFeatures.map(item => {
                return new ConstructibleValidFeatureNode({
                    ...this.constructible,
                    featureType: item
                })
            }),
            constructibleValidTerrains: this.constructibleValidTerrains.map(item => {
                return new ConstructibleValidTerrainNode({
                    ...this.constructible,
                    terrainType: item
                })
            }),
            constructibleValidResources: this.constructibleValidResources.map(item => {
                return new ConstructibleValidResourceNode({
                    ...this.constructible,
                    ...item
                })
            }),
            constructiblePlunders: this.constructiblePlunders.map(item => {
                return new ConstructiblePlunderNode({
                    ...this.constructible,
                    ...item
                })
            }),
            constructibleMaintenances: this.constructibleMaintenances.map(item => {
                return new ConstructibleMaintenanceNode({
                    ...this.constructible,
                    ...item
                })
            }),
            constructibleYieldChanges: this.constructibleYieldChanges.map(item => {
                return new ConstructibleYieldChangeNode({
                    ...this.constructible,
                    ...item
                })
            }),
            districtFreeConstructibles: this.districtFreeConstructibles.map(item => {
                return new DistrictFreeConstructibleNode({
                    constructibleType: this.constructible.constructibleType,
                    ...item
                })
            }),
        });

        if (this.adjacencyYieldChanges.length) {
            this.adjacencyYieldChanges.forEach(item => {
                const adjacencyYieldChange = new AdjacencyYieldChangeNode(item);
                this._always.constructibleAdjacencies.push(new ConstructibleAdjacencyNode({
                    constructibleType: this.constructible.constructibleType,
                    yieldChangeId: adjacencyYieldChange.id,
                }))
                this._always.adjacencyYieldChanges.push(adjacencyYieldChange);
            });
        }

        this._icons.fill({
            iconDefinitions: [new IconDefinitionNode({
                id: this.constructible.constructibleType,
                ...this.icon,
            })]
        })

        this.localizations.forEach(item => {
            this._localizations.push(
                new ConstructibleLocalization({
                    prefix: this.constructible.constructibleType,
                    ...item
                }).getNodes()
            );
        });

        return this;
    }

    build() {
        const path = `/constructibles/${lodash.kebabCase(trim(this.constructible.constructibleType))}/`;
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
                name: 'localization.xml',
                content: this._localizations.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_TEXT]
            }),
            new XmlFile({
                path,
                name: 'icons.xml',
                content: this._icons.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_ICONS]
            }),
        ]
    }
}
