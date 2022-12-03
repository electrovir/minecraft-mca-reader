import {wrapNarrowTypeWithTypeCheck} from '@augment-vir/common';
import {extractNestedValues, FlattenedValues} from './augments/object';

type MinecraftVersionType = 'java';

type MinecraftVersionStringValue = `${MinecraftVersionType}.${number}.${number}.${number}`;

export const minecraftVersions = wrapNarrowTypeWithTypeCheck<
    Record<
        MinecraftVersionType,
        Record<number, Record<number, Record<number, MinecraftVersionStringValue>>>
    >
>()({
    java: {
        1: {
            19: {
                3: 'java.1.19.3',
                2: 'java.1.19.2',
            },
        },
    },
} as const);

export type MinecraftVersion = FlattenedValues<typeof minecraftVersions>;

export const flattenedMinecraftVersions = extractNestedValues(minecraftVersions);
