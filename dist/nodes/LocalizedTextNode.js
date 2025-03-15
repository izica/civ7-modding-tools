"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalizedTextNode = void 0;
const BaseNode_1 = require("./BaseNode");
const constants_1 = require("../constants");
class LocalizedTextNode extends BaseNode_1.BaseNode {
    constructor(payload = {}) {
        super();
        this._name = 'Replace';
        this.language = constants_1.LANGUAGE.en_US;
        this.tag = 'LOC_';
        this.text = 'text';
        this.fill(payload);
    }
    toXmlElement() {
        return {
            _name: this._name,
            _attrs: {
                Tag: this.tag,
                Language: this.language
            },
            _content: {
                Text: this.text
            }
        };
    }
}
exports.LocalizedTextNode = LocalizedTextNode;
//# sourceMappingURL=LocalizedTextNode.js.map