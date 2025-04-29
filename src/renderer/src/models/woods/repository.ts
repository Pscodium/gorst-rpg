import { Wood } from '@renderer/@types/game';

export class WoodRepository implements Wood {
    id: string;
    name: string;
    level: number;
    xp: number;
    time: number;
    quantity: number;
    inventoryItemId: string;

    constructor(wood: Wood) {
        this.id = wood.id;
        this.name = wood.name;
        this.level = wood.level;
        this.xp = wood.xp;
        this.time = wood.time;
        this.quantity = wood.quantity;
        this.inventoryItemId = wood.inventoryItemId;
    }
}
