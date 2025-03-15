import * as lodash from "lodash";

import { TClassProperties, TObjectValues, TPartialRequired } from "../types";
import {
    CityNameNode,
    CivilizationItemNode,
    CivilizationNode,
    CivilizationTagNode,
    CivilizationTraitNode, CivilizationUnlockNode,
    DatabaseNode,
    GameCivilizationNodeSlice,
    GameEffectNode,
    IconDefinitionNode, LeaderCivilizationBiasNode, LeaderUnlockNode,
    LegacyCivilizationNode,
    LegacyCivilizationTraitNode,
    ModifierNode,
    ProgressionTreeNodeUnlockNode,
    ShellCivilizationNodeSlice,
    StartBiasAdjacentToCoastNode,
    StartBiasBiomeNode,
    StartBiasFeatureClassNode,
    StartBiasResourceNode,
    StartBiasRiverNode,
    StartBiasTerrainNode,
    TCivilizationItemNode,
    TCivilizationNode,
    TIconDefinitionNode,
    TLegacyCivilizationNode,
    TraitModifierNode,
    TraitNode,
    TStartBiasBiomeNode,
    TStartBiasFeatureClassNode,
    TStartBiasResourceNode,
    TStartBiasTerrainNode,
    TTraitNode,
    TypeNode,
    VisArtCivilizationBuildingCultureNode,
    VisArtCivilizationUnitCultureNode
} from "../nodes";
import { ACTION_GROUP_ACTION, AGE, BUILDING_CULTURES, CIVILIZATION_DOMAIN, EFFECT, KIND, REQUIREMENT, TAG_TRAIT, TRAIT, UNIT_CULTURE } from "../constants";
import { locale, trim } from "../utils";
import { XmlFile } from "../files";
import { CivilizationLocalization, TCivilizationLocalization } from "../localizations";

import { BaseBuilder } from "./BaseBuilder";
import { UnitBuilder } from "./UnitBuilder";
import { ConstructibleBuilder } from "./ConstructibleBuilder";
import { ProgressionTreeBuilder } from "./ProgressionTreeBuilder";
import { ModifierBuilder } from "./ModifierBuilder";
import { UniqueQuarterBuilder } from "./UniqueQuarterBuilder";

type TCivilizationBuilder = TClassProperties<CivilizationBuilder>

export class CivilizationBuilder extends BaseBuilder<TCivilizationBuilder> {
    _current: DatabaseNode = new DatabaseNode();
    _shell: DatabaseNode = new DatabaseNode();
    _legacy: DatabaseNode = new DatabaseNode();
    _localizations: DatabaseNode = new DatabaseNode();
    _icons: DatabaseNode = new DatabaseNode();
    _gameEffects: GameEffectNode = new GameEffectNode();

    civilizationTraits: (TObjectValues<typeof TRAIT> | string)[] = [];
    civilizationTags: TObjectValues<typeof TAG_TRAIT>[] = [];

    trait: TPartialRequired<TTraitNode, 'traitType'> = { traitType: 'TRAIT_' };
    traitAbility: TPartialRequired<TraitNode, 'traitType'> = { traitType: 'TRAIT_ABILITY_' };
    civilization: TPartialRequired<TCivilizationNode, 'civilizationType' | 'domain'> = {
        civilizationType: 'CIVILIZATION_CUSTOM',
        domain: 'AntiquityAgeCivilizations'
    }
    civilizationLegacy: TPartialRequired<TLegacyCivilizationNode, 'age'> = { age: AGE.ANTIQUITY }
    localizations: Partial<TCivilizationLocalization>[] = [];
    icon: TPartialRequired<TIconDefinitionNode, 'path'> = { path: 'fs://game/civ_sym_han' }
    civilizationItems: TPartialRequired<TCivilizationItemNode, "type" | "kind">[] = [];

    startBiasBiomes: TPartialRequired<TStartBiasBiomeNode, 'biomeType'>[] = [];
    startBiasResources: TPartialRequired<TStartBiasResourceNode, 'resourceType'>[] = [];
    startBiasTerrains: TPartialRequired<TStartBiasTerrainNode, 'terrainType'>[] = [];
    startBiasRiver: number | null = null;
    startBiasFeatureClasses: TPartialRequired<TStartBiasFeatureClassNode, 'featureClassType'>[] = [];
    startBiasAdjacentToCoast: number | null = null;
    visArtCivilizationBuildingCultures: TObjectValues<typeof BUILDING_CULTURES>[] = [];
    visArtCivilizationUnitCulture: TObjectValues<typeof UNIT_CULTURE> | null = null;

