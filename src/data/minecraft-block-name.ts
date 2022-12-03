export type MinecraftBlockName = {index: number; blockName: string};

export type MinecraftBlockNameMapping = {
    byIndex: Record<number, string>;
    byName: Record<string, number>;
};

export function getBlockNameIndexOrCreateAnIndex(
    currentMapping: MinecraftBlockNameMapping,
    blockName: string,
): number {
    throw new Error('implement this');
    return currentMapping.byName[blockName]!;
}
