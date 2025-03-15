import { BaseNode } from "./BaseNode";

export type TGreatPersonIndividualActionModifierNode = Pick<GreatPersonIndividualActionModifierNode,
    "greatPersonIndividualType" |
    "modifierId" |
    "attachmentTargetType"
>;

export class GreatPersonIndividualActionModifierNode extends BaseNode<TGreatPersonIndividualActionModifierNode> {
    greatPersonIndividualType: string | null = null;
    modifierId: string | null = null;
    attachmentTargetType: string | null = null;

    constructor(payload: Partial<TGreatPersonIndividualActionModifierNode> = {}) {
        super();
        this.fill(payload);
    }
}
