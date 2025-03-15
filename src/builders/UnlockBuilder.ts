import { kebabCase } from "lodash";
import { randomUUID } from "node:crypto";

import { TClassProperties, TPartialRequired } from "../types";
import {
    CivilizationUnlockNode,
    DatabaseNode,
    KindNode,
    LeaderUnlockNode,
    RequirementArgumentNode,
    RequirementNode,
    RequirementSetNode,
    RequirementSetRequirementNode,
    TCivilizationUnlockNode,
    TLeaderUnlockNode,
    TRequirementArgumentNode,
    TRequirementNode,
    TRequirementSetNode,
    TUnlockConfigurationValueNode,
    TUnlockRewardNode,
    TypeNode,
    UnlockConfigurationValueNode,
    UnlockNode,
    UnlockRequirementNode,
    UnlockRewardNode
} from "../nodes";
import { TUnlockRequirementLocalization, UnlockRequirementLocalization } from "../localizations";
import { ACTION_GROUP_ACTION, KIND, REQUIREMENT, REQUIREMENT_SET } from "../constants";

import { BaseBuilder } from "./BaseBuilder";
import { XmlFile } from "../files";
import { locale, trim } from "../utils";

type TUnlockRewardBuilder = TClassProperties<UnlockBuilder>;

export class UnlockBuilder extends BaseBuilder<TUnlockRewardBuilder> {
    _always: DatabaseNode = new DatabaseNode();
    _shell: DatabaseNode = new DatabaseNode();
    _localizations: DatabaseNode = new DatabaseNode();
    name = randomUUID({}).replace(/-/g, "").toLocaleLowerCase();

    unlockConfigurationValue: TPartialRequired<TUnlockConfigurationValueNode, 'configurationValue'> | null = null;

    unlockReward: Partial<TUnlockRewardNode> | null = null
    requirementSet: TPartialRequired<TRequirementSetNode, 'requirementSetType'> & {
        requirements?: (TPartialRequired<TRequirementNode, 'requirementType'> & {
            requirementArguments?: TPartialRequired<TRequirementArgumentNode, 'name'>[]
        })[],
        localizations?: Partial<TUnlockRequirementLocalization>[]
    } | null = null;

    civilizationUnlock: (TPartialRequired<TCivilizationUnlockNode, 'ageType' | 'civilizationDomain' | 'civilizationType' | 'type'> & {
        localizations?: Partial<TUnlockRequirementLocalization>[]
    }) | null = null;
    leaderUnlock: (TPartialRequired<TLeaderUnlockNode, 'ageType' | 'leaderType' | 'type'> & {
        localizations?: Partial<TUnlockRequirementLocalization>[]
    }) | null = null;

