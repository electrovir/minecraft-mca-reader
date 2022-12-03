import {MinecraftWorld} from '../data/minecraft-world';

export type McaParserOutput = Omit<MinecraftWorld, 'name'>;
export type McaParser = {
    blockParser: (file: File) => Promise<McaParserOutput> | McaParserOutput;
    blockCounter: (file: File) => Promise<number> | number;
};
