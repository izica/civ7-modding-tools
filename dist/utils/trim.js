"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = void 0;
const trim = (string, prefix) => {
    if (!string) {
        return '';
    }
    if (prefix && string.startsWith(prefix)) {
        return string.substring(prefix.length);
    }
    const prefixes = [
        'CIVILIZATION_',
        'LEADER_',
        'QUARTER_',
        'BUILDING_',
        'MODIFIER_',
        'WONDER_',
        'IMPROVEMENT_',
        'UNIT_',
        'TREE_',
        'TRADITION_',
        'CONSTRUCTIBLE_',
        'UNLOCK_',
    ];
    for (const prefix of prefixes) {
        if (string.startsWith(prefix)) {
            return string.substring(prefix.length);
        }
    }
    return string;
};
exports.trim = trim;
//# sourceMappingURL=trim.js.map