import { REQUIREMENT, REQUIREMENT_SET, RESOURCE, UnlockBuilder } from "./src";
import { ACTION_GROUP_BUNDLE, AGE, CIVILIZATION_DOMAIN } from "../src";

// unlock by 3 improved iron
const civilizationUnlock = new UnlockBuilder({
    name: 'ingame unlock',
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_EXPLORATION,
    unlockConfigurationValue: {
        configurationValue: civilization.civilization.civilizationType
    },
    requirementSet: {
        requirementSetType: REQUIREMENT_SET.TEST_ALL,
        requirements: [{
            requirementType: REQUIREMENT.PLAYER_TOTAL_IMPROVED_RESOURCES,
            requirementArguments: [
                { name: 'Amount', value: 3 },
                { name: 'ResourceType', value: RESOURCE.IRON }
            ]
        }]
    }
});

// unlock exploration civ from antiquity greece
const civilizationFromGreece = new UnlockBuilder({
    name: 'from Greece',
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_EXPLORATION,
    civilizationUnlock: {
        civilizationDomain: CIVILIZATION_DOMAIN.AntiquityAgeCivilizations,
        civilizationType: 'CIVILIZATION_GREECE',
        ageType: AGE.EXPLORATION,
        type: civilization.civilization.civilizationType
    }
});

// unlock exploration civ from leader catherine
const leaderCatherineUnlock = new UnlockBuilder({
    name: 'catherine',
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_EXPLORATION,
    leaderUnlock: {
        leaderType: 'LEADER_CATHERINE',
        ageType: AGE.EXPLORATION,
        type: civilization.civilization.civilizationType
    }
});
