"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIVILIZATION_DOMAIN = void 0;
const AGE_1 = require("./AGE");
exports.CIVILIZATION_DOMAIN = {
    AntiquityAgeCivilizations: 'AntiquityAgeCivilizations',
    ExplorationAgeCivilizations: 'ExplorationAgeCivilizations',
    ModernAgeCivilizations: 'ModernAgeCivilizations',
    from(age) {
        return {
            [AGE_1.AGE.ANTIQUITY]: this.AntiquityAgeCivilizations,
            [AGE_1.AGE.EXPLORATION]: this.ExplorationAgeCivilizations,
            [AGE_1.AGE.MODERN]: this.ModernAgeCivilizations
        }[age];
    },
};
//# sourceMappingURL=CIVILIZATION_DOMAIN.js.map