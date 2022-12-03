import {closeWorkers} from './message-handlers/worker-close';
import {workerGetBlockCount} from './message-handlers/worker-get-block-count';
import {initWorker} from './message-handlers/worker-init';
import {PersistentWorkerData} from './persistent-worker-data';
import {AnyMessageData, getEventData, MessageDataTypeEnum} from './worker-messages';

type MessageHandler<Prop extends MessageDataTypeEnum> = (
    data: Extract<AnyMessageData, {type: Prop}>,
    persistentData: Prop extends MessageDataTypeEnum.InitWorker ? undefined : PersistentWorkerData,
) => Promise<PersistentWorkerData | void> | PersistentWorkerData | void;

const messageHandlers: {
    [Prop in MessageDataTypeEnum]: MessageHandler<Prop>;
} = {
    [MessageDataTypeEnum.ProgressReport]: () => {},
    [MessageDataTypeEnum.StartExtractingBlocks]: () => {},
    [MessageDataTypeEnum.InitWorker]: initWorker,
    [MessageDataTypeEnum.GetBlockCount]: workerGetBlockCount,
    [MessageDataTypeEnum.Close]: closeWorkers,
};

let persistentWorkerData: PersistentWorkerData | undefined = undefined;

self.onmessage = async (event) => {
    const data = getEventData(event);

    if (!persistentWorkerData && data.type !== MessageDataTypeEnum.InitWorker) {
        throw new Error(
            `Worker has not been initialized yet and it has already received a non-init message: ${data}`,
        );
    }

    const result = await (messageHandlers[data.type] as MessageHandler<MessageDataTypeEnum>)(
        data,
        persistentWorkerData,
    );

    if (result) {
        persistentWorkerData = result;
    }
};
