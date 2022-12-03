import {Coords2D, Coords3D} from './coords';

export type MinecraftBlock = {
    type: number;
    x: number;
    y: number;
    z: number;
};

export type MinecraftChunk = {
    coords: Coords2D;
};

export type MinecraftWorld = {
    name: string;
    // first y coordinate, then x coordinate, then z coordinate
    blocks: MinecraftBlock[];
};

const chunkSize = {
    x: {
        min: 0,
        max: 15,
        count: 16,
    },
    z: {
        min: 0,
        max: 15,
        count: 16,
    },
    y: {
        min: -64,
        max: 256,
        count: 321,
    },
} as const;

export function coords3DToAnvilBlockCoord(coords: Coords3D): [number, number, number] {
    return [
        coords.x,
        coords.y,
        coords.z,
    ];
}

export function getAllBlockCoordsFromChunkCoords(chunkCoords: Coords2D): Coords3D[] {
    const blockCoords: Coords3D[] = [];

    for (let x = chunkSize.x.min; x <= chunkSize.x.max; x++) {
        for (let z = chunkSize.z.min; z <= chunkSize.z.max; z++) {
            for (let y = chunkSize.y.min; y <= chunkSize.y.max; y++) {
                blockCoords.push({
                    x: x + chunkCoords.x * chunkSize.x.count,
                    z: z + chunkCoords.z * chunkSize.z.count,
                    y,
                });
            }
        }
    }

    return blockCoords;
}
