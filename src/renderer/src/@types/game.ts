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
    price: number;
    color?: string;
    icon: string;
    slot?: number; // Slot onde o item está posicionado no inventário
}

export interface InventorySlot {
    id: string; // ID único do slot
    index: number; // Índice do slot (0-31)
    itemId: string | null; // ID do item no slot, ou null se vazio
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
    inventorySlots: InventorySlot[]; // Array de slots de inventário
    ores: Ore[];
    woods: Wood[];
    levels: Level[];
}

export interface GameState {
    game: Game;
}
