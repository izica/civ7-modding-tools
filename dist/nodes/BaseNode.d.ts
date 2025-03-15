import { XmlElement } from "jstoxml";
export declare class BaseNode<T extends Object = object> {
    _name: string;
    constructor(payload?: Partial<T>);
    fill: (this: any, payload?: Partial<T>) => any;
    private getAttributes;
    insertOrIgnore(): this;
    replace(): this;
    toXmlElement(): XmlElement | XmlElement[] | null;
}
