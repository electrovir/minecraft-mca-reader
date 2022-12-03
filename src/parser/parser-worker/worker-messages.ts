import {
    assertMatchesObjectShape,
    ObjectValueType,
    wrapNarrowTypeWithTypeCheck,
} from '@augment-vir/common';
import {MinecraftBlockNameMapping} from '../../data/minecraft-block-name';
import {MinecraftVersion, minecraftVersions} from '../../minecraft-versions';

export enum WorkerTypeEnum {
    /**
     * The main worker that handles all the other workers and reports back to the main thread (the
     * UI).
     */
    Main = 'main',
    /** The leaf worker that handles reading blocks and reports to the main worker. */
    BlockReader = 'block-reader',
}

export enum MessageDataTypeEnum {
    GetBlockCount = 'get-block-count',
    StartExtractingBlocks = 'start-extracting-blocks',
    ProgressReport = 'progress-report',
    InitWorker = 'init-worker',
    Close = 'close',
}

type BaseMessageData<MessageType extends MessageDataTypeEnum> = {
    type: MessageType;
};

export type ProgressReportMessageData = BaseMessageData<MessageDataTypeEnum.ProgressReport> & {
    current: number;
    total: number;
};

export type InitWorkerMessageData = BaseMessageData<MessageDataTypeEnum.InitWorker> & {
    workerCount: number;
    worldName: string;
    parseGroupSize: number;
    minecraftVersion: MinecraftVersion;
    workerType: WorkerTypeEnum;
};

export type StartExtractingBlocksMessageData =
    BaseMessageData<MessageDataTypeEnum.StartExtractingBlocks> & {
        blockNames: MinecraftBlockNameMapping;
        mcaFile: Readonly<File>;
    };

export type GetBlockCountMessageData = BaseMessageData<MessageDataTypeEnum.GetBlockCount> & {
    mcaFile: Readonly<File>;
};

function createValidator<MessageType extends BaseMessageData<MessageDataTypeEnum>>(
    validator: MessageType,
) {
    return (event: Pick<MessageEvent<unknown>, 'data'>): MessageType => {
        const data = event.data;

        assertMatchesObjectShape<any>(data, validator);

        return data;
    };
}
const validators = wrapNarrowTypeWithTypeCheck<{
    [Prop in MessageDataTypeEnum]: (
        event: Pick<MessageEvent<unknown>, 'data'>,
    ) => BaseMessageData<Prop>;
}>()({
    [MessageDataTypeEnum.StartExtractingBlocks]: createValidator<StartExtractingBlocksMessageData>({
        type: MessageDataTypeEnum.StartExtractingBlocks,
        blockNames: {
            byIndex: {},
            byName: {},
        },
        mcaFile: new File([], ''),
    }),
    [MessageDataTypeEnum.GetBlockCount]: createValidator<GetBlockCountMessageData>({
        type: MessageDataTypeEnum.GetBlockCount,
        mcaFile: new File([], ''),
    }),
    [MessageDataTypeEnum.ProgressReport]: createValidator<ProgressReportMessageData>({
        type: MessageDataTypeEnum.ProgressReport,
        current: 0,
        total: 0,
    }),
    [MessageDataTypeEnum.InitWorker]: createValidator<InitWorkerMessageData>({
        type: MessageDataTypeEnum.InitWorker,
        minecraftVersion: minecraftVersions.java[1][19][2],
        parseGroupSize: 0,
        worldName: '',
        workerCount: 0,
        workerType: WorkerTypeEnum.Main,
    }),
    [MessageDataTypeEnum.Close]: createValidator<BaseMessageData<MessageDataTypeEnum.Close>>({
        type: MessageDataTypeEnum.Close,
    }),
});

function getValidator(key: any): ObjectValueType<typeof validators> | undefined {
    return (validators as any)[key];
}

export type AnyMessageData = ReturnType<ObjectValueType<typeof validators>>;

export function getEventData(event: Pick<MessageEvent<unknown>, 'data'>): AnyMessageData {
    const data: any = event.data;

    const validator = getValidator(data.type);
    let validatedData: AnyMessageData | undefined = undefined;
    try {
        validatedData = validator?.(event);
    } catch (error) {
        console.error(error);
    }

    if (validatedData == undefined) {
        console.error({event});
        throw new Error(`Invalid worker message event received.`);
    }

    return validatedData;
}
