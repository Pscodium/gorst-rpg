export type Activity = 'mining' | 'woodcutting' | 'fishing' | 'cooking' | 'combat' | 'health' | 'inventory' | 'shop' | 'quests' | 'settings';

export interface Player {
    name: string;
    level: {
        current: Level;
        next: Level;
    };
    gold: number;
    live: boolean;
    inventory_size: number;
    health: {
        current: number;
        max: number;
    };
    experience: number;
}

export interface Item {
    id: string;
    name: string;
    quantity: number;
    color?: string;
    icon: string;
}

export interface Ore {
    id: string;
    name: string;
    level: number;
    xp: number;
    time: number;
    inventoryItemId: string;
    color: string;
}

export interface Wood {
    id: string;
    name: string;
    level: number;
    xp: number;
    time: number;
    quantity: number;
    inventoryItemId: string;
}

export interface Level {
    level: number;
    id: string;
    name: string;
    experience_to_reach: number;
}

export interface Game {
    player: Player;
    inventory: Item[];
    ores: Ore[];
    woods: Wood[];
    levels: Level[];
}

export interface GameState {
    game: Game;
}
