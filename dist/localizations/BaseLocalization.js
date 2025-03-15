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
exports.BaseLocalization = void 0;
const lodash = __importStar(require("lodash"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const nodes_1 = require("../nodes");
class BaseLocalization {
    constructor(payload = {}) {
        this.language = constants_1.LANGUAGE.en_US;
        this.prefix = null;
        this.fill(payload);
    }
    fill(payload = {}) {
        for (const [key, value] of Object.entries(payload)) {
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        }
        return this;
    }
    getNodes() {
        const keys = lodash.without(Object.keys(this), 'prefix', 'language');
        const result = {
            englishText: [],
            localizedText: []
        };
        keys.forEach(key => {
            if (!this[key]) {
                return;
            }
            if (Array.isArray(this[key])) {
                this[key].forEach((value, index) => {
                    const data = {
                        tag: (0, utils_1.locale)(this.prefix || '', `${key}_${index + 1}`),
                        text: value
                    };
                    if (this.language === constants_1.LANGUAGE.en_US) {
                        result.englishText.push(new nodes_1.EnglishTextNode(data));
                    }
                    else {
                        result.localizedText.push(new nodes_1.LocalizedTextNode(Object.assign({ language: this.language }, data)));
                    }
                });
            }
            else {
                const data = {
                    tag: (0, utils_1.locale)(this.prefix || '', key),
                    text: this[key]
                };
                if (this.language === constants_1.LANGUAGE.en_US) {
                    result.englishText.push(new nodes_1.EnglishTextNode(data));
                }
                else {
                    result.localizedText.push(new nodes_1.LocalizedTextNode(Object.assign({ language: this.language }, data)));
                }
            }
        });
        return result;
    }
}
exports.BaseLocalization = BaseLocalization;
//# sourceMappingURL=BaseLocalization.js.map