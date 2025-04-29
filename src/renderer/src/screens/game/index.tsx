import { useState } from 'react';
import Sidebar from './sidebar';
import PlayerStats from './player-stats';
import Inventory from './inventory';
import ActivityArea from './activity-area';
import GameLogs from './game-logs';
import type { Activity } from '@renderer/@types/game';

export default function Game() {
    const [currentActivity, setCurrentActivity] = useState<Activity>('mining');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <main className='h-screen bg-gray-900 text-white overflow-hidden'>
            <div className='flex flex-col h-full'>
                {/* Barra superior com estatísticas do jogador */}
                <PlayerStats />

                <div className='flex flex-1 overflow-hidden'>
                    {/* Barra lateral com navegação */}
                    <Sidebar currentActivity={currentActivity} onActivityChange={setCurrentActivity} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                    {/* Área principal de conteúdo */}
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <div className='flex flex-1 overflow-hidden'>
                            {/* Área da atividade atual */}
                            <ActivityArea currentActivity={currentActivity} />

                            {/* Inventário */}
                            {currentActivity !== 'inventory' && <Inventory />}
                        </div>

                        {/* Logs do jogo */}
                        <GameLogs />
                    </div>
                </div>
            </div>
        </main>
    );
}
