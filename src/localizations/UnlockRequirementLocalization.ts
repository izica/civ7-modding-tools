import { BaseLocalization } from "./BaseLocalization";

import { TClassProperties } from "../types";

export type TUnlockRequirementLocalization = TClassProperties<UnlockRequirementLocalization>;

export class UnlockRequirementLocalization extends BaseLocalization<TUnlockRequirementLocalization> {
    description: string | null = null;
    tooltip: string | null = null;
    narrative: string | null = null;

    constructor(payload: Partial<TUnlockRequirementLocalization> = {}) {
        super();
        this.fill(payload);
    }
}
