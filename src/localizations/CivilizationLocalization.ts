import { BaseLocalization } from "./BaseLocalization";

import { TClassProperties } from "../types";

export type TCivilizationLocalization = TClassProperties<CivilizationLocalization>;
export class CivilizationLocalization extends BaseLocalization<TCivilizationLocalization>{
    name = 'test';
    description = 'text';
    fullName = 'text';
    adjective = 'text';
    abilityName: string = 'text';
    abilityDescription: string = 'text';
    cityNames: string[] = ['test city name'];

    constructor(payload: Partial<TCivilizationLocalization> = {}) {
        super();
        this.fill(payload);
    }
}
