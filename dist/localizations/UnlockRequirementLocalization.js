"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlockRequirementLocalization = void 0;
const BaseLocalization_1 = require("./BaseLocalization");
class UnlockRequirementLocalization extends BaseLocalization_1.BaseLocalization {
    constructor(payload = {}) {
        super();
        this.description = null;
        this.tooltip = null;
        this.narrative = null;
        this.fill(payload);
    }
}
exports.UnlockRequirementLocalization = UnlockRequirementLocalization;
//# sourceMappingURL=UnlockRequirementLocalization.js.map