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
exports.UniqueQuarterBuilder = void 0;
const lodash = __importStar(require("lodash"));
const nodes_1 = require("../nodes");
const localizations_1 = require("../localizations");
const files_1 = require("../files");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const ModifierBuilder_1 = require("./ModifierBuilder");
const BaseBuilder_1 = require("./BaseBuilder");
class UniqueQuarterBuilder extends BaseBuilder_1.BaseBuilder {
    constructor(payload = {}) {
        super();
        this._always = new nodes_1.DatabaseNode();
        this._localizations = new nodes_1.DatabaseNode();
        this._gameEffects = new nodes_1.GameEffectNode();
        this._icons = new nodes_1.DatabaseNode();
        this.uniqueQuarter = {
            uniqueQuarterType: 'QUARTER_CUSTOM',
            buildingType1: 'BUILDING_CUSTOM1',
            buildingType2: 'BUILDING_CUSTOM2',
        };
        this.icon = {
            path: 'fs://game/civ_sym_han'
        };
        this.localizations = [];
        this.fill(payload);
    }
    migrate() {
        this._always.fill({
            types: [new nodes_1.TypeNode({ kind: constants_1.KIND.QUARTER, type: this.uniqueQuarter.uniqueQuarterType })],
            uniqueQuarters: [new nodes_1.UniqueQuarterNode(Object.assign({ name: (0, utils_1.locale)(this.uniqueQuarter.uniqueQuarterType, 'name'), description: (0, utils_1.locale)(this.uniqueQuarter.uniqueQuarterType, 'description') }, this.uniqueQuarter))]
        });
        this._icons.fill({
            iconDefinitions: [new nodes_1.IconDefinitionNode(Object.assign({ id: this.uniqueQuarter.uniqueQuarterType }, this.icon))]
        });
        this.localizations.forEach(item => {
            this._localizations.push(new localizations_1.UniqueQuarterLocalization(Object.assign({ prefix: this.uniqueQuarter.uniqueQuarterType }, item)).getNodes());
        });
        return this;
    }
    bind(items) {
        items.forEach(item => {
            if (item instanceof ModifierBuilder_1.ModifierBuilder) {
                item._gameEffects.modifiers.forEach((modifier) => {
                    this._gameEffects.modifiers.push(modifier);
                });
                if (!item.isDetached) {
                    item._gameEffects.modifiers.forEach((modifier) => {
                        this._always.gameModifiers.push(new nodes_1.GameModifierNode({
                            modifierId: modifier.id
                        }));
                        this._always.uniqueQuarterModifiers.push(new nodes_1.UniqueQuarterModifierNode({
                            uniqueQuarterType: this.uniqueQuarter.uniqueQuarterType,
                            modifierId: modifier.id
                        }));
                    });
                }
                this._localizations.englishText = [
                    ...this._localizations.englishText,
                    ...item._localizations.englishText
                ];
            }
        });
        return this;
    }
    build() {
        const path = `/constructibles/${lodash.kebabCase(this.uniqueQuarter.uniqueQuarterType)}/`;
        return [
            new files_1.XmlFile({
                path,
                name: 'always.xml',
                content: this._always.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new files_1.XmlFile({
                path,
                name: 'icons.xml',
                content: this._icons.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_ICONS]
            }),
            new files_1.XmlFile({
                path,
                name: 'game-effects.xml',
                content: this._gameEffects.toXmlElement(),
                actionGroups: [this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_DATABASE]
            }),
            new files_1.XmlFile({
                path,
                name: 'localization.xml',
                content: this._localizations.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell, this.actionGroupBundle.always],
                actionGroupActions: [constants_1.ACTION_GROUP_ACTION.UPDATE_TEXT]
            }),
        ];
    }
}
exports.UniqueQuarterBuilder = UniqueQuarterBuilder;
//# sourceMappingURL=UniqueQuarterBuilder.js.map