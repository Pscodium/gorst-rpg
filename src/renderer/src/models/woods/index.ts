import { Wood } from '@renderer/@types/game';
import woods from '@renderer/data/woods.json';
import { WoodRepository } from './repository';

export default class WoodModel {
    findAll(): Wood[] {
        return woods.data.map((item: Wood) => new WoodRepository(item));
    }

    findItemById(id: string): Wood | undefined {
        return woods.data.find((item: Wood) => item.id === id);
    }
}
