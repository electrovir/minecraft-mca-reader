import {parserWorkerPath} from './parser-worker-path';
import {AnyMessage} from './worker-messages';

export function setupWorker(
    workerName: string,
    receivedMessageCallback: (message: MessageEvent<AnyMessage>) => void,
) {
    const worker = new Worker(parserWorkerPath, {type: 'module', name: workerName});
    worker.onerror = (event) => {
        console.error(`${workerName} worker encountered an error: ${event}`);
    };
    worker.onmessageerror = (event) => {
        console.error(`${workerName} worker encountered a message error: ${event}`);
    };
    worker.onmessage = receivedMessageCallback;

    return worker;
}
