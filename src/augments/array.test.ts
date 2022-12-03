import {itCases} from '@augment-vir/browser-testing';
import {completelyFlattenArray} from './array';

describe(completelyFlattenArray.name, () => {
    const alreadyFlatArray = [
        1,
        2,
        3,
        4,
        5,
        6,
    ];

    itCases(completelyFlattenArray, [
        {
            it: 'should not flatten a 1D array',
            input: alreadyFlatArray,
            expect: alreadyFlatArray,
        },
        {
            it: 'should work on a 2D array',
            input: [
                alreadyFlatArray,
                alreadyFlatArray,
            ],
            expect: [
                ...alreadyFlatArray,
                ...alreadyFlatArray,
            ],
        },
        {
            it: 'should work on a 3D array',
            input: [
                [
                    alreadyFlatArray,
                    alreadyFlatArray,
                    alreadyFlatArray,
                ],
                [
                    alreadyFlatArray,
                    alreadyFlatArray,
                ],
            ],
            expect: [
                ...alreadyFlatArray,
                ...alreadyFlatArray,
                ...alreadyFlatArray,
                ...alreadyFlatArray,
                ...alreadyFlatArray,
            ],
        },
    ]);
});
