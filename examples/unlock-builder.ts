import {
    REQUIREMENT_SET,
    REQUIREMENT,
    RESOURCE,
    UnlockBuilder
} from "./src";

const civilizationUnlock = new UnlockBuilder({
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
