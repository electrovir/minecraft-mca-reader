import {awaitedForEach} from '@augment-vir/common';
import {getSavedMinecraftBlockNames} from '../cache/block-names-storage';
import {MinecraftBlockNameMapping} from '../data/minecraft-block-name';
import {MinecraftVersion} from '../minecraft-versions';
import {postAndWait} from './parser-worker/post-and-wait';
import {setupWorker} from './parser-worker/setup-worker';
import {MessageDataTypeEnum, WorkerTypeEnum} from './parser-worker/worker-messages';

export type ParsingInputs = {
    mcaFiles: ReadonlyArray<Readonly<File>>;
    workerCount: number;
    worldName: string;
    minecraftVersion: MinecraftVersion;
};

export async function startParsing(inputs: ParsingInputs) {
    const mainWorker = setupWorker('main-worker');

    const initResponse = await postAndWait(
        mainWorker,
        {
            type: MessageDataTypeEnum.InitWorker,
            workerCount: inputs.workerCount,
            minecraftVersion: inputs.minecraftVersion,
            parseGroupSize: 100,
            worldName: inputs.worldName,
            workerType: WorkerTypeEnum.Main,
        },
        MessageDataTypeEnum.ProgressReport,
    );

    if (initResponse.current !== inputs.workerCount) {
        throw new Error(
            `Failed to create "${inputs.workerCount}" number of workers. Only got "${initResponse.current}".`,
        );
    }

    await awaitedForEach(inputs.mcaFiles, async (mcaFile) => {
        const savedBlockNames = await getSavedMinecraftBlockNames();
        await parseFile(mainWorker, mcaFile, savedBlockNames);
    });

    await postAndWait(
        mainWorker,
        {
            type: MessageDataTypeEnum.Close,
        },
        MessageDataTypeEnum.ProgressReport,
    );
    mainWorker.terminate();
    console.info('Main worker terminated');
    throw new Error('Implement reading the blocks');
}

async function parseFile(
    mainWorker: Worker,
    mcaFile: Readonly<File>,
    blockNames: MinecraftBlockNameMapping,
) {
    const response = await postAndWait(mainWorker, {
        type: MessageDataTypeEnum.GetBlockCount,
        mcaFile,
    });

    if (response.type !== MessageDataTypeEnum.ProgressReport) {
        throw new Error(`Expected progress report after initial start reading files message`);
    }

    console.info(`${mcaFile.name} totalBlocks:`, response.total);
}
