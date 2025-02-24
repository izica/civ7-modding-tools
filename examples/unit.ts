import { ACTION_GROUP_BUNDLE, Mod, Unit, UNIT_CLASS, UnitStat } from './src';

const mod = new Mod({
    id: 'mod-test',
    version: '1'
});

const unit = new Unit({
    type: 'UNIT_TEST_SCOUT',
    actionGroupBundle: ACTION_GROUP_BUNDLE.AGE_ANTIQUITY,
    unitStat: new UnitStat({
        combat: 40
    }),
    typeTags: [UNIT_CLASS.RECON, UNIT_CLASS.RECON_ABILITIES],
    visualRemap: 'UNIT_ARMY_COMMANDER',
});

mod.fill({
    units: [unit]
});

mod.build('./dist/mod-test');
