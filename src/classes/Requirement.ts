import { REQUIREMENT } from "../constants";
import { TClassProperties, TObjectValues } from "../types";

import { Base } from "./Base";

type TRequirement = TClassProperties<Requirement>;

export class Requirement extends Base<TRequirement> implements TRequirement {
    type: TObjectValues<typeof REQUIREMENT> = REQUIREMENT.GAME_IS_STARTED;
    arguments: Record<string, string | number> = {};
    constructor(payload: Partial<TRequirement> = {}) {
        super();
        this.fill(payload);
    }

    toXmlElement() {
        return {
            _name: 'Requirement',
            _attrs: {
                type: this.type
            },
            _content: Object.entries(this.arguments).map(([key, value]) => ({
                _name: 'Argument',
                _attrs: {
                    name: key
                },
                _content: value
            }))
        }
    }
}