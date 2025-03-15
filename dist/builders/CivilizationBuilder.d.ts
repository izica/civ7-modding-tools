import { TClassProperties, TObjectValues, TPartialRequired } from "../types";
import { DatabaseNode, GameEffectNode, TCivilizationItemNode, TCivilizationNode, TIconDefinitionNode, TLegacyCivilizationNode, TraitNode, TStartBiasBiomeNode, TStartBiasFeatureClassNode, TStartBiasResourceNode, TStartBiasTerrainNode, TTraitNode } from "../nodes";
import { BUILDING_CULTURES, TAG_TRAIT, TRAIT, UNIT_CULTURE } from "../constants";
import { XmlFile } from "../files";
import { TCivilizationLocalization } from "../localizations";
import { BaseBuilder } from "./BaseBuilder";
import { UnitBuilder } from "./UnitBuilder";
import { ConstructibleBuilder } from "./ConstructibleBuilder";
import { ProgressionTreeBuilder } from "./ProgressionTreeBuilder";
import { ModifierBuilder } from "./ModifierBuilder";
import { UniqueQuarterBuilder } from "./UniqueQuarterBuilder";
type TCivilizationBuilder = TClassProperties<CivilizationBuilder>;
export declare class CivilizationBuilder extends BaseBuilder<TCivilizationBuilder> {
    _current: DatabaseNode;
    _shell: DatabaseNode;
    _legacy: DatabaseNode;
    _localizations: DatabaseNode;
    _icons: DatabaseNode;
    _gameEffects: GameEffectNode;
    civilizationTraits: (TObjectValues<typeof TRAIT> | string)[];
    civilizationTags: TObjectValues<typeof TAG_TRAIT>[];
    trait: TPartialRequired<TTraitNode, 'traitType'>;
    traitAbility: TPartialRequired<TraitNode, 'traitType'>;
    civilization: TPartialRequired<TCivilizationNode, 'civilizationType' | 'domain'>;
    civilizationLegacy: TPartialRequired<TLegacyCivilizationNode, 'age'>;
    localizations: Partial<TCivilizationLocalization>[];
    icon: TPartialRequired<TIconDefinitionNode, 'path'>;
    civilizationItems: TPartialRequired<TCivilizationItemNode, "type" | "kind">[];
    startBiasBiomes: TPartialRequired<TStartBiasBiomeNode, 'biomeType'>[];
    startBiasResources: TPartialRequired<TStartBiasResourceNode, 'resourceType'>[];
    startBiasTerrains: TPartialRequired<TStartBiasTerrainNode, 'terrainType'>[];
    startBiasRiver: number | null;
    startBiasFeatureClasses: TPartialRequired<TStartBiasFeatureClassNode, 'featureClassType'>[];
    startBiasAdjacentToCoast: number | null;
    visArtCivilizationBuildingCultures: TObjectValues<typeof BUILDING_CULTURES>[];
    visArtCivilizationUnitCulture: TObjectValues<typeof UNIT_CULTURE> | null;
    constructor(payload?: Partial<TCivilizationBuilder>);
    migrate(): this;
    /**
     * @description Bind entity as unique to this civilization
     * @param items
     */
    bind(items?: (UnitBuilder | ConstructibleBuilder | ProgressionTreeBuilder | ModifierBuilder | UniqueQuarterBuilder)[]): this;
    build(): XmlFile[];
}
export {};
