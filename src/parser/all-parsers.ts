import {MinecraftVersion, minecraftVersions} from '../minecraft-versions';
import {McaParser} from './parser';
import {java_1_19_2} from './version-parsers/java-1-19-2/java-1-19-2';

type McaParserByVersion = Readonly<{
    [Version in MinecraftVersion]: McaParser;
}>;

const mcaParserByVersion: McaParserByVersion = {
    [minecraftVersions.java[1][19][3]]: java_1_19_2,
    [minecraftVersions.java[1][19][2]]: java_1_19_2,
};

export function getMcaParserByVersion(minecraftVersion: MinecraftVersion): McaParser {
    const parser = mcaParserByVersion[minecraftVersion];

    if (parser) {
        return parser;
    } else {
        throw new Error(`Failed to find MCA parser by Minecraft version "${minecraftVersion}"`);
    }
}
