import {MinecraftWorld} from '../data/minecraft-world';

export type McaParserOutput = Omit<MinecraftWorld, 'name'>;
export type McaParser = {
    blockParser: (file: Readonly<File>) => Promise<McaParserOutput> | McaParserOutput;
    blockCounter: (file: Readonly<File>) => Promise<number> | number;
};
