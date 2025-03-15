import { BaseLocalization } from "./BaseLocalization";

import { TClassProperties } from "../types";

export type TRequirementLocalization = TClassProperties<RequirementLocalization>;

export class RequirementLocalization extends BaseLocalization<TRequirementLocalization> {
    description: string | null = null;
    tooltip: string | null = null;
    narrative: string | null = null;

    constructor(payload: Partial<TRequirementLocalization> = {}) {
        super();
        this.fill(payload);
    }
}
