import {
    ACTION_GROUP_BUNDLE,
    CivilizationBuilder,
    CONSTRUCTIBLE_TYPE_TAG,
    ConstructibleBuilder, ConstructibleLocalization,
    DISTRICT,
    ImportFileBuilder,
    Mod,
    TAG_TRAIT, TRAIT,
    UNIT,
    UNIT_CLASS,
    UnitBuilder, YIELD
} from "./src";
import { COLLECTION, EFFECT, REQUIREMENT } from "../src";

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

const unitIcon = new ImportFileBuilder({
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    content: './assets/unit-icon.png',
    name: 'scout.png'
});

const unit = new UnitBuilder({
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    typeTags: [UNIT_CLASS.RECON, UNIT_CLASS.RECON_ABILITIES],
    unit: {
        unitType: 'UNIT_CUSTOM_SCOUT',
        baseMoves: 2,
        baseSightRange: 10,
    },
    icon: {
        path: `fs://game/${mod.id}/${unitIcon.name}`
    },
    unitCost: { cost: 20 },
    unitStat: { combat: 0 },
    unitReplace: { replacesUnitType: UNIT.SCOUT },
    visualRemap: { to: UNIT.ARMY_COMMANDER },
    localizations: [
        { name: 'Custom scout', description: 'test description' },
    ],
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

civilization.bind([
    unit,
    constructible
]);

mod.add([
    civilization,
    civilizationIcon,
    unit,
    unitIcon,
    constructible,
]);

mod.build('./dist');
