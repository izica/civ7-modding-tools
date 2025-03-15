"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNode = void 0;
const lodash = __importStar(require("lodash"));
const utils_1 = require("../utils");
class BaseNode {
    constructor(payload = {}) {
        this._name = 'Row';
        this.fill = (utils_1.fill);
        this.fill(payload);
    }
    getAttributes() {
        const result = {};
        Object.keys(this)
            .filter(key => !key.startsWith('_'))
            .forEach(key => {
            if (['fill'].includes(key)) {
                return;
            }
            if (this[key] === null || this[key] === undefined || this[key] === '') {
                return;
            }
            let nodeAttributeName = lodash.startCase(key).replace(/ /g, "");
            if (typeof this[key] === 'boolean') {
                result[nodeAttributeName] = this[key] ? 'true' : 'false';
                return;
            }
            result[nodeAttributeName] = this[key];
        });
        return result;
    }
    insertOrIgnore() {
        if (!['Row', 'InsertOrIgnore', 'Replace'].includes(this._name)) {
            throw new Error('Only Row|InsertOrIgnore|Replace nodes can be transformed to InsertOrIgnore.');
        }
        this._name = 'InsertOrIgnore';
        return this;
    }
    replace() {
        if (!['Row', 'InsertOrIgnore', 'Replace'].includes(this._name)) {
            throw new Error('Only Row|InsertOrIgnore|Replace nodes can be transformed to Replace.');
        }
        this._name = 'Replace';
        return this;
    }
    toXmlElement() {
        return {
            _name: this._name,
            _attrs: this.getAttributes(),
        };
    }
}
exports.BaseNode = BaseNode;
//# sourceMappingURL=BaseNode.js.map