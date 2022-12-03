import {isTruthy, wait} from '@augment-vir/common';
import {readFile} from '../../../augments/file-reader';
import {Coords3D} from '../../../data/coords';
import {
    coords3DToAnvilBlockCoord,
    getAllBlockCoordsFromChunkCoords,
    MinecraftBlock,
    MinecraftChunk,
} from '../../../data/minecraft-world';
import {McaParser, McaParserOutput} from '../../parser';
import {AnvilParser} from './anvil-parser';

export type ParseOutput_java_1_19_2 = {
    derp: string;
};

export const java_1_19_2: McaParser = {
    blockCounter: countBlocks,
    blockParser: (() => {}) as any,
};

type ParseAnvilOutput = {
    anvil: AnvilParser;
    blockCoords: ReadonlyArray<Coords3D>;
};

const anvilCache = new WeakMap<Readonly<File>, ParseAnvilOutput>();

async function anvilParse(file: Readonly<File>): Promise<ParseAnvilOutput> {
    const cached = anvilCache.get(file);
    if (cached) {
        return cached;
    }

    const fileContents: ArrayBuffer = await readFile(file, 'readAsArrayBuffer');
    const anvil = new AnvilParser(fileContents);
    const chunks = anvil.getAllChunks();

    const minecraftChunks: ReadonlyArray<MinecraftChunk> = chunks
        .map((anvilChunk): MinecraftChunk | undefined => {
            const coords = anvilChunk.getChunkCoordinates();
            if (coords) {
                return {
                    coords: {
                        x: coords[0],
                        z: coords[1],
                    },
                };
            } else {
                return undefined;
            }
        })
        .filter(isTruthy);

    const blockCoords: ReadonlyArray<Coords3D> = minecraftChunks
        .map((chunk) => {
            return getAllBlockCoordsFromChunkCoords(chunk.coords);
        })
        .flat();

    return {
        anvil,
        blockCoords,
    };
}

async function countBlocks(file: Readonly<File>) {
    return (await anvilParse(file)).blockCoords.length;
}

export async function readBlocks(file: Readonly<File>): Promise<McaParserOutput> {
    const {anvil, blockCoords} = await anvilParse(file);

    console.log('got block coords');
    const total = blockCoords.length;
    console.log({total});

    const minecraftBlocks: MinecraftBlock[] = [];
    const hundredthIncrement = Math.floor(total / 100);

    // 59824128

    let blockIndex = 0;
    for (let hundredthIndex = 0; hundredthIndex < total; hundredthIndex += hundredthIncrement) {
        for (
            ;
            blockIndex < hundredthIndex + hundredthIncrement && blockIndex < total;
            blockIndex++
        ) {
            const currentBlockCoords = blockCoords[blockIndex]!;
            try {
                const anvilBlock = anvil.getBlock(coords3DToAnvilBlockCoord(currentBlockCoords));
                minecraftBlocks.push({} as any);
            } catch (error) {
                console.error({erroredBlockCoords: currentBlockCoords});
                throw error;
            }
        }
        const percent = Math.round((blockIndex / total) * 100);
        // parseProgressCallback(percent);
        await wait(17 * 5);
    }
    console.log('got blocks');
    await wait(17 * 5);

    return {
        blocks: minecraftBlocks,
    };
}
