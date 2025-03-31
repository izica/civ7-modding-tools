import {
    ACTION_GROUP_BUNDLE,
    CivilizationBuilder,
    COLLECTION,
    CONSTRUCTIBLE_TYPE_TAG,
    ConstructibleBuilder,
    DISTRICT,
    EFFECT,
    ImportFileBuilder,
    Mod,
    ModifierBuilder,
    REQUIREMENT,
    TAG_TRAIT, TRAIT,
    UniqueQuarterBuilder,
    UNIT_CLASS,
    YIELD,
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

const constructible = new ConstructibleBuilder({
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    constructible: {
        constructibleType: 'BUILDING_CUSTOM',
    },
    building: {},
    typeTags: [
        CONSTRUCTIBLE_TYPE_TAG.AGELESS,
        CONSTRUCTIBLE_TYPE_TAG.PRODUCTION,
        CONSTRUCTIBLE_TYPE_TAG.FOOD
    ],
    constructibleValidDistricts: [
        DISTRICT.URBAN,
        DISTRICT.CITY_CENTER,
    ],
    constructibleYieldChanges: [
        { yieldType: YIELD.GOLD, yieldChange: 20 },
    ],
    constructibleMaintenances: [
        { yieldType: YIELD.PRODUCTION, amount: 1 },
        { yieldType: YIELD.HAPPINESS, amount: 1 },
    ],
    localizations: [
        {name: 'Custom building', description: 'Custom building test description', tooltip: 'Custom building test tooltip'},
    ]
});

const constructible2 = new ConstructibleBuilder({
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    constructible: {
        constructibleType: 'BUILDING_GONDOR2',
    },
    building: {},
    typeTags: [
        CONSTRUCTIBLE_TYPE_TAG.AGELESS,
        CONSTRUCTIBLE_TYPE_TAG.PRODUCTION,
        CONSTRUCTIBLE_TYPE_TAG.FOOD
    ],
    constructibleValidDistricts: [
        DISTRICT.URBAN,
        DISTRICT.CITY_CENTER,
    ],
    constructibleYieldChanges: [
        { yieldType: YIELD.GOLD, yieldChange: 20 },
    ],
    constructibleMaintenances: [
        { yieldType: YIELD.PRODUCTION, amount: 1 },
        { yieldType: YIELD.HAPPINESS, amount: 1 },
    ],
    localizations: [
        { name: 'Custom building', description: 'Custom building test description', tooltip: 'Custom building test tooltip' },
    ]
});

const uniqueQuarter = new UniqueQuarterBuilder({
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    uniqueQuarter: {
        uniqueQuarterType: 'QUARTER_GONDOR',
        buildingType1: constructible.constructible.constructibleType,
        buildingType2: constructible2.constructible.constructibleType,
    },
    localizations: [
        { name: 'Custom unique quarter', description: 'Custom unique quarter test description' },
    ]
}).bind([
    new ModifierBuilder({
        modifier: {
            collection: COLLECTION.ALL_CITIES,
            effect: EFFECT.CITY_ADJUST_YIELD,
            permanent: true,
            requirements: [{
                type: REQUIREMENT.CITY_HAS_UNIQUE_QUARTER,
                arguments: [{ name: 'UniqueQuarterType', value: 'QUARTER_GONDOR' }]
            }, {
                type: REQUIREMENT.CITY_IS_CITY
            }],
            arguments: [
                { name: "YieldType", value: YIELD.GOLD },
                { name: "Amount", value: 2000 },
                { name: "Tooltip", value: 'LOC_QUARTER_GONDOR_NAME' }
            ]
        }
    }),
])

civilization.bind([
    constructible,
    constructible2,
    uniqueQuarter
]);

mod.add([
    civilization,
    civilizationIcon,
    constructible,
    constructible2,
    uniqueQuarter,
]);

mod.build('./dist');
