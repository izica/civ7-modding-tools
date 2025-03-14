import { kebabCase } from "lodash";

import { TClassProperties, TPartialRequired } from "../types";
import { DatabaseNode, TLeaderCivilizationBiasNode, TLeaderUnlockNode } from "../nodes";
import { LeaderUnlockLocalization, TLeaderUnlockLocalization } from "../localizations";
import { ACTION_GROUP_ACTION, AGE } from "../constants";

import { BaseBuilder } from "./BaseBuilder";
import { XmlFile } from "../files";
import { trim } from "../utils";

type TLeaderUnlockBuilder = TClassProperties<LeaderUnlockBuilder>;

export class LeaderUnlockBuilder extends BaseBuilder<TLeaderUnlockBuilder> {
    _localizations: DatabaseNode = new DatabaseNode();

    leaderUnlock: TPartialRequired<TLeaderUnlockNode, "leaderType" | "type" | "ageType"> = {
        leaderType: 'LEADER_',
        type: 'CIVILIZATION_',
        ageType: AGE.ANTIQUITY,
    };

    leaderCivilizationBias: Partial<TLeaderCivilizationBiasNode> = {}

    localizations: Partial<TLeaderUnlockLocalization>[] = [];

    constructor(payload: Partial<TLeaderUnlockBuilder> = {}) {
        super();
        this.fill(payload);
    }

    migrate() {
        this._localizations.fill({
            englishText: this.localizations.map(item => {
                return new LeaderUnlockLocalization({
                    prefix: `PLAY_AS_${trim(this.leaderUnlock.leaderType)}_${trim(this.leaderUnlock.type)}`,
                    ...item
                });
            }).flatMap(item => item.getNodes())
        });

        return this;
    }

    build() {
        const name = `${kebabCase(trim(this.leaderUnlock.leaderType))}-${kebabCase(trim(this.leaderUnlock.type))}`;
        const path = `/unlocks/${name}/`;
        return [
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
