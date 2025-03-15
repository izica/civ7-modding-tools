"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementSetNode = void 0;
const BaseNode_1 = require("./BaseNode");
const constants_1 = require("../constants");
const node_crypto_1 = require("node:crypto");
class RequirementSetNode extends BaseNode_1.BaseNode {
    constructor(payload = {}) {
        super();
        this.requirementSetId = 'REQSET_' + (0, node_crypto_1.randomUUID)().replace(/-/g, "_").toLocaleUpperCase();
        this.requirementSetType = constants_1.REQUIREMENT_SET.TEST_ALL;
        this.fill(payload);
    }
}
exports.RequirementSetNode = RequirementSetNode;
//# sourceMappingURL=RequirementSetNode.js.map