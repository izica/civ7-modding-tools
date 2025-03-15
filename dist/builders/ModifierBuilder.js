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
exports.ModifierBuilder = void 0;
const lodash = __importStar(require("lodash"));
const nodes_1 = require("../nodes");
const BaseBuilder_1 = require("./BaseBuilder");
const localizations_1 = require("../localizations");
const utils_1 = require("../utils");
class ModifierBuilder extends BaseBuilder_1.BaseBuilder {
    constructor(payload = {}) {
        super();
        this._gameEffects = new nodes_1.GameEffectNode();
        this._localizations = new nodes_1.DatabaseNode();
        /** @description if detached only adding into game effects file while binding*/
        this.isDetached = false;
        this.modifier = {};
        this.localizations = [];
        this.fill(payload);
    }
    migrate() {
        const modifier = new nodes_1.ModifierNode(this.modifier);
        if (this.localizations.length > 0) {
            Object.keys(this.localizations[0]).forEach(key => {
                modifier.strings.push({
                    context: lodash.capitalize(key),
                    value: (0, utils_1.locale)(modifier.id, key)
                });
            });
        }
        this.localizations.forEach(item => {
            this._localizations.push(new localizations_1.ModifierLocalization(Object.assign({ prefix: modifier.id }, item)).getNodes());
        });
        this._gameEffects.fill({
            modifiers: [modifier]
        });
        return this;
    }
    build() {
        return [];
    }
}
exports.ModifierBuilder = ModifierBuilder;
//# sourceMappingURL=ModifierBuilder.js.map