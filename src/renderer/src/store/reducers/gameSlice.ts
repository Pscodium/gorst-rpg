import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, InventorySlot } from '@renderer/@types/game';
import ItemModel from '../../models/items';
import OreModel from '../../models/ores';
import WoodModel from '../../models/woods';
import LevelModel from '../../models/levels';
import { v4 as uuidv4 } from 'uuid';

const itemModel = new ItemModel();
const levelModel = new LevelModel();
const levels = levelModel.findAll();

const ores = new OreModel().findAll();
const woods = new WoodModel().findAll();

// Cria 32 slots vazios para o inventário
const createEmptyInventorySlots = (size: number): InventorySlot[] => {
    return Array.from({ length: size }, (_, index) => ({
        id: uuidv4(),
        index,
        itemId: null,
    }));
};

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
        inventorySlots: createEmptyInventorySlots(32),
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
        // Nova ação para adicionar ouro ao jogador
        addGold: (state, action: PayloadAction<number>) => {
            state.game.player.gold += action.payload;
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
        addInventoryItem: (state, action: PayloadAction<{ itemId: string; quantity: number; experience?: number; slot?: number }>) => {
            const item = itemModel.findItemById(action.payload.itemId);

            if (!item) return;

            // Atualizar experiência do jogador se fornecida
            if (action.payload.experience) {
                const experienceSum = state.game.player.experience + action.payload.experience;
                if (experienceSum >= state.game.player.level.next.experience_to_reach) {
                    const nextLevel = levelModel.findNextLevel(state.game.player.level.current.level);
                    state.game.player.level.current = nextLevel;
                    state.game.player.level.next = levelModel.findNextLevel(nextLevel.level);
                }
                state.game.player.experience += action.payload.experience;
            }

            // Verificar se o item já existe no inventário
            const existingItemIndex = state.game.inventory.findIndex((i) => i.id === item.id);

            if (existingItemIndex === -1) {
                // Item não existe, adicionar ao inventário
                const newItem = { ...item, quantity: action.payload.quantity };
                state.game.inventory.push(newItem);

                // Se um slot específico foi fornecido, associar o item a esse slot
                if (action.payload.slot !== undefined) {
                    // Garantir que o slot está dentro dos limites
                    if (action.payload.slot >= 0 && action.payload.slot < state.game.player.inventory_size) {
                        // Desassociar qualquer item que esteja neste slot
                        const currentItemInSlot = state.game.inventorySlots[action.payload.slot].itemId;
                        if (currentItemInSlot) {
                            // Encontrar outros slots que possam estar usando este item e limpá-los
                            state.game.inventorySlots.forEach((slot) => {
                                if (slot.itemId === currentItemInSlot) {
                                    slot.itemId = null;
                                }
                            });
                        }

                        // Associar o novo item ao slot
                        state.game.inventorySlots[action.payload.slot].itemId = item.id;
                    }
                } else {
                    // Nenhum slot específico fornecido, encontrar o primeiro slot vazio
                    const firstEmptySlot = state.game.inventorySlots.findIndex((slot) => slot.itemId === null);
                    if (firstEmptySlot !== -1) {
                        state.game.inventorySlots[firstEmptySlot].itemId = item.id;
                    }
                }
            } else {
                // Item já existe, apenas aumentar a quantidade
                state.game.inventory[existingItemIndex].quantity += action.payload.quantity;
            }
        },
        removeInventoryItem: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
            const itemIndex = state.game.inventory.findIndex((item) => item.id === action.payload.itemId);

            if (itemIndex === -1) return;

            const item = state.game.inventory[itemIndex];

            // Se a quantidade a ser removida é maior ou igual à quantidade atual, remover o item completamente
            if (action.payload.quantity >= item.quantity) {
                // Limpar referências nos slots
                state.game.inventorySlots.forEach((slot) => {
                    if (slot.itemId === item.id) {
                        slot.itemId = null;
                    }
                });

                // Remover o item do inventário
                state.game.inventory.splice(itemIndex, 1);
            } else {
                // Caso contrário, apenas diminuir a quantidade
                state.game.inventory[itemIndex].quantity -= action.payload.quantity;
            }
        },
        // Ação para mover um item de um slot para outro
        moveItemToSlot: (state, action: PayloadAction<{ itemId: string; fromSlot: number; toSlot: number }>) => {
            const { itemId, fromSlot, toSlot } = action.payload;

            // Verificar se os slots estão dentro dos limites
            if (fromSlot < 0 || fromSlot >= state.game.player.inventory_size || toSlot < 0 || toSlot >= state.game.player.inventory_size) {
                return;
            }

            // Verificar se o item está no slot de origem
            if (state.game.inventorySlots[fromSlot].itemId !== itemId) {
                return;
            }

            // Verificar o que há no slot de destino
            const destinationItemId = state.game.inventorySlots[toSlot].itemId;

            if (destinationItemId === null) {
                // Destino vazio, simplesmente mover o item
                state.game.inventorySlots[toSlot].itemId = itemId;
                state.game.inventorySlots[fromSlot].itemId = null;
            } else if (destinationItemId === itemId) {
                // Mesmo item, não faz nada
                return;
            } else {
                // Trocar os itens de posição
                state.game.inventorySlots[toSlot].itemId = itemId;
                state.game.inventorySlots[fromSlot].itemId = destinationItemId;
            }
        },
        // Ação para vender um item (agora suporta venda parcial)
        sellItem: (state, action: PayloadAction<{ itemId: string; quantity?: number }>) => {
            const itemIndex = state.game.inventory.findIndex((item) => item.id === action.payload.itemId);

            if (itemIndex === -1) return;

            const item = state.game.inventory[itemIndex];
            const quantityToSell = action.payload.quantity || item.quantity;

            // Calcular valor de venda (valor básico de exemplo)
            const sellValue = quantityToSell * state.game.inventory[itemIndex].price;

            // Adicionar ouro ao jogador
            state.game.player.gold += sellValue;

            // Se estiver vendendo todo o item
            if (quantityToSell >= item.quantity) {
                // Limpar referências nos slots
                state.game.inventorySlots.forEach((slot) => {
                    if (slot.itemId === item.id) {
                        slot.itemId = null;
                    }
                });

                // Remover o item do inventário
                state.game.inventory.splice(itemIndex, 1);
            } else {
                // Caso contrário, apenas diminuir a quantidade
                state.game.inventory[itemIndex].quantity -= quantityToSell;
            }
        },
        // Ação para remover um item
        removeItem: (state, action: PayloadAction<{ itemId: string }>) => {
            const itemIndex = state.game.inventory.findIndex((item) => item.id === action.payload.itemId);

            if (itemIndex === -1) return;

            // Limpar referências nos slots
            state.game.inventorySlots.forEach((slot) => {
                if (slot.itemId === action.payload.itemId) {
                    slot.itemId = null;
                }
            });

            // Remover o item do inventário
            state.game.inventory.splice(itemIndex, 1);
        },
    },
});

export const { setPlayer, setPlayerGold, addGold, playerDamage, setPlayerLevel, addInventoryItem, removeInventoryItem, moveItemToSlot, sellItem, removeItem } = gameSlice.actions;

export default gameSlice.reducer;
