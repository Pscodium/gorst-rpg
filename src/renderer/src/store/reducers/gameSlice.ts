import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '@renderer/@types/game';
import ItemModel from '../../models/items';
import OreModel from '../../models/ores';
import WoodModel from '../../models/woods';
import LevelModel from '../../models/levels';

const itemModel = new ItemModel();
const levelModel = new LevelModel();
const levels = levelModel.findAll();

const ores = new OreModel().findAll();
const woods = new WoodModel().findAll();

const initialState: GameState = {
    game: {
        player: {
            experience: 0,
            gold: 0,
            live: true,
            inventory_size: 32,
            health: {
                current: 1000,
                max: 1000,
            },
            level: {
                current: levelModel.findLevelByValue(1),
                next: levelModel.findNextLevel(1),
            },
            name: 'Pscodium',
        },
        inventory: [],
        ores,
        woods,
        levels,
    },
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setPlayer: (state, action) => {
            state.game = action.payload;
        },
        setPlayerGold: (state, action) => {
            state.game.player.gold = action.payload;
        },
        playerDamage: (state, action) => {
            const currentHealth = state.game.player.health.current;
            if (action.payload > currentHealth) {
                state.game.player.health.current = 0;
                state.game.player.live = false;
                return;
            }
            state.game.player.health.current -= action.payload;
        },
        setPlayerLevel: (state, action) => {
            state.game.player.level = action.payload;
        },
        addInventoryItem: (state, action: PayloadAction<{ itemId: string; quantity: number; experience?: number }>) => {
            const item = itemModel.findItemById(action.payload.itemId);
            if (action.payload.experience) {
                const experienceSum = state.game.player.experience + action.payload.experience;
                if (experienceSum >= state.game.player.level.next.experience_to_reach) {
                    const nextLevel = levelModel.findNextLevel(state.game.player.level.current.level);
                    state.game.player.level.current = nextLevel;
                    state.game.player.level.next = levelModel.findNextLevel(nextLevel.level);
                }
                state.game.player.experience += action.payload.experience;
            }
            if (item && !state.game.inventory.find((i) => i.id === item!.id)) {
                item.quantity = action.payload.quantity;
                state.game.inventory.push(item);
                return;
            }

            state.game.inventory.find((item) => item.id === action.payload.itemId)!.quantity += action.payload.quantity;
        },
        removeInventoryItem: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
            state.game.inventory.find((item) => item.id === action.payload.itemId)!.quantity -= action.payload.quantity;
        },
    },
});

export const { setPlayer, setPlayerGold, playerDamage, setPlayerLevel, addInventoryItem, removeInventoryItem } = gameSlice.actions;

export default gameSlice.reducer;
