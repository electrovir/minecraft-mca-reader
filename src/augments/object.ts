import {isObject, ObjectValueType} from '@augment-vir/common';

export type NestedRecord<KeyType extends PropertyKey, ValueType> = {
    [key in KeyType]: ValueType | NestedRecord<KeyType, ValueType>;
};

export type FlattenedValues<OriginalObject extends object | never> = OriginalObject extends never
    ? never
    :
          | Exclude<ObjectValueType<OriginalObject>, object>
          | FlattenedValues<Extract<ObjectValueType<OriginalObject>, object>>;

export function extractNestedValues<InputObject extends object>(
    input: InputObject,
): FlattenedValues<InputObject>[] {
    return Object.values(input)
        .map((value) => {
            if (isObject(value)) {
                return extractNestedValues(value).flat();
            } else {
                return value;
            }
        })
        .flat();
}
