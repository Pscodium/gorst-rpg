import type { Activity } from '@renderer/@types/game';
import MiningActivity from './activities/mining-activity';
import CombatActivity from './activities/combat-activity';
import WoodcuttingActivity from './activities/woodcutting-activity';
import FishingActivity from './activities/fishing-activity';
import Inventory from './misc/inventory';

interface ActivityAreaProps {
    currentActivity: Activity;
}

export default function ActivityArea({ currentActivity }: ActivityAreaProps) {
    const renderActivity = () => {
        switch (currentActivity) {
            case 'mining':
                return <MiningActivity />;
            case 'combat':
                return <CombatActivity />;
            case 'woodcutting':
                return <WoodcuttingActivity />;
            case 'fishing':
                return <FishingActivity />;
            case 'inventory':
                return <Inventory />;
            default:
                return (
                    <div className='flex items-center justify-center h-full'>
                        <p className='text-gray-400'>Selecione uma atividade para começar</p>
                    </div>
                );
        }
    };

    return (
        <div className='flex-1 bg-gray-900 w-screen p-4 overflow-y-auto'>
            <h2 className='text-xl font-bold mb-4 capitalize'>{currentActivity}</h2>
            {renderActivity()}
        </div>
    );
}
