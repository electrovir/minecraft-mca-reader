/**
 * Transforms an array of values, then associates them to unique keys computed by a given function.
 *
 * @param values The array of values to associate to keys.
 * @param key Function for computing a key from a given value.
 * @param transform Function for transforming values before associating.
 */
export function associateBy<T, U, K>(
    values: T[],
    key: (value: T) => K,
    transform: (value: T) => U,
): Map<K, U> {
    const r = new Map();
    values.forEach((value) => {
        r.set(key(value), transform(value));
    });
    return r;
}
