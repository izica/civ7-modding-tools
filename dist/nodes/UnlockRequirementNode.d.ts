import { BaseNode } from "./BaseNode";
export type TUnlockRequirementNode = Pick<UnlockRequirementNode, "unlockType" | "requirementSetId" | "description" | "narrativeText" | "tooltip">;
export declare class UnlockRequirementNode extends BaseNode<TUnlockRequirementNode> {
    unlockType: string | null;
    requirementSetId: string | null;
    description: string | null;
    tooltip: string | null;
    narrativeText: string | null;
    constructor(payload?: Partial<TUnlockRequirementNode>);
}
