import {
    ACTION_GROUP,
    ACTION_GROUP_ACTION,
    ImportFileBuilder,
    Mod
} from "./src";

let mod = new Mod({
    id: 'mod-test',
    version: '1',
});

const sqlFile = new ImportFileBuilder({
    content: './assets/example.sql',
    actionGroups: [ACTION_GROUP.SHELL, ACTION_GROUP.AGE_ANTIQUITY_CURRENT],
    actionGroupActions: [ACTION_GROUP_ACTION.UPDATE_TEXT],
});

mod.add([
    sqlFile
]);

mod.build('./dist');

