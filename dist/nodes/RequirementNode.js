"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementNode = void 0;
const constants_1 = require("../constants");
const BaseNode_1 = require("./BaseNode");
const node_crypto_1 = require("node:crypto");
class RequirementNode extends BaseNode_1.BaseNode {
    constructor(payload = {}) {
        super();
        this.requirementId = 'REQ_' + (0, node_crypto_1.randomUUID)().replace(/-/g, "_").toLocaleUpperCase();
        this.requirementType = constants_1.REQUIREMENT.IS_AGE_COUNT;
        this.fill(payload);
    }
}
exports.RequirementNode = RequirementNode;
//# sourceMappingURL=RequirementNode.js.map