import { BaseNode } from "./BaseNode";
import { TObjectValues } from "../types";
import { LANGUAGE } from "../constants";
export type TLocalizedTextNode = Pick<LocalizedTextNode, "tag" | "language" | "text">;
export declare class LocalizedTextNode extends BaseNode<TLocalizedTextNode> {
    _name: string;
    language: TObjectValues<typeof LANGUAGE>;
    tag: string | null;
    text: string | number | null;
    constructor(payload?: Partial<TLocalizedTextNode>);
    toXmlElement(): {
        _name: string;
        _attrs: {
            Tag: string | null;
            Language: TObjectValues<{
                readonly en_US: "en_US";
                readonly de_DE: "de_DE";
                readonly es_ES: "es_ES";
                readonly fr_FR: "fr_FR";
                readonly it_IT: "it_IT";
                readonly ja_JP: "ja_JP";
                readonly ko_KR: "ko_KR";
                readonly pl_PL: "pl_PL";
                readonly pt_BR: "pt_BR";
                readonly ru_RU: "ru_RU";
                readonly zh_Hans_CN: "zh_Hans_CN";
                readonly zh_Hant_HK: "zh_Hant_HK";
            }>;
        };
        _content: {
            Text: string | number | null;
        };
    };
}
