import { TObjectValues } from "../types";
import { AGE } from "../constants";

import { BaseNode } from "./BaseNode";

export type TGreatPersonIndividualNode = Pick<GreatPersonIndividualNode,
    "greatPersonIndividualType" |
    "name" |
    "actionEffectTextOverride" |
    "greatPersonClassType" |
    "ageType" |
    "gender" |
    "actionRequiresCompletedConstructibleType" |
    "actionRequiresCompletedDistrictType" |
    "actionRequiresIncompleteWonder" |
    "actionRequiresNoMilitaryUnit" |
    "actionRequiresCompletedQuarterType" |
    "actionCharges" |
    "actionRequiresOwnedTile" |
    "actionNameTextOverride" |
    "actionRequiresOnUnitType" |
    "unitType"
>;

export class GreatPersonIndividualNode extends BaseNode<TGreatPersonIndividualNode> {
    greatPersonIndividualType: string | null = null;
    name: string | null = null;
    actionEffectTextOverride: string | null = null;
    greatPersonClassType: string | null = null;
    ageType: TObjectValues<typeof AGE> | null = null;
    gender: 'M' | 'F' | null = null;
    actionRequiresCompletedConstructibleType: boolean | null = null;
    actionRequiresCompletedDistrictType: boolean | null = null;
    actionRequiresIncompleteWonder: boolean | null = null;
    actionRequiresNoMilitaryUnit: boolean | null = null;
    actionRequiresCompletedQuarterType: boolean | null = null;
    actionRequiresOwnedTile: boolean | null = null;
    actionRequiresOnUnitType: boolean | null = null;
    actionCharges: number | null = null;
    actionNameTextOverride: string | null = null;
    unitType: string | null = null;

    constructor(payload: Partial<TGreatPersonIndividualNode> = {}) {
        super();
        this.fill(payload);
    }
}
