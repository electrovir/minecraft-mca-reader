import {randomString} from '@augment-vir/browser';
import {MinecraftWorld} from '../data/minecraft-world';
import {MinecraftVersion} from '../minecraft-versions';
import {ParseProgressCallback} from './parser';

export async function parseMcaFiles({
    files,
    worldName,
    minecraftVersion,
    parseProgressCallback,
}: {
    files: ReadonlyArray<Readonly<File>>;
    worldName: string;
    minecraftVersion: MinecraftVersion;
    parseProgressCallback: ParseProgressCallback;
}): Promise<MinecraftWorld> {
    const myWorker = new Worker('src/parser/parser-worker.ts');
    myWorker.onmessage = (event) => {
        console.log({receivedEvent: event});
    };
    myWorker.postMessage(`hello there ${randomString}`);
    console.log({myWorker});
    // parseProgressCallback(0);
    // // give the view time to render the progress bar
    // await wait(17 * 20);

    // const worldParts: ReadonlyArray<Readonly<McaParserOutput>> = await Promise.all(
    //     files.map(async (file) => {
    //         console.log(`parsing ${file.name}`);
    //         const fileContents: ArrayBuffer = await readFile(file, 'readAsArrayBuffer');
    //         console.log(`${file.name} finished reading`);
    //         const worldPart = await mcaParserByVersion[minecraftVersion](
    //             fileContents,
    //             parseProgressCallback,
    //         );
    //         console.log(0);
    //         return worldPart;
    //     }),
    // );

    // const combinedWorldParts = combineWorldParts(worldParts);
    // console.log(1);

    // return {
    //     ...combinedWorldParts,
    //     name: worldName,
    // };
    return {} as any;
}

// function combineWorldParts(worldParts: ReadonlyArray<Readonly<McaParserOutput>>): McaParserOutput {
//     const allBlocks: ReadonlyArray<MinecraftBlock> = completelyFlattenArray(
//         worldParts.map((worldPart) => worldPart.blocks),
//     );

//     const allChunks: ReadonlyArray<MinecraftChunk> = completelyFlattenArray(
//         worldParts.map((worldPart) => worldPart.chunks),
//     );

//     const combinedWorldParts: McaParserOutput = {
//         blocks: flatArrayTo3DArray(allBlocks),
//         chunks: flatArrayTo2DArray(allChunks),
//     };

//     return combinedWorldParts;
// }
