import { ActionGroupBundle } from "../core/ActionGroupBundle";

import { AGE } from "./AGE";
import { ACTION_GROUP } from "./ACTION_GROUP";

export const ACTION_GROUP_BUNDLE = {
    [AGE.ANTIQUITY]: new ActionGroupBundle({
        shell: ACTION_GROUP.SHELL,
        always: ACTION_GROUP.GAME,
        current: ACTION_GROUP.AGE_ANTIQUITY_CURRENT,
        persist: ACTION_GROUP.AGE_ANTIQUITY_PERSIST
    }),
    [AGE.EXPLORATION]: new ActionGroupBundle({
        shell: ACTION_GROUP.SHELL,
        always: ACTION_GROUP.GAME,
        current: ACTION_GROUP.AGE_EXPLORATION_CURRENT,
        persist: ACTION_GROUP.AGE_EXPLORATION_PERSIST
    }),
    [AGE.MODERN]: new ActionGroupBundle({
        shell: ACTION_GROUP.SHELL,
        always: ACTION_GROUP.GAME,
        current: ACTION_GROUP.AGE_MODERN_CURRENT,
        persist: ACTION_GROUP.AGE_MODERN_PERSIST
    }),
} as const;
