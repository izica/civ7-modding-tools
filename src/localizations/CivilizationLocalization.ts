import { BaseLocalization } from "./BaseLocalization";

import { TClassProperties } from "../types";

type TCivilizationLocalization = TClassProperties<CivilizationLocalization>;
export class CivilizationLocalization extends BaseLocalization<TCivilizationLocalization>{
    name = 'test';
    description = 'text';
    fullName = 'text';
    adjective = 'text';
    cityNames: string[] = ['test city name']

    constructor(payload: Partial<TCivilizationLocalization> = {}) {
        super();
        this.fill(payload);
    }
}