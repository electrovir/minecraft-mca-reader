import {createDeferredPromiseWrapper} from '@augment-vir/common';

export type ReadAsKeys = Extract<keyof FileReader, `readAs${string}`>;

export async function readFile(
    file: Readonly<File>,
    readType: 'readAsArrayBuffer',
): Promise<ArrayBuffer>;
export async function readFile(
    file: Readonly<File>,
    readType: 'readAsBinaryString' | 'readAsDataURL' | 'readAsText',
): Promise<string>;
export async function readFile(
    file: Readonly<File>,
    readType: ReadAsKeys,
): Promise<string | ArrayBuffer>;
export async function readFile(
    file: Readonly<File>,
    readType: ReadAsKeys,
): Promise<string | ArrayBuffer> {
    const returnPromise = createDeferredPromiseWrapper<string | ArrayBuffer>();

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        if (fileReader.result) {
            returnPromise.resolve(fileReader.result);
        } else {
            returnPromise.reject(
                `FileReader result did not populate for "${readType}" on "${file.name}"`,
            );
        }
    };
    fileReader.onerror = () => {
        returnPromise.reject(`FileReader "${readType}" failed on "${file.name}"`);
    };
    fileReader.onabort = () => {
        returnPromise.reject(`FileReader "${readType}" was aborted on "${file.name}"`);
    };

    (fileReader[readType] as any)(file);
    return returnPromise.promise;
}
