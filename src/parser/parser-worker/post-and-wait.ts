import {createDeferredPromiseWrapper} from '@augment-vir/common';
import {postTypedMessage} from './post-message';
import {AnyMessageData, getEventData, MessageDataTypeEnum} from './worker-messages';

const messageEventTypes = [
    'message',
    'messageerror',
    'error',
] as const;

export async function postAndWait<
    SendingMessageType extends AnyMessageData = AnyMessageData,
    ExpectedResponseType extends MessageDataTypeEnum = MessageDataTypeEnum,
>(
    context: typeof globalThis | Worker,
    message: SendingMessageType,
    expectedResponseType?: ExpectedResponseType,
): Promise<Extract<AnyMessageData, {type: ExpectedResponseType}>> {
    const deferredPromise = createDeferredPromiseWrapper<AnyMessageData>();

    function listener(event: any) {
        try {
            const data = getEventData(
                event instanceof MessageEvent ? event : event.data ?? event.detail ?? {data: event},
            );
            if (expectedResponseType && data.type !== expectedResponseType) {
                throw new Error(
                    `Expected response data type of "${expectedResponseType}" but got "${data.type}"`,
                );
            }

            deferredPromise.resolve(data);
        } catch (error) {
            deferredPromise.reject(error);
        }

        messageEventTypes.forEach((type) => {
            context.removeEventListener(type, listener);
        });
    }

    messageEventTypes.forEach((type) => {
        context.addEventListener(type, listener);
    });

    postTypedMessage(context, message);
    return deferredPromise.promise as any;
}
