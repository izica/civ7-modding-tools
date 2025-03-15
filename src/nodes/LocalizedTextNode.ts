import { BaseNode } from "./BaseNode";
import { TObjectValues } from "../types";
import { LANGUAGE } from "../constants";

export type TLocalizedTextNode = Pick<LocalizedTextNode,
    "tag" |
    "language" |
    "text"
>;

export class LocalizedTextNode extends BaseNode<TLocalizedTextNode> {
    _name = 'Replace';
    language: TObjectValues<typeof LANGUAGE> = LANGUAGE.en_US;
    tag: string | null = 'LOC_';
    text: string | number | null = 'text'

    constructor(payload: Partial<TLocalizedTextNode> = {}) {
        super();
        this.fill(payload);
    }

    toXmlElement() {
        return {
            _name: this._name,
            _attrs: {
                Tag: this.tag,
                Language: this.language
            },
            _content: {
                Text: this.text
            }
        }
    }
}
