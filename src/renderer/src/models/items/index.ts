import { Item } from '@renderer/@types/game';
import items from '@renderer/data/items.json';
import { ItemRepository } from './repository';

export default class ItemModel {
    findAll(): Item[] {
        return items.data.map((item: Item) => new ItemRepository(item));
    }

    findItemById(id: string): Item | undefined {
        return items.data.find((item: Item) => item.id === id);
    }
}