    constructor(payload: Partial<TUnlockRewardBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        if (this.unlockConfigurationValue !== null) {
            if (!this.unlockConfigurationValue.unlockType) {
                this.unlockConfigurationValue.unlockType = `UNLOCK_${this.unlockConfigurationValue.configurationValue}`;
            }

            this._always.fill({
                kinds: [new KindNode({ kind: KIND.UNLOCK }).insertOrIgnore()],
            });
            this._always.types.push(
                new TypeNode({ kind: KIND.UNLOCK, type: this.unlockConfigurationValue.unlockType }).insertOrIgnore()
            );
            this._always.unlocks.push(
                new UnlockNode({ unlockType: this.unlockConfigurationValue.unlockType }).insertOrIgnore()
            );
            this._always.unlockConfigurationValues.push(
                new UnlockConfigurationValueNode(this.unlockConfigurationValue).insertOrIgnore()
            );
            this._always.unlockRewards.push(
                new UnlockRewardNode({
                    name: locale(this.unlockConfigurationValue.configurationValue, 'name'),
                    description: locale(this.unlockConfigurationValue.configurationValue, 'description'),
                    icon: this.unlockConfigurationValue.configurationValue,
                    ...this.unlockConfigurationValue,
                    ...(this.unlockReward || {})
                }).insertOrIgnore()
            );

            if (this.requirementSet !== null) {
                const requirementSet = new RequirementSetNode(this.requirementSet).insertOrIgnore()
                this._always.requirementSets.push(requirementSet);

                this._always.unlockRequirements.push(
                    new UnlockRequirementNode({
                        ...requirementSet,
                        ...this.unlockConfigurationValue,
                        description: locale(requirementSet.requirementSetId, 'description'),
                        tooltip: locale(requirementSet.requirementSetId, 'tooltip'),
                        narrativeText: locale(requirementSet.requirementSetId, 'narrative'),
                    }).insertOrIgnore()
                );

                this.requirementSet.localizations?.forEach(localization => {
                    this._localizations.englishText.concat(
                        new UnlockRequirementLocalization({
                            prefix: requirementSet.requirementSetId,
                            ...localization
                        }).getNodes()
                    )
                });

                this.requirementSet.requirements?.forEach(req => {
                    const requirement = new RequirementNode(req).insertOrIgnore();
                    this._always.requirements.push(requirement);

                    this._always.requirementSetRequirements.push(
                        new RequirementSetRequirementNode({
                            ...requirementSet,
                            ...requirement
                        }).insertOrIgnore()
                    );

                    req.requirementArguments?.forEach(arg => {
                        this._always.requirementArguments.push(
                            new RequirementArgumentNode({
                                ...requirement,
                                ...arg,
                            }).insertOrIgnore()
                        );
                    })
                });
            }
        }

        if (this.civilizationUnlock) {
            this._always.fill({
                kinds: [new KindNode({ kind: KIND.UNLOCK }).insertOrIgnore()],
            });

            const unlockType = `UNLOCK_${this.civilizationUnlock.type}`;
            const civilizationUnlock = new CivilizationUnlockNode({
                name: locale(this.civilizationUnlock.type, 'name'),
                description: locale(this.civilizationUnlock.type, 'description'),
                icon: this.civilizationUnlock.type,
                ...this.civilizationUnlock
            }).insertOrIgnore();
            this._shell.civilizationUnlocks.push(civilizationUnlock);

            this._always.types.push(
                new TypeNode({ kind: KIND.UNLOCK, type: unlockType }).insertOrIgnore()
            );
            this._always.unlocks.push(
                new UnlockNode({ unlockType }).insertOrIgnore()
            );
            this._always.unlockConfigurationValues.push(
                new UnlockConfigurationValueNode({ unlockType, configurationValue: civilizationUnlock.type }).insertOrIgnore()
            );
            this._always.unlockRewards.push(
                new UnlockRewardNode({ unlockType, ...civilizationUnlock, civUnlock: true, }).insertOrIgnore()
            );

            const requirementSet = new RequirementSetNode({ requirementSetType: REQUIREMENT_SET.TEST_ALL }).insertOrIgnore();
            this._always.requirementSets.push(requirementSet);

            const requirement = new RequirementNode({ requirementType: REQUIREMENT.PLAYER_CIVILIZATION_TYPE_MATCHES }).insertOrIgnore();
            this._always.requirements.push(requirement);

            this._always.unlockRequirements.push(
                new UnlockRequirementNode({
                    unlockType,
                    ...requirementSet,
                    description: locale(`UNLOCK_PLAY_AS_${trim(civilizationUnlock.civilizationType)}_${trim(civilizationUnlock.type)}`, 'description'),
                    tooltip: locale(`UNLOCK_PLAY_AS_${trim(civilizationUnlock.civilizationType)}_${trim(civilizationUnlock.type)}`, 'tooltip'),
                    narrativeText: locale(`UNLOCK_PLAY_AS_${trim(civilizationUnlock.civilizationType)}_${trim(civilizationUnlock.type)}`, 'narrative'),
                }).insertOrIgnore()
            );

            this.civilizationUnlock.localizations?.forEach(localization => {
                this._localizations.englishText.concat(
                    new UnlockRequirementLocalization({
                        prefix: `UNLOCK_PLAY_AS_${trim(civilizationUnlock.civilizationType)}_${trim(civilizationUnlock.type)}`,
                        ...localization
                    }).getNodes()
                )
            });

            this._always.requirementArguments.push(
                new RequirementArgumentNode({
                    ...requirement,
                    name: 'CivilizationType',
                    value: civilizationUnlock.civilizationType
                }).insertOrIgnore()
            );

            this._always.requirementSetRequirements.push(
                new RequirementSetRequirementNode({
                    ...requirementSet,
                    ...requirement
                })
            );
        }

        if (this.leaderUnlock) {
            this._always.fill({
                kinds: [new KindNode({ kind: KIND.UNLOCK }).insertOrIgnore()],
            });

            const unlockType = `UNLOCK_${this.leaderUnlock.type}`;
            const leaderUnlock = new LeaderUnlockNode({
                name: locale(this.leaderUnlock.type, 'name'),
                description: locale(this.leaderUnlock.type, 'description'),
                icon: this.leaderUnlock.type,
                ...this.leaderUnlock
            }).insertOrIgnore();
            this._shell.leaderUnlocks.push(leaderUnlock);

            this._always.types.push(
                new TypeNode({ kind: KIND.UNLOCK, type: unlockType }).insertOrIgnore()
            );
            this._always.unlocks.push(
                new UnlockNode({ unlockType }).insertOrIgnore()
            );
            this._always.unlockConfigurationValues.push(
                new UnlockConfigurationValueNode({ unlockType, configurationValue: leaderUnlock.type }).insertOrIgnore()
            );
            this._always.unlockRewards.push(
                new UnlockRewardNode({ unlockType, ...leaderUnlock, civUnlock: true, }).insertOrIgnore()
            );

            const requirementSet = new RequirementSetNode({ requirementSetType: REQUIREMENT_SET.TEST_ALL }).insertOrIgnore();
            this._always.requirementSets.push(requirementSet);

            const requirement = new RequirementNode({ requirementType: REQUIREMENT.PLAYER_LEADER_TYPE_MATCHES }).insertOrIgnore();
            this._always.requirements.push(requirement);

            this._always.unlockRequirements.push(
                new UnlockRequirementNode({
                    unlockType,
                    ...requirementSet,
                    description: locale(`UNLOCK_PLAY_AS_${trim(leaderUnlock.leaderType)}_${trim(leaderUnlock.type)}`, 'description'),
                    tooltip: locale(`UNLOCK_PLAY_AS_${trim(leaderUnlock.leaderType)}_${trim(leaderUnlock.type)}`, 'tooltip'),
                    narrativeText: locale(`UNLOCK_PLAY_AS_${trim(leaderUnlock.leaderType)}_${trim(leaderUnlock.type)}`, 'narrative'),
                }).insertOrIgnore()
            );

            this.leaderUnlock.localizations?.forEach(localization => {
                this._localizations.englishText.concat(
                    new UnlockRequirementLocalization({
                        prefix: `UNLOCK_PLAY_AS_${trim(leaderUnlock.leaderType)}_${trim(leaderUnlock.type)}`,
                        ...localization
                    }).getNodes()
                )
            });

            this._always.requirementArguments.push(
                new RequirementArgumentNode({
                    ...requirement,
                    name: 'LeaderType',
                    value: leaderUnlock.leaderType
                }).insertOrIgnore()
            );

            this._always.requirementSetRequirements.push(
                new RequirementSetRequirementNode({
                    ...requirementSet,
                    ...requirement
                })
            );
        }

        return this;
    }

    build() {
        const path = `/unlocks/${kebabCase(this.name)}/`;
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
                name: 'shell.xml',
                content: this._shell.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new XmlFile({
                path,
                name: 'localization.xml',
                content: this._localizations.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_TEXT]
            }),
        ]
    }
}
