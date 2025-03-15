import { BaseLocalization } from "./BaseLocalization";
import { TClassProperties } from "../types";
export type TUnlockRequirementLocalization = TClassProperties<UnlockRequirementLocalization>;
export declare class UnlockRequirementLocalization extends BaseLocalization<TUnlockRequirementLocalization> {
    description: string | null;
    tooltip: string | null;
    narrative: string | null;
    constructor(payload?: Partial<TUnlockRequirementLocalization>);
}
