import {AnyMessage} from './worker-messages';

export function postTypedMessage(context: typeof globalThis | Worker, message: AnyMessage) {
    context.postMessage(message);
}
