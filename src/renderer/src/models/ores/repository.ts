import { Ore } from '@renderer/@types/game';

export class OreRepository implements Ore {
    id: string;
    color: string;
    inventoryItemId: string;
    level: number;
    name: string;
    time: number;
    xp: number;

    constructor(ore: Ore) {
        this.id = ore.id;
        this.color = ore.color;
        this.inventoryItemId = ore.inventoryItemId;
        this.level = ore.level;
        this.name = ore.name;
        this.time = ore.time;
        this.xp = ore.xp;
    }
}
