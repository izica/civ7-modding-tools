export type TLocalizationProperties<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
} & {
    prefix?: string;
};