    constructor(payload: Partial<TCivilizationBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        if (this.trait.traitType === 'TRAIT_') {
            this.trait = {
                traitType: this.civilization.civilizationType.replace('CIVILIZATION_', 'TRAIT_'),
            }
        }
        if (this.traitAbility.traitType === 'TRAIT_ABILITY_') {
            this.traitAbility = {
                traitType: this.trait.traitType + '_ABILITY',
            }
        }

        const civilization = new CivilizationNode({
            adjective: locale(this.civilization.civilizationType, 'adjective'),
            capitalName: locale(this.civilization.civilizationType, 'cityNames_1'),
            description: locale(this.civilization.civilizationType, 'description'),
            fullName: locale(this.civilization.civilizationType, 'fullName'),
            name: locale(this.civilization.civilizationType, 'name'),
            ...this.civilization,
        });

        const trait = new TraitNode({
            internalOnly: true,
            ...this.trait
        });

        const traitAbility = new TraitNode({
            name: locale(this.civilization.civilizationType + '_ABILITY', 'name'),
            description: locale(this.civilization.civilizationType + '_ABILITY', 'description'),
            internalOnly: true,
            ...this.traitAbility
        });

        this._current.fill({
            types: [
                new TypeNode({
                    kind: KIND.TRAIT,
                    type: this.trait.traitType
                }),
                new TypeNode({
                    kind: KIND.TRAIT,
                    type: this.traitAbility.traitType
                }),
            ],
            traits: [trait, traitAbility],
            civilizations: [GameCivilizationNodeSlice.from(civilization)],
            civilizationTraits: [
                new CivilizationTraitNode({
                    ...civilization,
                    ...this.trait
                }),
                new CivilizationTraitNode({
                    ...civilization,
                    ...this.traitAbility
                }),
                ...this.civilizationTraits.map(item => {
                    return new CivilizationTraitNode({
                        ...civilization,
                        traitType: item,
                    })
                })
            ],
            startBiasBiomes: this.startBiasBiomes.map(item => {
                return new StartBiasBiomeNode({
                    ...civilization,
                    ...item
                })
            }),
            startBiasTerrains: this.startBiasTerrains.map(item => {
                return new StartBiasTerrainNode({
                    ...civilization,
                    ...item
                })
            }),
            startBiasFeatureClasses: this.startBiasFeatureClasses.map(item => {
                return new StartBiasFeatureClassNode({
                    ...civilization,
                    ...item
                })
            }),
            startBiasResources: this.startBiasResources.map(item => {
                return new StartBiasResourceNode({
                    ...civilization,
                    ...item
                })
            }),
            startBiasRivers: this.startBiasRiver !== null ? [
                new StartBiasRiverNode({
                    ...civilization,
                    score: this.startBiasRiver
                })
            ] : [],
            startBiasAdjacentToCoasts: this.startBiasAdjacentToCoast !== null ? [
                new StartBiasAdjacentToCoastNode({
                    ...civilization,
                    score: this.startBiasAdjacentToCoast
                })
            ] : [],
            visArtCivilizationBuildingCultures: this.visArtCivilizationBuildingCultures.map(item => {
                return new VisArtCivilizationBuildingCultureNode({
                    ...civilization,
                    buildingCulture: item
                })
            }),
            visArtCivilizationUnitCultures: this.visArtCivilizationUnitCulture !== null ? [
                new VisArtCivilizationUnitCultureNode({
                    ...civilization,
                    unitCulture: this.visArtCivilizationUnitCulture
                })
            ] : [],
        });

        this._shell.fill({
            civilizations: [ShellCivilizationNodeSlice.from(civilization)],
            civilizationTags: this.civilizationTags.map(item => {
                return new CivilizationTagNode({
                    civilizationDomain: this.civilization.domain,
                    tagType: item,
                    ...civilization,
                })
            }),
            civilizationItems: [
                new CivilizationItemNode({
                    ...civilization,
                    ...traitAbility,
                    civilizationDomain: this.civilization.domain,
                    type: this.traitAbility.traitType,
                    kind: KIND.TRAIT,
                }),
                ...this.civilizationItems.map(item => {
                    return new CivilizationItemNode({
                        civilizationDomain: this.civilization.domain,
                        ...civilization,
                        ...item
                    })
                })
            ],
        });

        this._legacy.fill({
            types: [
                new TypeNode({ type: this.civilization.civilizationType, kind: KIND.CIVILIZATION }).insertOrIgnore(),
                new TypeNode({ kind: KIND.TRAIT, type: this.trait.traitType }).insertOrIgnore(),
                new TypeNode({ kind: KIND.TRAIT, type: this.traitAbility.traitType }).insertOrIgnore(),
            ],
            traits: [new TraitNode(trait).insertOrIgnore()],
            legacyCivilizations: [
                new LegacyCivilizationNode({
                    ...civilization,
                    ...this.civilizationLegacy
                })
            ],
            legacyCivilizationTraits: [
                new LegacyCivilizationTraitNode({
                    ...civilization,
                    ...this.trait
                })
            ]
        });

        this._icons.fill({
            iconDefinitions: [new IconDefinitionNode({
                id: this.civilization.civilizationType,
                ...this.icon,
            })]
        });

        this._localizations.fill({
            englishText: this.localizations.map(item => {
                return new CivilizationLocalization({
                    prefix: this.civilization.civilizationType,
                    ...item
                });
            }).flatMap(item => item.getNodes())
        });

        const cityNamesCount = lodash.maxBy(this.localizations, loc => loc.cityNames?.length || 0)?.cityNames?.length || 0;
        for (let i = 1; i <= cityNamesCount; i++) {
            this._current.cityNames.push(new CityNameNode({
                civilizationType: this.civilization.civilizationType,
                cityName: locale(this.civilization.civilizationType, `cityNames_${i}`)
            }));
        }

        return this;
    }

