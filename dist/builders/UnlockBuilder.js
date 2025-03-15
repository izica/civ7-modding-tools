"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlockBuilder = void 0;
const lodash_1 = require("lodash");
const node_crypto_1 = require("node:crypto");
const nodes_1 = require("../nodes");
const localizations_1 = require("../localizations");
const constants_1 = require("../constants");
const BaseBuilder_1 = require("./BaseBuilder");
const files_1 = require("../files");
const utils_1 = require("../utils");
class UnlockBuilder extends BaseBuilder_1.BaseBuilder {
    constructor(payload = {}) {
        super();
        this._always = new nodes_1.DatabaseNode();
        this._shell = new nodes_1.DatabaseNode();
        this._localizations = new nodes_1.DatabaseNode();
        this.name = (0, node_crypto_1.randomUUID)({}).replace(/-/g, "").toLocaleLowerCase();
        this.unlockConfigurationValue = null;
        this.unlockReward = null;
        this.requirementSet = null;
        this.civilizationUnlock = null;
        this.leaderUnlock = null;
        this.fill(payload);
    }
    migrate() {
        var _a, _b, _c, _d;
        if (this.unlockConfigurationValue !== null) {
            if (!this.unlockConfigurationValue.unlockType) {
                this.unlockConfigurationValue.unlockType = `UNLOCK_${this.unlockConfigurationValue.configurationValue}`;
            }
            this._always.fill({
                kinds: [new nodes_1.KindNode({ kind: constants_1.KIND.UNLOCK }).insertOrIgnore()],
            });
            this._always.types.push(new nodes_1.TypeNode({ kind: constants_1.KIND.UNLOCK, type: this.unlockConfigurationValue.unlockType }).insertOrIgnore());
            this._always.unlocks.push(new nodes_1.UnlockNode({ unlockType: this.unlockConfigurationValue.unlockType }).insertOrIgnore());
            this._always.unlockConfigurationValues.push(new nodes_1.UnlockConfigurationValueNode(this.unlockConfigurationValue).insertOrIgnore());
            this._always.unlockRewards.push(new nodes_1.UnlockRewardNode(Object.assign(Object.assign({ name: (0, utils_1.locale)(this.unlockConfigurationValue.configurationValue, 'name'), description: (0, utils_1.locale)(this.unlockConfigurationValue.configurationValue, 'description'), icon: this.unlockConfigurationValue.configurationValue }, this.unlockConfigurationValue), (this.unlockReward || {}))).insertOrIgnore());
            if (this.requirementSet !== null) {
                const requirementSet = new nodes_1.RequirementSetNode(this.requirementSet).insertOrIgnore();
                this._always.requirementSets.push(requirementSet);
                this._always.unlockRequirements.push(new nodes_1.UnlockRequirementNode(Object.assign(Object.assign(Object.assign({}, requirementSet), this.unlockConfigurationValue), { description: (0, utils_1.locale)(requirementSet.requirementSetId, 'description'), tooltip: (0, utils_1.locale)(requirementSet.requirementSetId, 'tooltip'), narrativeText: (0, utils_1.locale)(requirementSet.requirementSetId, 'narrative') })).insertOrIgnore());
                (_a = this.requirementSet.localizations) === null || _a === void 0 ? void 0 : _a.forEach(localization => {
                    this._localizations.push(new localizations_1.UnlockRequirementLocalization(Object.assign({ prefix: requirementSet.requirementSetId }, localization)).getNodes());
                });
                (_b = this.requirementSet.requirements) === null || _b === void 0 ? void 0 : _b.forEach(req => {
                    var _a;
                    const requirement = new nodes_1.RequirementNode(req).insertOrIgnore();
                    this._always.requirements.push(requirement);
                    this._always.requirementSetRequirements.push(new nodes_1.RequirementSetRequirementNode(Object.assign(Object.assign({}, requirementSet), requirement)).insertOrIgnore());
                    (_a = req.requirementArguments) === null || _a === void 0 ? void 0 : _a.forEach(arg => {
                        this._always.requirementArguments.push(new nodes_1.RequirementArgumentNode(Object.assign(Object.assign({}, requirement), arg)).insertOrIgnore());
                    });
                });
            }
        }
        if (this.civilizationUnlock) {
            this._always.fill({
                kinds: [new nodes_1.KindNode({ kind: constants_1.KIND.UNLOCK }).insertOrIgnore()],
            });
            const unlockType = `UNLOCK_${this.civilizationUnlock.type}`;
            const civilizationUnlock = new nodes_1.CivilizationUnlockNode(Object.assign({ name: (0, utils_1.locale)(this.civilizationUnlock.type, 'name'), description: (0, utils_1.locale)(this.civilizationUnlock.type, 'description'), icon: this.civilizationUnlock.type }, this.civilizationUnlock)).insertOrIgnore();
            this._shell.civilizationUnlocks.push(civilizationUnlock);
            this._always.types.push(new nodes_1.TypeNode({ kind: constants_1.KIND.UNLOCK, type: unlockType }).insertOrIgnore());
            this._always.unlocks.push(new nodes_1.UnlockNode({ unlockType }).insertOrIgnore());
            this._always.unlockConfigurationValues.push(new nodes_1.UnlockConfigurationValueNode({ unlockType, configurationValue: civilizationUnlock.type }).insertOrIgnore());
            this._always.unlockRewards.push(new nodes_1.UnlockRewardNode(Object.assign(Object.assign({ unlockType }, civilizationUnlock), { civUnlock: true })).insertOrIgnore());
            const requirementSet = new nodes_1.RequirementSetNode({ requirementSetType: constants_1.REQUIREMENT_SET.TEST_ALL }).insertOrIgnore();
            this._always.requirementSets.push(requirementSet);
            const requirement = new nodes_1.RequirementNode({ requirementType: constants_1.REQUIREMENT.PLAYER_CIVILIZATION_TYPE_MATCHES }).insertOrIgnore();
            this._always.requirements.push(requirement);
            this._always.unlockRequirements.push(new nodes_1.UnlockRequirementNode(Object.assign(Object.assign({ unlockType }, requirementSet), { description: (0, utils_1.locale)(`UNLOCK_PLAY_AS_${(0, utils_1.trim)(civilizationUnlock.civilizationType)}_${(0, utils_1.trim)(civilizationUnlock.type)}`, 'description'), tooltip: (0, utils_1.locale)(`UNLOCK_PLAY_AS_${(0, utils_1.trim)(civilizationUnlock.civilizationType)}_${(0, utils_1.trim)(civilizationUnlock.type)}`, 'tooltip'), narrativeText: (0, utils_1.locale)(`UNLOCK_PLAY_AS_${(0, utils_1.trim)(civilizationUnlock.civilizationType)}_${(0, utils_1.trim)(civilizationUnlock.type)}`, 'narrative') })).insertOrIgnore());
            (_c = this.civilizationUnlock.localizations) === null || _c === void 0 ? void 0 : _c.forEach(localization => {
                this._localizations.push(new localizations_1.UnlockRequirementLocalization(Object.assign({ prefix: `UNLOCK_PLAY_AS_${(0, utils_1.trim)(civilizationUnlock.civilizationType)}_${(0, utils_1.trim)(civilizationUnlock.type)}` }, localization)).getNodes());
            });
            this._always.requirementArguments.push(new nodes_1.RequirementArgumentNode(Object.assign(Object.assign({}, requirement), { name: 'CivilizationType', value: civilizationUnlock.civilizationType })).insertOrIgnore());
            this._always.requirementSetRequirements.push(new nodes_1.RequirementSetRequirementNode(Object.assign(Object.assign({}, requirementSet), requirement)));
        }
        if (this.leaderUnlock) {
            this._always.fill({
                kinds: [new nodes_1.KindNode({ kind: constants_1.KIND.UNLOCK }).insertOrIgnore()],
            });
            const unlockType = `UNLOCK_${this.leaderUnlock.type}`;
            const leaderUnlock = new nodes_1.LeaderUnlockNode(Object.assign({ name: (0, utils_1.locale)(this.leaderUnlock.type, 'name'), description: (0, utils_1.locale)(this.leaderUnlock.type, 'description'), icon: this.leaderUnlock.type }, this.leaderUnlock)).insertOrIgnore();
            this._shell.leaderUnlocks.push(leaderUnlock);
            this._always.types.push(new nodes_1.TypeNode({ kind: constants_1.KIND.UNLOCK, type: unlockType }).insertOrIgnore());
            this._always.unlocks.push(new nodes_1.UnlockNode({ unlockType }).insertOrIgnore());
            this._always.unlockConfigurationValues.push(new nodes_1.UnlockConfigurationValueNode({ unlockType, configurationValue: leaderUnlock.type }).insertOrIgnore());
            this._always.unlockRewards.push(new nodes_1.UnlockRewardNode(Object.assign(Object.assign({ unlockType }, leaderUnlock), { civUnlock: true })).insertOrIgnore());
            const requirementSet = new nodes_1.RequirementSetNode({ requirementSetType: constants_1.REQUIREMENT_SET.TEST_ALL }).insertOrIgnore();
            this._always.requirementSets.push(requirementSet);
            const requirement = new nodes_1.RequirementNode({ requirementType: constants_1.REQUIREMENT.PLAYER_LEADER_TYPE_MATCHES }).insertOrIgnore();
            this._always.requirements.push(requirement);
            this._always.unlockRequirements.push(new nodes_1.UnlockRequirementNode(Object.assign(Object.assign({ unlockType }, requirementSet), { description: (0, utils_1.locale)(`UNLOCK_PLAY_AS_${(0, utils_1.trim)(leaderUnlock.leaderType)}_${(0, utils_1.trim)(leaderUnlock.type)}`, 'description'), tooltip: (0, utils_1.locale)(`UNLOCK_PLAY_AS_${(0, utils_1.trim)(leaderUnlock.leaderType)}_${(0, utils_1.trim)(leaderUnlock.type)}`, 'tooltip'), narrativeText: (0, utils_1.locale)(`UNLOCK_PLAY_AS_${(0, utils_1.trim)(leaderUnlock.leaderType)}_${(0, utils_1.trim)(leaderUnlock.type)}`, 'narrative') })).insertOrIgnore());
            (_d = this.leaderUnlock.localizations) === null || _d === void 0 ? void 0 : _d.forEach(localization => {
                this._localizations.push(new localizations_1.UnlockRequirementLocalization(Object.assign({ prefix: `UNLOCK_PLAY_AS_${(0, utils_1.trim)(leaderUnlock.leaderType)}_${(0, utils_1.trim)(leaderUnlock.type)}` }, localization)).getNodes());
            });
            this._always.requirementArguments.push(new nodes_1.RequirementArgumentNode(Object.assign(Object.assign({}, requirement), { name: 'LeaderType', value: leaderUnlock.leaderType })).insertOrIgnore());
            this._always.requirementSetRequirements.push(new nodes_1.RequirementSetRequirementNode(Object.assign(Object.assign({}, requirementSet), requirement)));
        }
        return this;
    }
    build() {
        const path = `/unlocks/${(0, lodash_1.kebabCase)(this.name)}/`;
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
                name: 'shell.xml',
                content: this._shell.toXmlElement(),
                actionGroups: [this.actionGroupBundle.shell],
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
exports.UnlockBuilder = UnlockBuilder;
//# sourceMappingURL=UnlockBuilder.js.map