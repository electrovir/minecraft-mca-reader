import {
    assertMatchesObjectShape,
    ObjectValueType,
    wrapNarrowTypeWithTypeCheck,
} from '@augment-vir/common';
import {MinecraftBlockNameMapping} from '../../data/minecraft-block-name';
import {MinecraftVersion, minecraftVersions} from '../../minecraft-versions';

export enum MessageTypeEnum {
    StartReadingFiles = 'start-reading-files',
    StartExtractingBlocks = 'start-extracting-blocks',
    ProgressReport = 'progress-report',
}

type BaseMessage<MessageType extends MessageTypeEnum> = {
    type: MessageType;
};

export type ProgressReportMessage = BaseMessage<MessageTypeEnum.ProgressReport> & {
    current: number;
    total: number;
};

export type StartExtractingBlocksMessage = BaseMessage<MessageTypeEnum.StartExtractingBlocks> & {
    minecraftVersion: MinecraftVersion;
    mcaFile: Readonly<File>;
    blockNames: MinecraftBlockNameMapping;
    worldName: string;
    parseGroupSize: number;
};

export type StartReadingFilesWorkerMessage = BaseMessage<MessageTypeEnum.StartReadingFiles> & {
    minecraftVersion: MinecraftVersion;
    mcaFile: Readonly<File>;
    blockNames: MinecraftBlockNameMapping;
    worldName: string;
    coreCount: number;
};

function createValidator<MessageType extends BaseMessage<MessageTypeEnum>>(validator: MessageType) {
    return (event: MessageEvent<unknown>): MessageType => {
        const data = event.data;

        assertMatchesObjectShape<any>(data, validator);

        return data;
    };
}
const validators = wrapNarrowTypeWithTypeCheck<{
    [Prop in MessageTypeEnum]: (event: MessageEvent<unknown>) => BaseMessage<Prop>;
}>()({
    [MessageTypeEnum.StartExtractingBlocks]: createValidator<StartExtractingBlocksMessage>({
        type: MessageTypeEnum.StartExtractingBlocks,
        minecraftVersion: minecraftVersions.java[1][19][2],
        blockNames: {
            byIndex: {
                0: '',
            },
            byName: {
                '': 5,
            },
        },
        mcaFile: new File([], ''),
        parseGroupSize: 0,
        worldName: '',
    }),
    [MessageTypeEnum.StartReadingFiles]: createValidator<StartReadingFilesWorkerMessage>({
        type: MessageTypeEnum.StartReadingFiles,
        minecraftVersion: minecraftVersions.java[1][19][2],
        mcaFile: new File([], ''),
        blockNames: {
            byIndex: {},
            byName: {},
        },
        worldName: '',
        coreCount: 0,
    }),
    [MessageTypeEnum.ProgressReport]: createValidator<ProgressReportMessage>({
        type: MessageTypeEnum.ProgressReport,
        current: 0,
        total: 0,
    }),
});

function getValidator(key: any): ObjectValueType<typeof validators> | undefined {
    return (validators as any)[key];
}

export type AnyMessage = ReturnType<ObjectValueType<typeof validators>>;

export function getEventData(event: MessageEvent<unknown>): AnyMessage {
    const data: any = event.data;

    const validator = getValidator(data.type);

    const validatedData = validator?.(event);

    if (validatedData == undefined) {
        throw new Error(`Invalid worker message received: ${event}`);
    }

    return validatedData;
}
