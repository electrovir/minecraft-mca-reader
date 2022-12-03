import {getMcaParserByVersion} from '../../all-parsers';
import {PersistentWorkerData} from '../persistent-worker-data';
import {postTypedMessage} from '../post-message';
import {GetBlockCountMessageData, MessageDataTypeEnum} from '../worker-messages';

export async function workerGetBlockCount(
    data: GetBlockCountMessageData,
    persistentData: PersistentWorkerData,
): Promise<void> {
    const parser = getMcaParserByVersion(persistentData.init.minecraftVersion);
    const blockCounts = await parser.blockCounter(data.mcaFile);

    postTypedMessage(self, {
        type: MessageDataTypeEnum.ProgressReport,
        current: 0,
        total: blockCounts,
    });
}
