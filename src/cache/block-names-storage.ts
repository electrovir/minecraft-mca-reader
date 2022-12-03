import {MinecraftBlockName, MinecraftBlockNameMapping} from '../data/minecraft-block-name';
import {virMCMapperDatabase} from './block-database';

export async function getSavedMinecraftBlockNames(): Promise<MinecraftBlockNameMapping> {
    const blockNames = await virMCMapperDatabase.minecraftBlockNames.toArray();

    return blockNameArrayToMapping(blockNames);
}

function blockNameArrayToMapping(blockNames: ReadonlyArray<MinecraftBlockName>) {
    const byIndex: MinecraftBlockNameMapping['byIndex'] = {};
    const byName: MinecraftBlockNameMapping['byName'] = {};

    blockNames.forEach((blockName) => {
        byIndex[blockName.index] = blockName.blockName;
        byName[blockName.blockName] = blockName.index;
    });

    return {
        byIndex,
        byName,
    };
}
