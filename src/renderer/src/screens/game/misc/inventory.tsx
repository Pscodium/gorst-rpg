import { RootState } from '@renderer/store';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef } from 'react';

// Suponha que estas ações existam no seu store
const moveItem = (fromIndex: number, toIndex: number) => ({
    type: 'game/moveItem',
    payload: { fromIndex, toIndex },
});

const sellItem = (itemId: string) => ({
    type: 'game/sellItem',
    payload: { itemId },
});

const removeItem = (itemId: string) => ({
    type: 'game/removeItem',
    payload: { itemId },
});

export default function Inventory() {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.game);
    const items = state.game.inventory;
    const inventorySize = state.game.player.inventory_size;

    // Estado para gerenciar o item selecionado
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

    // Referências para drag and drop
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // Função para iniciar o arrastar
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
        e.currentTarget.classList.add('opacity-50');
    };

    // Função para quando terminar o arrastar
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50');
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            dispatch(moveItem(dragItem.current, dragOverItem.current));
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    // Função para quando estiver arrastando sobre outro item
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // Função para quando entrar em uma área de drop
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragOverItem.current = index;
        e.currentTarget.classList.add('bg-gray-500');
    };

    // Função para quando sair de uma área de drop
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-gray-500');
    };

    // Função para quando soltar o item
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-gray-500');
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

    const handleActionClick = (action: string) => {
        if (!selectedItem) return;

        switch (action) {
            case 'sell':
                dispatch(sellItem(selectedItem));
                break;
            case 'remove':
                dispatch(removeItem(selectedItem));
                break;
            // Adicione mais ações conforme necessário
        }

        setSelectedItem(null);
        setContextMenuPosition(null);
    };

    // Fechar o menu de contexto ao clicar fora dele
    const handleCloseContextMenu = () => {
        setContextMenuPosition(null);
    };

    return (
        <div className='w-full p-4' onClick={handleCloseContextMenu}>
            <h2 className='text-xl font-bold mb-4 text-center'>Inventário</h2>

            <div className='bg-gray-800 rounded-lg p-4 shadow-lg max-w-3xl mx-auto'>
                <div className='flex flex-wrap gap-2 justify-center'>
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className={`bg-gray-700 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition-all duration-200 w-20 h-20 relative ${selectedItem === item.id ? 'ring-2 ring-yellow-400' : ''}`}
                            title={`${item.name} (${item.quantity})`}
                            onClick={() => handleItemClick(item.id)}
                            onContextMenu={(e) => handleContextMenu(e, item.id)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className='flex flex-col items-center'>
                                <img src={item.icon} alt={item.name} className='h-8 w-8 mb-1' />
                                <div className='text-xs font-semibold text-white'>{item.name}</div>
                                <div className='absolute bottom-1 right-2 bg-gray-900 rounded-full px-2 py-0.5 text-xs font-bold'>{item.quantity}</div>
                            </div>
                        </div>
                    ))}

                    {/* Slots vazios */}
                    {Array.from({ length: Math.max(0, inventorySize - items.length) }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className='bg-gray-700 bg-opacity-30 rounded-md p-4 flex items-center justify-center w-20 h-20'
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, items.length + i)}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className='text-xs text-gray-500'>Vazio</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu de ações para item selecionado */}
            {selectedItem && !contextMenuPosition && (
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
        </div>
    );
}
