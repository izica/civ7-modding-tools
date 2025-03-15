import { BaseNode } from "./BaseNode";

export type TGreatPersonClassNode = Pick<GreatPersonClassNode,
    "greatPersonClassType" |
    "name" |
    "unitType" |
    "uniqueQuarterType" |
    "availableInTimeline" |
    "generateDuplicateIndividuals" |
    "pseudoYieldType" |
    "iconString" |
    "actionIcon"
>;

export class GreatPersonClassNode extends BaseNode<TGreatPersonClassNode> {
    greatPersonClassType: string | null = null;
    name: string | null = null;
    unitType: string | null = null;
    uniqueQuarterType: string | null = null;
    availableInTimeline: boolean | null = null;
    generateDuplicateIndividuals: boolean | null = null;
    pseudoYieldType: string | null = null;
    iconString: string | null = 'unitflag_logios';
    actionIcon: string | null = 'action_greatperson';

    constructor(payload: Partial<TGreatPersonClassNode> = {}) {
        super();
        this.fill(payload);
    }
}
