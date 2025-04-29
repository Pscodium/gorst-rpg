'use client';

import { RootState } from '@renderer/store';
import { addInventoryItem } from '@renderer/store/reducers/gameSlice';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function MiningActivity() {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.game);
    const gameState = state.game;

    const [progress, setProgress] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const animationFrameRef = useRef<number>();
    const lastUpdateTimeRef = useRef<number>(0);
    const hasCompletedRef = useRef<boolean>(false);

    const ores = gameState.ores;
    const [selectedOre, setSelectedOre] = useState(ores[0]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isActive) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            return;
        }

        // Iniciar com progresso zerado
        setProgress(0);
        lastUpdateTimeRef.current = performance.now();
        hasCompletedRef.current = false;

        const updateProgress = (timestamp: number) => {
            const elapsed = timestamp - lastUpdateTimeRef.current;
            lastUpdateTimeRef.current = timestamp;

            const increment = (100 / (selectedOre.time * 1000)) * elapsed;

            setProgress((prev) => {
                const newProgress = prev + increment;

                // Se o progresso atingiu 100% e ainda não registramos a conclusão
                if (newProgress >= 100 && !hasCompletedRef.current) {
                    // Marcar que já concluímos este ciclo
                    hasCompletedRef.current = true;

                    // Adicionar o item ao inventário
                    dispatch(
                        addInventoryItem({
                            itemId: selectedOre.inventoryItemId,
                            quantity: 1,
                            experience: selectedOre.xp,
                        })
                    );

                    // Resetar o progresso após um pequeno delay para feedback visual
                    setTimeout(() => {
                        setProgress(0);
                        // Permitir um novo ciclo
                        hasCompletedRef.current = false;
                    }, 50);

                    // Manter a barra em 100% enquanto aguarda o reset
                    return 100;
                }

                // Se já concluímos e estamos aguardando o reset, manter em 100%
                if (hasCompletedRef.current) {
                    return 100;
                }

                // Caso contrário, atualizar normalmente
                return newProgress;
            });

            // Continuar animação
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        };

        // Iniciar animação
        animationFrameRef.current = requestAnimationFrame(updateProgress);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive, selectedOre, dispatch]);

    const toggleMining = () => {
        setIsActive(!isActive);
    };

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {ores.map((ore) => (
                    <div
                        key={ore.id}
                        className={`
                            p-4 rounded-lg cursor-pointer transition-all
                            ${selectedOre.id === ore.id ? 'ring-2 ring-blue-500 bg-gray-800' : 'bg-gray-800 hover:bg-gray-750'}
                        `}
                        onClick={() => {
                            setSelectedOre(ore);
                            setIsActive(false);
                            setProgress(0);
                            hasCompletedRef.current = false;
                        }}
                    >
                        <div className='flex items-center mb-2'>
                            <div className={`w-8 h-8 rounded-md ${ore.color} mr-3 flex items-center justify-center`}>⛏️</div>
                            <div>
                                <h3 className='font-medium'>{ore.name}</h3>
                                <p className='text-xs text-gray-400'>
                                    Nível {ore.level} • {ore.xp} XP
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='bg-gray-800 p-6 rounded-lg'>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        <h3 className='font-bold text-lg'>{selectedOre.name}</h3>
                        <p className='text-sm text-gray-400'>
                            Tempo: {selectedOre.time}s • XP: {selectedOre.xp}
                        </p>
                    </div>
                    <button
                        onClick={toggleMining}
                        className={`
                            px-4 py-2 rounded-md font-medium transition-colors
                            ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                        `}
                    >
                        {isActive ? 'Parar' : 'Minerar'}
                    </button>
                </div>

                <div className='w-full bg-gray-700 rounded-full h-4 overflow-hidden'>
                    <div className='bg-blue-500 h-full transition-transform duration-100 ease-linear' style={{ width: `${progress}%` }}></div>
                </div>

                <div className='mt-4 text-sm text-gray-300'>{isActive ? 'Minerando...' : 'Clique em Minerar para começar'}</div>
            </div>
        </div>
    );
}
