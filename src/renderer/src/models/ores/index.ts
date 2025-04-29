import { Ore } from '@renderer/@types/game';
import ores from '@renderer/data/ores.json';
import { OreRepository } from './repository';

export default class OreModel {
    findAll(): Ore[] {
        return ores.data.map((item: Ore) => new OreRepository(item));
    }

    findItemById(id: string): Ore | undefined {
        return ores.data.find((item: Ore) => item.id === id);
    }
}
