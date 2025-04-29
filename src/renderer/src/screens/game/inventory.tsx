import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function Inventory() {
    const state = useSelector((state: RootState) => state.game);
    const items = state.game.inventory;
    const inventorySize = state.game.player.inventory_size;

    return (
        <div className='w-64 bg-gray-800 p-4 overflow-y-auto hidden lg:block'>
            <h3 className='font-bold mb-3 border-b border-gray-700 pb-2'>Inventário</h3>
            <div className='grid grid-cols-4 gap-2'>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className='bg-gray-700 rounded-md p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors'
                        title={`${item.name} (${item.quantity})`}
                    >
                        <img src={item.icon} className='text-sm h-5 w-5' />
                        <div className='text-xs mt-1'>{item.quantity}</div>
                    </div>
                ))}
                {/* Slots vazios */}
                {Array.from({ length: Math.max(0, inventorySize - items.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className='bg-gray-700 bg-opacity-30 rounded-md p-2 flex items-center justify-center'>
                        <div className='text-xs text-gray-500'>Vazio</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
