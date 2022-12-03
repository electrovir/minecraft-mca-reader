import {AnyMessageData} from './worker-messages';

export function postTypedMessage(context: typeof globalThis | Worker, message: AnyMessageData) {
    context.postMessage(message);
}
