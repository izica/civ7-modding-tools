import { BaseNode } from "./BaseNode";

export type TGreatPersonClassNode = Pick<GreatPersonClassNode,
    "greatPersonClassType" |
    "name" |
    "unitType" |
    "uniqueQuarterType" |
    "constructibleType" |
    "availableInTimeline" |
    "generateDuplicateIndividuals" |
    "pseudoYieldType" |
    "populationRequired" |
    "iconString" |
    "actionIcon"
>;

export class GreatPersonClassNode extends BaseNode<TGreatPersonClassNode> {
    greatPersonClassType: string | null = null;
    name: string | null = null;
    unitType: string | null = null;
    uniqueQuarterType: string | null = null;
    constructibleType: string | null = null;
    availableInTimeline: boolean | null = null;
    generateDuplicateIndividuals: boolean | null = null;
    pseudoYieldType: string | null = null;
    populationRequired: number | null = null;
    iconString: string | null = 'unitflag_logios';
    actionIcon: string | null = 'action_greatperson';

    constructor(payload: Partial<TGreatPersonClassNode> = {}) {
        super();
        this.fill(payload);
    }
}
