"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlockRequirementNode = void 0;
const BaseNode_1 = require("./BaseNode");
class UnlockRequirementNode extends BaseNode_1.BaseNode {
    constructor(payload = {}) {
        super();
        this.unlockType = 'UNLOCK_';
        this.requirementSetId = null;
        this.description = null;
        this.tooltip = null;
        this.narrativeText = null;
        this.fill(payload);
    }
}
exports.UnlockRequirementNode = UnlockRequirementNode;
//# sourceMappingURL=UnlockRequirementNode.js.map