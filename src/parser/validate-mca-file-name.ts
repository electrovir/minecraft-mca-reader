import {safeMatch} from '@augment-vir/common';

export const fileNameValidationMessages = {
    missingExtension(fileName: string) {
        return `Cannot parse non-MCA file "${fileName}"`;
    },
    missingPrefix(fileName: string) {
        return `Unexpected file name "${fileName}": did not start with "r."`;
    },
    coordsExtractFailure(fileName: string) {
        return `Failed to extract region coords from file name "${fileName}"`;
    },
    invalidCoordsLength(fileName: string, coordsLength: number) {
        return `Expected 2 coords from file name "${fileName}" but got "${coordsLength}"`;
    },
    invalidCoord(fileName: string, coord: string) {
        return `Extracted an invalid coord "${coord}" from file name "${fileName}"`;
    },
} as const;

export function validateFile(file: Readonly<Pick<File, 'name'>>) {
    if (!file.name.endsWith('.mca')) {
        throw new Error(fileNameValidationMessages.missingExtension(file.name));
    }
    if (!file.name.startsWith('r.')) {
        throw new Error(fileNameValidationMessages.missingPrefix(file.name));
    }
    const [
        ,
        ...extractedCoords
    ] = safeMatch(file.name, /r\.([\d-]+)\.([\d-]+)\.mca/);
    if (!extractedCoords.length) {
        throw new Error(fileNameValidationMessages.coordsExtractFailure(file.name));
    }

    const coordNumbers = extractedCoords.map((extracted) => Number(extracted));
    if (coordNumbers.length !== 2) {
        throw new Error(
            fileNameValidationMessages.invalidCoordsLength(file.name, coordNumbers.length),
        );
    }

    coordNumbers.forEach((coordNumber, index) => {
        if (isNaN(coordNumber)) {
            throw new Error(
                fileNameValidationMessages.invalidCoord(file.name, extractedCoords[index]!),
            );
        }
    });
}

export function validateFiles(files: ReadonlyArray<Readonly<File>>) {
    files.forEach((file) => validateFile);
}