    /**
     * @description Bind entity as unique to this civilization
     * @param items
     */
    bind(items: (UnitBuilder | ConstructibleBuilder | ProgressionTreeBuilder | ModifierBuilder | UniqueQuarterBuilder)[] = []) {
        items.forEach(item => {
            if (item instanceof UnitBuilder) {
                item._current.units.forEach(unit => {
                    unit.traitType = this.trait.traitType;

                    this._shell.civilizationItems.push(
                        new CivilizationItemNode({
                            civilizationDomain: this.civilization.domain,
                            civilizationType: this.civilization.civilizationType,
                            type: unit.unitType,
                            kind: KIND.UNIT,
                            icon: unit.unitType,
                            ...unit,
                        })
                    )
                });
            }

            if (item instanceof ModifierBuilder) {
                item._gameEffects.modifiers.forEach(modifier => {
                    this._gameEffects.modifiers.push(modifier);

                    if (!item.isDetached) {
                        this._current.traitModifiers.push(new TraitModifierNode({
                            traitType: this.traitAbility.traitType,
                            modifierId: modifier.id
                        }));
                    }
                })
            }

            if (item instanceof UniqueQuarterBuilder) {
                item._always.uniqueQuarters.forEach(uniqueQuarter => {
                    uniqueQuarter.traitType = this.trait.traitType;

                    this._shell.civilizationItems.push(
                        new CivilizationItemNode({
                            civilizationDomain: this.civilization.domain,
                            civilizationType: this.civilization.civilizationType,
                            type: uniqueQuarter.uniqueQuarterType,
                            kind: KIND.QUARTER,
                            icon: uniqueQuarter.uniqueQuarterType,
                            ...uniqueQuarter,
                        })
                    )
                });
            }

            if (item instanceof ConstructibleBuilder) {
                item._always.buildings.forEach(item => {
                    item.traitType = this.trait.traitType;
                });
                item._always.improvements.forEach(item => {
                    item.traitType = this.trait.traitType;
                });
                item._always.constructibles.forEach(constructible => {
                    this._shell.civilizationItems.push(
                        new CivilizationItemNode({
                            civilizationDomain: this.civilization.domain,
                            civilizationType: this.civilization.civilizationType,
                            type: constructible.constructibleType,
                            kind: KIND.IMPROVEMENT,
                            icon: '',
                            ...constructible,
                        })
                    )
                });
            }

            if (item instanceof ProgressionTreeBuilder) {
                item._current.progressionTrees.forEach(progressionTree => {
                    this._gameEffects.modifiers.push(new ModifierNode({
                        id: `MOD_${progressionTree.progressionTreeType}_REVEAL`,
                        effect: EFFECT.PLAYER_REVEAL_CULTURE_TREE,
                        requirements: [{
                            type: REQUIREMENT.PLAYER_HAS_CIVILIZATION_OR_LEADER_TRAIT,
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

                    item._current.progressionTreeNodeUnlocks.push(new ProgressionTreeNodeUnlockNode({
                        progressionTreeNodeType: 'NODE_CIVIC_AQ_MAIN_CHIEFDOM',
                        targetKind: KIND.MODIFIER,
                        targetType: `MOD_${progressionTree.progressionTreeType}_REVEAL`,
                        unlockDepth: 1,
                        hidden: true
                    }));
                })
            }
        });
        return this;
    }

    build() {
        const path = `/civilizations/${lodash.kebabCase(trim(this.civilization.civilizationType))}/`;
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
                name: 'legacy.xml',
                content: this._legacy.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new XmlFile({
                path,
                name: 'shell.xml',
                content: this._shell.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new XmlFile({
                path,
                name: 'icons.xml',
                content: this._icons.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_ICONS]
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
                name: 'game-effects.xml',
                content: this._gameEffects?.toXmlElement(),
                actionGroups: [this.actionGroupBundle.current],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
        ]
    }
}
