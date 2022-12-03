import {AnyMessage, getEventData, MessageTypeEnum} from './worker-messages';
import {workerStartReadingFiles} from './worker-start-reading-files';

const messageHandlers: {
    [Prop in MessageTypeEnum]: (data: Extract<AnyMessage, {type: Prop}>) => Promise<void> | void;
} = {
    [MessageTypeEnum.ProgressReport]: () => {},
    [MessageTypeEnum.StartExtractingBlocks]: () => {},
    [MessageTypeEnum.StartReadingFiles]: workerStartReadingFiles,
};

self.onmessage = async (event) => {
    const data = getEventData(event);

    await messageHandlers[data.type](data as any);
};
