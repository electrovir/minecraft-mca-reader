import {itCases} from '@augment-vir/browser-testing';
import {fileNameValidationMessages, validateFile} from './validate-mca-file-name';

describe(validateFile.name, () => {
    itCases(validateFile, [
        {
            it: 'should work on a basic file name',
            input: {name: 'r.0.0.mca'},
            throws: undefined,
        },
        {
            it: 'should work on a file name a leading negative coord',
            input: {name: 'r.-1.0.mca'},
            throws: undefined,
        },
        {
            it: 'should work on a file name a trailing negative coord',
            input: {name: 'r.0.-1.mca'},
            throws: undefined,
        },
        {
            it: 'should work on a file name double negatives',
            input: {name: 'r.-1.-1.mca'},
            throws: undefined,
        },
        {
            it: 'should fail if missing mca extension',
            input: {name: 'r.0.0.ts'},
            throws: fileNameValidationMessages.missingExtension('r.0.0.ts'),
        },
        {
            it: 'should fail if missing r prefix',
            input: {name: '0.0.mca'},
            throws: fileNameValidationMessages.missingPrefix('0.0.mca'),
        },
        {
            it: 'should fail if non-numeric coords are included',
            input: {name: 'r.0.a.mca'},
            throws: fileNameValidationMessages.coordsExtractFailure('r.0.a.mca'),
        },
        {
            it: 'should fail if invalid numeric coord is included',
            input: {name: 'r.0.0-1.mca'},
            throws: fileNameValidationMessages.invalidCoord('r.0.0-1.mca', '0-1'),
        },
    ]);
});
