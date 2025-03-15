"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CivilizationLocalization = void 0;
const BaseLocalization_1 = require("./BaseLocalization");
class CivilizationLocalization extends BaseLocalization_1.BaseLocalization {
    constructor(payload = {}) {
        super();
        this.name = 'test';
        this.description = 'text';
        this.fullName = 'text';
        this.adjective = 'text';
        this.abilityName = 'text';
        this.abilityDescription = 'text';
        this.cityNames = ['test city name'];
        this.fill(payload);
    }
}
exports.CivilizationLocalization = CivilizationLocalization;
//# sourceMappingURL=CivilizationLocalization.js.map