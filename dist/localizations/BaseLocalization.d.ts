import { TObjectValues } from "../types";
import { LANGUAGE } from "../constants";
import { TDatabaseNode } from "../nodes";
export declare class BaseLocalization<T> {
    language?: TObjectValues<typeof LANGUAGE>;
    prefix?: string | null;
    constructor(payload?: Partial<T>);
    fill<T>(payload?: Partial<T>): this;
    getNodes(): Partial<TDatabaseNode>;
}
