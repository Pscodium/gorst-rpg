import { RootState } from '@renderer/store';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef } from 'react';
import { moveItemToSlot, sellItem, removeItem, removeInventoryItem } from '@renderer/store/reducers/gameSlice';

export default function Inventory() {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.game);
    const { inventory, inventorySlots } = state.game;

    // Estado para gerenciar o item selecionado
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

    // Estado para o modal de quantidade
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [sellQuantity, setSellQuantity] = useState(1);
    const [currentItemId, setCurrentItemId] = useState<string | null>(null);
    const [currentAction, setCurrentAction] = useState<'sell' | 'remove' | null>(null);

    // Referências para drag and drop
    const dragItemId = useRef<string | null>(null);
    const dragSourceSlot = useRef<number | null>(null);
    const dragOverSlot = useRef<number | null>(null);

    // Função para obter o item em um determinado slot
    const getItemInSlot = (slotIndex: number) => {
        const slot = inventorySlots[slotIndex];
        if (!slot || slot.itemId === null) return null;

        return inventory.find((item) => item.id === slot.itemId) || null;
    };

    // Função para obter a quantidade máxima do item selecionado
    const getMaxQuantity = (itemId: string) => {
        const item = inventory.find((item) => item.id === itemId);
        return item ? item.quantity : 1;
    };

    // Função para iniciar o arrastar
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string, slotIndex: number) => {
        dragItemId.current = itemId;
        dragSourceSlot.current = slotIndex;
        e.currentTarget.classList.add('opacity-50');

        // Definir os dados que estão sendo arrastados
        e.dataTransfer.setData('text/plain', itemId);
        e.dataTransfer.effectAllowed = 'move';
    };

    // Função para quando terminar o arrastar
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50');

        if (dragItemId.current && dragSourceSlot.current !== null && dragOverSlot.current !== null) {
            if (dragSourceSlot.current !== dragOverSlot.current) {
                dispatch(
                    moveItemToSlot({
                        itemId: dragItemId.current,
                        fromSlot: dragSourceSlot.current,
                        toSlot: dragOverSlot.current,
                    })
                );
            }
        }

        // Limpar as referências
        dragItemId.current = null;
        dragSourceSlot.current = null;
        dragOverSlot.current = null;
    };

    // Função para quando estiver arrastando sobre outro item
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // Função para quando entrar em uma área de drop
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
        dragOverSlot.current = slotIndex;
        e.currentTarget.classList.add('bg-gray-500');
        e.preventDefault();
    };

    // Função para quando sair de uma área de drop
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-gray-500');
    };

    // Função para quando soltar o item
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-gray-500');

        // O manipulador dragEnd fará o resto do trabalho
        dragOverSlot.current = slotIndex;
    };

    // Funções para o menu de contexto
    const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
        e.preventDefault();
        setSelectedItem(itemId);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleItemClick = (itemId: string) => {
        setSelectedItem(selectedItem === itemId ? null : itemId);
        setContextMenuPosition(null);
    };

    // Função para abrir o modal de quantidade
    const openQuantityModal = (itemId: string, action: 'sell' | 'remove') => {
        setCurrentItemId(itemId);
        setCurrentAction(action);
        setSellQuantity(1); // Resetar para 1
        setShowQuantityModal(true);
        setContextMenuPosition(null); // Fechar menu de contexto se estiver aberto
    };

    // Função para processar a ação com a quantidade selecionada
    const handleQuantityAction = () => {
        if (!currentItemId || !currentAction) return;
        if (currentAction === 'sell') {
            // Calcular valor de venda (valor básico de exemplo - 5 de ouro por item)
            const sellValue = sellQuantity * (inventory.find((item) => item.id === currentItemId)?.price || 5);

            // Vender parte dos itens
            if (sellQuantity < getMaxQuantity(currentItemId)) {
                // Remover apenas parte da quantidade
                dispatch(
                    removeInventoryItem({
                        itemId: currentItemId,
                        quantity: sellQuantity,
                    })
                );

                // Adicionar ouro ao jogador (esta parte você precisará implementar no gameSlice)
                // Por enquanto, podemos usar esta ação temporária:
                dispatch({
                    type: 'game/addGold',
                    payload: sellValue,
                });
            } else {
                // Vender o item inteiro
                dispatch(sellItem({ itemId: currentItemId }));
            }
        } else if (currentAction === 'remove') {
            if (sellQuantity < getMaxQuantity(currentItemId)) {
                // Remover apenas parte da quantidade
                dispatch(
                    removeInventoryItem({
                        itemId: currentItemId,
                        quantity: sellQuantity,
                    })
                );
            } else {
                // Remover o item inteiro
                dispatch(removeItem({ itemId: currentItemId }));
            }
        }

        // Fechar o modal e limpar os estados
        setShowQuantityModal(false);
        setCurrentItemId(null);
        setCurrentAction(null);
        setSelectedItem(null);
    };

    const handleActionClick = (action: string) => {
        if (!selectedItem) return;

        switch (action) {
            case 'sell':
                openQuantityModal(selectedItem, 'sell');
                break;
            case 'use':
                // Implementar lógica de uso do item aqui
                console.log('Usando item:', selectedItem);
                setSelectedItem(null);
                break;
            case 'remove':
                openQuantityModal(selectedItem, 'remove');
                break;
        }
    };

    // Fechar o menu de contexto ao clicar fora dele
    const handleCloseContextMenu = () => {
        setContextMenuPosition(null);
    };

    return (
        <div className='w-full p-4' onClick={handleCloseContextMenu}>
            <h2 className='text-xl font-bold mb-4 text-center'>Inventário</h2>

            <div className='bg-gray-800 rounded-lg p-4 shadow-lg max-w-3xl mx-auto'>
                <div className='grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 justify-center'>
                    {inventorySlots.map((slot, index) => {
                        const item = getItemInSlot(index);

                        return item ? (
                            // Slot com item
                            <div
                                key={slot.id}
                                className={`bg-gray-700 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition-all duration-200 w-20 h-20 relative ${selectedItem === item.id ? 'ring-2 ring-yellow-400' : ''}`}
                                title={`${item.name} (${item.quantity})`}
                                onClick={() => handleItemClick(item.id)}
                                onContextMenu={(e) => handleContextMenu(e, item.id)}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item.id, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                data-slot-index={index}
                                data-item-id={item.id}
                            >
                                <div className='flex flex-col items-center'>
                                    <img src={item.icon} alt={item.name} className='h-8 w-8 mb-1' />
                                    <div className='text-xs font-semibold text-white'>{item.name}</div>
                                    <div className='absolute bottom-1 right-2 bg-gray-900 rounded-full px-2 py-0.5 text-xs font-bold'>{item.quantity}</div>
                                </div>
                            </div>
                        ) : (
                            // Slot vazio
                            <div
                                key={slot.id}
                                className='bg-gray-700 bg-opacity-30 rounded-md p-4 flex items-center justify-center w-20 h-20'
                                onDragOver={handleDragOver}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                data-slot-index={index}
                            >
                                <div className='text-xs text-gray-500'>Vazio</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Menu de ações para item selecionado */}
            {selectedItem && !contextMenuPosition && !showQuantityModal && (
                <div className='fixed bottom-4 right-4 bg-gray-800 rounded-lg shadow-lg p-2 z-10'>
                    <div className='flex space-x-2'>
                        <button onClick={() => handleActionClick('sell')} className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors'>
                            Vender
                        </button>
                        <button onClick={() => handleActionClick('use')} className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors'>
                            Usar
                        </button>
                        <button onClick={() => handleActionClick('remove')} className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors'>
                            Remover
                        </button>
                    </div>
                </div>
            )}

            {/* Menu de contexto */}
            {contextMenuPosition && (
                <div
                    className='fixed bg-gray-800 rounded-lg shadow-lg p-2 z-10'
                    style={{
                        left: contextMenuPosition.x,
                        top: contextMenuPosition.y,
                    }}
                >
                    <div className='flex flex-col'>
                        <button onClick={() => handleActionClick('sell')} className='text-white hover:bg-gray-700 px-4 py-2 text-sm text-left rounded-md transition-colors'>
                            Vender
                        </button>
                        <button onClick={() => handleActionClick('use')} className='text-white hover:bg-gray-700 px-4 py-2 text-sm text-left rounded-md transition-colors'>
                            Usar
                        </button>
                        <button onClick={() => handleActionClick('remove')} className='text-white hover:bg-gray-700 px-4 py-2 text-sm text-left rounded-md transition-colors'>
                            Remover
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de seleção de quantidade */}
            {showQuantityModal && currentItemId && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20'>
                    <div className='bg-gray-800 rounded-lg p-6 max-w-sm w-full'>
                        <h3 className='text-lg font-bold mb-4'>{currentAction === 'sell' ? 'Vender Item' : 'Remover Item'}</h3>

                        {/* Informações do item */}
                        {currentItemId && (
                            <div className='flex items-center mb-4'>
                                {inventory.find((item) => item.id === currentItemId) && (
                                    <>
                                        <img src={inventory.find((item) => item.id === currentItemId)?.icon} alt='Item' className='w-10 h-10 mr-3' />
                                        <div>
                                            <p className='font-semibold'>{inventory.find((item) => item.id === currentItemId)?.name}</p>
                                            <p className='text-sm text-gray-400'>Quantidade disponível: {getMaxQuantity(currentItemId)}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Seleção de quantidade */}
                        <div className='mb-4'>
                            <label className='block text-sm font-medium mb-2'>Quantidade:</label>
                            <div className='flex items-center'>
                                <button onClick={() => setSellQuantity((prev) => Math.max(1, prev - 1))} className='bg-gray-700 px-3 py-1 rounded-l-md'>
                                    -
                                </button>
                                <input
                                    type='number'
                                    value={sellQuantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= getMaxQuantity(currentItemId)) {
                                            setSellQuantity(value);
                                        }
                                    }}
                                    className='bg-gray-700 text-center w-16 py-1 focus:outline-none'
                                    min='1'
                                    max={getMaxQuantity(currentItemId)}
                                />
                                <button onClick={() => setSellQuantity((prev) => Math.min(getMaxQuantity(currentItemId), prev + 1))} className='bg-gray-700 px-3 py-1 rounded-r-md'>
                                    +
                                </button>
                                <button onClick={() => setSellQuantity(getMaxQuantity(currentItemId))} className='ml-2 bg-gray-600 px-3 py-1 rounded-md text-sm'>
                                    Máx
                                </button>
                            </div>

                            {/* Mostrar valor de venda se for uma ação de venda */}
                            {currentAction === 'sell' && (
                                <p className='mt-2 text-sm text-green-400'>Valor de venda: {sellQuantity * (inventory.find((item) => item.id === currentItemId)?.price || 5)} ouro</p>
                            )}
                        </div>

                        {/* Botões de ação */}
                        <div className='flex justify-end space-x-2'>
                            <button onClick={() => setShowQuantityModal(false)} className='bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md'>
                                Cancelar
                            </button>
                            <button onClick={handleQuantityAction} className={`${currentAction === 'sell' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} px-4 py-2 rounded-md`}>
                                {currentAction === 'sell' ? 'Vender' : 'Remover'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
