import {PersistentWorkerData} from '../persistent-worker-data';
import {postTypedMessage} from '../post-message';
import {MessageDataTypeEnum} from '../worker-messages';

export function closeWorkers(_data: unknown, persistentData: PersistentWorkerData) {
    persistentData.childWorkers.forEach((childWorker) => {
        childWorker.terminate();
    });
    console.info('Child workers terminated');

    postTypedMessage(self, {
        type: MessageDataTypeEnum.ProgressReport,
        current: persistentData.childWorkers.length,
        total: persistentData.childWorkers.length,
    });
}
