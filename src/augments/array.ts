import {ArrayElement, typeOfWithArray} from '@augment-vir/common';

export function flatArrayTo2DArray<Entry extends {coords: {x: number; z: number}}>(
    entries: ReadonlyArray<Entry>,
): Entry[][] {
    const array2D: Entry[][] = [];
    entries.forEach((entry) => {
        if (!array2D[entry.coords.x]) {
            array2D[entry.coords.x] = [];
        }

        array2D[entry.coords.x]![entry.coords.z] = entry;
    });
    return array2D;
}

export function flatArrayTo3DArray<Entry extends {coords: {x: number; z: number; y: number}}>(
    entries: ReadonlyArray<Entry>,
): Entry[][][] {
    const array3D: Entry[][][] = [];
    entries.forEach((entry) => {
        if (!array3D[entry.coords.y]) {
            array3D[entry.coords.y] = [];
        }
        if (!array3D[entry.coords.y]![entry.coords.z]) {
            array3D[entry.coords.y]![entry.coords.z] = [];
        }

        array3D[entry.coords.y]![entry.coords.z]![entry.coords.x] = entry;
    });
    return array3D;
}

export type NestedArray<Entry> = Entry[] | NestedArray<Entry>[];

export type NestedEntry<OriginalArray> = OriginalArray extends any[]
    ? NestedEntry<ArrayElement<OriginalArray>>
    : OriginalArray;

export function completelyFlattenArray<Entry>(
    nestedArray: Readonly<NestedArray<Readonly<Entry>>>,
): NestedEntry<Entry>[] {
    if (typeOfWithArray(nestedArray[0]) === 'array') {
        return completelyFlattenArray((nestedArray as Entry[][]).flat());
    } else {
        return nestedArray as unknown as NestedEntry<Entry>[];
    }
}
