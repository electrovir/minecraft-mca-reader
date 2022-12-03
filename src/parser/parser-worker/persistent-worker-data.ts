import {InitWorkerMessageData} from './worker-messages';

export type PersistentWorkerData = {
    init: InitWorkerMessageData;
    childWorkers: ReadonlyArray<Worker>;
};
