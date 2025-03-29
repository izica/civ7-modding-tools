// fix for import loop
import { ActionGroupNode } from "../nodes/ActionGroupNode";
import { CriteriaNode } from "../nodes/CriteriaNode";

import { AGE } from "./AGE";

// NB: IDs on ActionGroups and CriteriaNodes on these consts are set to follow  Firaxis'
// conventions present the main game files in e.g. Base\modules\age-antiquity\age-antiquity.modinfo.
export const ACTION_GROUP = {
    SHELL: new ActionGroupNode({
        scope: 'shell',
        criteria: new CriteriaNode({ id: 'always' })
    }),
    GAME: new ActionGroupNode({
        scope: 'game',
        criteria: new CriteriaNode({ id: 'always' })
    }),
    AGE_ANTIQUITY_CURRENT: new ActionGroupNode({
        id: `age-antiquity-current`,
        scope: 'game',
        criteria: new CriteriaNode({
            id: `antiquity-age-current`,
            ages: [AGE.ANTIQUITY]
        })
    }),
    AGE_ANTIQUITY_PERSIST: new ActionGroupNode({
        id: `age-antiquity-persist`,
        scope: 'game',
        criteria: new CriteriaNode({
            id: `antiquity-age-persist`,
            ages: [AGE.ANTIQUITY, AGE.EXPLORATION, AGE.MODERN]
        })
    }),
    AGE_EXPLORATION_CURRENT: new ActionGroupNode({
        id: `age-exploration-current`,
        scope: 'game',
        criteria: new CriteriaNode({
            id: `exploration-age-current`,
            ages: [AGE.EXPLORATION]
        })
    }),
    AGE_EXPLORATION_PERSIST: new ActionGroupNode({
        id: `age-exploration-persist`,
        scope: 'game',
        criteria: new CriteriaNode({
            id: `exploration-age-persist`,
            ages: [AGE.EXPLORATION, AGE.MODERN]
        })
    }),
    AGE_MODERN_CURRENT: new ActionGroupNode({
        id: `age-modern-current`,
        scope: 'game',
        criteria: new CriteriaNode({
            id: `modern-age-current`,
            ages: [AGE.MODERN]
        })
    }),
    AGE_MODERN_PERSIST: new ActionGroupNode({
        id: `age-modern-persist`,
        scope: 'game',
        criteria: new CriteriaNode({
            id: `modern-age-persist`,
            ages: [AGE.MODERN]
        })
    }),
} as const;
