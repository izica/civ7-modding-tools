import { TObjectValues } from "../types";
import { AGE } from "./AGE";

export const CIVILIZATION_DOMAIN = {
    AntiquityAgeCivilizations: 'AntiquityAgeCivilizations',
    ExplorationAgeCivilizations: 'ExplorationAgeCivilizations',
    ModernAgeCivilizations: 'ModernAgeCivilizations',

    from(age: TObjectValues<typeof AGE>) {
        return {
            [AGE.ANTIQUITY]: this.AntiquityAgeCivilizations,
            [AGE.EXPLORATION]: this.ExplorationAgeCivilizations,
            [AGE.MODERN]: this.ModernAgeCivilizations
        }[age];
    },
} as const;
