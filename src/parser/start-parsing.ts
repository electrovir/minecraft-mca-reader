import {getSavedMinecraftBlockNames} from '../cache/block-names-storage';
import {MinecraftVersion} from '../minecraft-versions';
import {postTypedMessage} from './parser-worker/send-message';
import {setupWorker} from './parser-worker/start-worker';
import {MessageTypeEnum} from './parser-worker/worker-messages';

export async function startParsing({
    files,
    coreCount,
    worldName,
    minecraftVersion,
}: {
    files: ReadonlyArray<Readonly<File>>;
    coreCount: number;
    worldName: string;
    minecraftVersion: MinecraftVersion;
}) {
    const savedBlockNames = await getSavedMinecraftBlockNames();

    const mainWorker = setupWorker('main-worker', (message) => {
        console.log(message);
    });

    postTypedMessage(mainWorker, {
        type: MessageTypeEnum.StartReadingFiles,
        blockNames: savedBlockNames,
        coreCount,
        mcaFile: files[0]!,
        minecraftVersion,
        worldName,
    });
}
