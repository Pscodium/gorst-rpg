import { Item } from '@renderer/@types/game';

export class ItemRepository implements Item {
    color?: string | undefined;
    icon: string;
    id: string;
    name: string;
    quantity: number;

    constructor(item: Item) {
        this.color = item.color;
        this.icon = item.icon;
        this.id = item.id;
        this.name = item.name;
        this.quantity = item.quantity;
    }
}
