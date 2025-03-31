import {
    ACTION_GROUP_BUNDLE,
    CivilizationBuilder,
    ImportFileBuilder,
    Mod,
    TAG_TRAIT
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
    civilizationTags: [TAG_TRAIT.CULTURAL, TAG_TRAIT.ECONOMIC],
    icon: {
        path: `fs://game/${mod.id}/${civilizationIcon.name}`
    },
    localizations: [
        { name: 'Custom civilization', description: 'test description', fullName: 'test full name', adjective: 'test adjective' }
    ]
})

mod.add([
    civilization,
    civilizationIcon,
]);

mod.build('./dist');
