import { BaseLocalization } from "./BaseLocalization";
import { TClassProperties } from "../types";
export type TCivilizationLocalization = TClassProperties<CivilizationLocalization>;
export declare class CivilizationLocalization extends BaseLocalization<TCivilizationLocalization> {
    name: string;
    description: string;
    fullName: string;
    adjective: string;
    abilityName: string;
    abilityDescription: string;
    cityNames: string[];
    constructor(payload?: Partial<TCivilizationLocalization>);
}
