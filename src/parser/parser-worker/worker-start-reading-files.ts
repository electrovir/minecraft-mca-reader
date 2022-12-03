import {getMcaParserByVersion} from '../all-parsers';
import {postTypedMessage} from './send-message';
import {MessageTypeEnum, StartReadingFilesWorkerMessage} from './worker-messages';

export async function workerStartReadingFiles(data: StartReadingFilesWorkerMessage) {
    const parser = getMcaParserByVersion(data.minecraftVersion);
    const blockCounts = await parser.blockCounter(data.mcaFile);

    postTypedMessage(self, {
        type: MessageTypeEnum.ProgressReport,
        current: 0,
        total: blockCounts,
    });
}
