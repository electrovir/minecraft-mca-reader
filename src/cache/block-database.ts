import Dexie, {Table} from 'dexie';
import {MinecraftBlockName} from '../data/minecraft-block-name';
import {MinecraftWorld} from '../data/minecraft-world';

export class VirMCMapperDatabaseClass extends Dexie {
    public minecraftWorlds!: Table<MinecraftWorld, string>;
    public minecraftBlockNames!: Table<MinecraftBlockName, 'blocks'>;

    public constructor() {
        super('VirMCMapperDatabase');
        this.version(1).stores({
            /** & designates the unique key: https://dexie.org/docs/Version/Version.stores() */
            minecraftWorlds: '&name, &blocks.x, &blocks.y, &blocks.z',
            minecraftBlockNames: '++index, &blockName',
        });
    }
}

export const virMCMapperDatabase = new VirMCMapperDatabaseClass();
