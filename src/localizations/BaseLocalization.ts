import * as lodash from "lodash";

import { TObjectValues } from "../types";
import { LANGUAGE } from "../constants";
import { locale } from "../utils";
import { EnglishTextNode, LocalizedTextNode, TDatabaseNode } from "../nodes";

export class BaseLocalization<T> {
    language?: TObjectValues<typeof LANGUAGE> = LANGUAGE.en_US;
    prefix?: string | null = null;

    constructor(payload: Partial<T> = {}) {
        this.fill(payload);
    }

    fill<T>(payload: Partial<T> = {}) {
        for (const [key, value] of Object.entries(payload)) {
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        }
        return this;
    }

    getNodes(): Partial<TDatabaseNode> {
        const keys = lodash.without(Object.keys(this), 'prefix', 'language');

        const result: Pick<TDatabaseNode, 'englishText' | 'localizedText'> = {
            englishText: [],
            localizedText: []
        };

        (keys as string[]).forEach(key => {
            if (!this[key]) {
                return;
            }

            if (Array.isArray(this[key])) {
                this[key].forEach((value, index) => {
                    const data = {
                        tag: locale(this.prefix || '', `${key}_${index + 1}`),
                        text: value
                    };

                    if (this.language === LANGUAGE.en_US) {
                        result.englishText.push(new EnglishTextNode(data));
                    } else {
                        result.localizedText.push(new LocalizedTextNode({
                            language: this.language,
                            ...data
                        }));
                    }
                });
            } else {
                const data = {
                    tag: locale(this.prefix || '', key),
                    text: this[key]
                };

                if (this.language === LANGUAGE.en_US) {
                    result.englishText.push(new EnglishTextNode(data));
                } else {
                    result.localizedText.push(new LocalizedTextNode({
                        language: this.language,
                        ...data
                    }));
                }
            }
        });

        return result;
    }
}
