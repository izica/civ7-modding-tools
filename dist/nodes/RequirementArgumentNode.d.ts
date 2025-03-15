import { BaseNode } from "./BaseNode";
export type TRequirementArgumentNode = Pick<RequirementArgumentNode, "requirementId" | "name" | "value">;
export declare class RequirementArgumentNode extends BaseNode<TRequirementArgumentNode> {
    requirementId: string | null;
    name: string | null;
    value: string | number | null;
    constructor(payload?: Partial<TRequirementArgumentNode>);
}
