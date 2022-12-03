import {PersistentWorkerData} from '../persistent-worker-data';
import {postAndWait} from '../post-and-wait';
import {postTypedMessage} from '../post-message';
import {setupWorker} from '../setup-worker';
import {InitWorkerMessageData, MessageDataTypeEnum, WorkerTypeEnum} from '../worker-messages';

export async function initWorker(data: InitWorkerMessageData): Promise<PersistentWorkerData> {
    const workers: Worker[] =
        data.workerType === WorkerTypeEnum.Main
            ? Array(data.workerCount)
                  .fill(0)
                  .map((_value, index) => {
                      return setupWorker(`child-worker-${index}`);
                  })
            : [];

    await Promise.all(
        workers.map(async (worker) => {
            const response = await postAndWait(
                worker,
                {
                    ...data,
                    workerType: WorkerTypeEnum.BlockReader,
                    workerCount: 0,
                },
                MessageDataTypeEnum.ProgressReport,
            );

            if (response.total !== response.current && response.total !== 0) {
                throw new Error(`Child worker started with its own children!`);
            }
        }),
    );

    if (data.workerType === WorkerTypeEnum.Main) {
        console.info(`Started ${data.workerCount} workers`);
    }

    postTypedMessage(self, {
        type: MessageDataTypeEnum.ProgressReport,
        current: data.workerCount,
        total: data.workerCount,
    });

    return {
        init: data,
        childWorkers: workers,
    };
}
