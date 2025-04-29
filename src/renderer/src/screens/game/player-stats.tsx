import { useSelector } from 'react-redux';
import { RootState } from '@renderer/store';

export default function PlayerStats() {
    const gameState = useSelector((state: RootState) => state.game);

    return (
        <div className='bg-gray-800 p-4 border-b border-gray-700 flex flex-wrap justify-between items-center'>
            <div className='flex items-center'>
                <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3'>
                    <span className='font-bold'>L</span>
                </div>
                <div>
                    <h2 className='font-bold'>Jogador</h2>
                    <div className='text-xs text-gray-400'>
                        Nível {gameState.game.player.level.current?.level} - {gameState.game.player.level.current?.name}
                    </div>
                </div>
            </div>

            <div className='flex space-x-4 mt-2 sm:mt-0'>
                <div className='text-center flex flex-col gap-[5px]'>
                    <div className='text-xs text-gray-400 w-[200px]'>Vida</div>
                    <div className='relative w-full bg-gray-700 rounded-full h-4 overflow-hidden'>
                        <div
                            className='bg-red-500 h-full transition-transform duration-100 ease-linear'
                            style={{ width: `${(gameState.game.player.health.current / gameState.game.player.health.max) * 100}%` }}
                        />
                        <p className='absolute top-0 left-1/2 text-[12px] transform -translate-x-1/2 text-center'>
                            {gameState.game.player.health.current}/{gameState.game.player.health.max}
                        </p>
                    </div>
                </div>

                <div className='text-center flex flex-col gap-[5px]'>
                    <div className='text-xs text-gray-400 w-[200px]'>Experiência</div>
                    <div className='relative w-full bg-gray-700 rounded-full h-4 overflow-hidden'>
                        <div
                            className='bg-blue-500 h-full transition-transform duration-100 ease-linear'
                            style={{
                                width: `${((gameState.game.player.experience - gameState.game.player.level.current.experience_to_reach) / (gameState.game.player.level.next.experience_to_reach - gameState.game.player.level.current.experience_to_reach)) * 100}%`,
                            }}
                        />
                        <p className='absolute top-0 left-1/2 text-[12px] transform -translate-x-1/2 text-center'>
                            {gameState.game.player.experience}/{gameState.game.player.level.next.experience_to_reach}
                        </p>
                    </div>
                </div>

                <div className='text-center'>
                    <div className='text-xs text-gray-400'>Ouro</div>
                    <div className='font-medium'>{gameState.game.player.gold}</div>
                </div>
            </div>
        </div>
    );
}
