import {
    ACTION_GROUP_BUNDLE,
    ADVISORY,
    AGE,
    CivilizationBuilder,
    COLLECTION,
    EFFECT,
    ImportFileBuilder,
    Mod,
    ModifierBuilder,
    ProgressionTreeBuilder,
    ProgressionTreeNodeBuilder,
    REQUIREMENT,
    TAG_TRAIT,
    TraditionBuilder,
    TRAIT,
    UNIT_CLASS
} from "./src";

let mod = new Mod({
    id: 'mod-test',
    version: '1',
});

const civilizationIcon = new ImportFileBuilder({
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    content: './assets/civ-icon.png',
    name: 'civ_sym_gondor'
});
const civilization = new CivilizationBuilder({
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    civilization: {
        domain: 'AntiquityAgeCivilizations',
        civilizationType: 'CIVILIZATION_GONDOR'
    },
    civilizationTraits: [
        TRAIT.ANTIQUITY_CIV,
        TRAIT.ATTRIBUTE_EXPANSIONIST,
        TRAIT.ATTRIBUTE_MILITARISTIC,
    ],
    civilizationTags: [TAG_TRAIT.CULTURAL, TAG_TRAIT.ECONOMIC],
    icon: {
        path: `fs://game/${mod.id}/${civilizationIcon.name}`
    },
    localizations: [
        { name: 'Custom civilization', description: 'test description', fullName: 'test full name', adjective: 'test adjective', cityNames: ['Gondor'] }
    ],
    modifiers: [{
        collection: COLLECTION.PLAYER_UNITS,
        effect: EFFECT.UNIT_ADJUST_MOVEMENT,
        permanent: true,
        requirements: [{
            type: REQUIREMENT.UNIT_TAG_MATCHES,
            arguments: [{ name: 'Tag', value: UNIT_CLASS.RECON }]
        }],
        arguments: [{ name: 'Amount', value: 10 }]
    }]
});

const tradition = new TraditionBuilder({
    tradition: {
        traditionType: 'TRADITION_GONDOR'
    },
    localizations: [{
        name: 'Test tradition',
        description: 'Test tradition description',
    }]
}).bind([
    new ModifierBuilder({
        modifier: {
            collection: COLLECTION.OWNER,
            effect: EFFECT.PLAYER_ADJUST_CONSTRUCTIBLE_YIELD,
            arguments: [
                { name: 'Tag', value: 'FOOD' },
                { name: 'YieldType', value: 'YIELD_FOOD' },
                { name: 'Amount', value: 10 },
            ],
        },
        localizations: [{
            description: 'Test tradition description DASDASD'
        }]
    }),
]);

const progressionTreeNode = new ProgressionTreeNodeBuilder({
    progressionTreeNode: {
        progressionTreeNodeType: 'NODE_CIVICS_GONDOR1',
    },
    progressionTreeAdvisories: [ADVISORY.CLASS_FOOD],
    localizations: [{
        name: 'Civic name'
    }]
}).bind([
    new ModifierBuilder({
        modifier: {
            collection: COLLECTION.OWNER,
            effect: EFFECT.PLAYER_ADJUST_CONSTRUCTIBLE_YIELD,
            arguments: [
                { name: 'Tag', value: 'FOOD' },
                { name: 'YieldType', value: 'YIELD_FOOD' },
                { name: 'Amount', value: 10 },
            ],
        },
        localizations: [{
            description: '+10 Food'
        }]
    }),
    tradition
]);

const progressionTreeNode2 = new ProgressionTreeNodeBuilder({
    progressionTreeNode: {
        progressionTreeNodeType: 'NODE_CIVICS_GONDOR2',
    },
    progressionTreeAdvisories: [ADVISORY.CLASS_FOOD],
    localizations: [{
        name: 'Civic name'
    }]
}).bind([
    new ModifierBuilder({
        modifier: {
            collection: COLLECTION.OWNER,
            effect: EFFECT.PLAYER_ADJUST_CONSTRUCTIBLE_YIELD,
            arguments: [
                { name: 'Tag', value: 'SCIENCE' },
                { name: 'YieldType', value: 'YIELD_SCIENCE' },
                { name: 'Amount', value: 10 },
            ],
        },
        localizations: [{
            description: '+10 science'
        }]
    }),
]);

const progressionTree = new ProgressionTreeBuilder({
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    progressionTree: {
        progressionTreeType: `TREE_CIVICS_GONDOR`,
        ageType: AGE.ANTIQUITY
    },
    progressionTreePrereqs: [{
        node: progressionTreeNode2.progressionTreeNode.progressionTreeNodeType,
        prereqNode: progressionTreeNode.progressionTreeNode.progressionTreeNodeType
    }],
    localizations: [{
        name: 'Tree name'
    }]
}).bind([progressionTreeNode, progressionTreeNode2]);

civilization.bind([
    progressionTree
]);

mod.add([
    civilization,
    civilizationIcon,
    progressionTree,
    tradition
]);

mod.build('./dist');
