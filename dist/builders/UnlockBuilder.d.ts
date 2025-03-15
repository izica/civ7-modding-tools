import { TClassProperties, TPartialRequired } from "../types";
import { DatabaseNode, TCivilizationUnlockNode, TLeaderUnlockNode, TRequirementArgumentNode, TRequirementNode, TRequirementSetNode, TUnlockConfigurationValueNode, TUnlockRewardNode } from "../nodes";
import { TUnlockRequirementLocalization } from "../localizations";
import { BaseBuilder } from "./BaseBuilder";
import { XmlFile } from "../files";
type TUnlockRewardBuilder = TClassProperties<UnlockBuilder>;
export declare class UnlockBuilder extends BaseBuilder<TUnlockRewardBuilder> {
    _always: DatabaseNode;
    _shell: DatabaseNode;
    _localizations: DatabaseNode;
    name: string;
    unlockConfigurationValue: TPartialRequired<TUnlockConfigurationValueNode, 'configurationValue'> | null;
    unlockReward: Partial<TUnlockRewardNode> | null;
    requirementSet: TPartialRequired<TRequirementSetNode, 'requirementSetType'> & {
        requirements?: (TPartialRequired<TRequirementNode, 'requirementType'> & {
            requirementArguments?: TPartialRequired<TRequirementArgumentNode, 'name'>[];
        })[];
        localizations?: Partial<TUnlockRequirementLocalization>[];
    } | null;
    civilizationUnlock: (TPartialRequired<TCivilizationUnlockNode, 'ageType' | 'civilizationDomain' | 'civilizationType' | 'type'> & {
        localizations?: Partial<TUnlockRequirementLocalization>[];
    }) | null;
    leaderUnlock: (TPartialRequired<TLeaderUnlockNode, 'ageType' | 'leaderType' | 'type'> & {
        localizations?: Partial<TUnlockRequirementLocalization>[];
    }) | null;
    constructor(payload?: Partial<TUnlockRewardBuilder>);
    migrate(): this;
    build(): XmlFile[];
}
export {};
