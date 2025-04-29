'use client';
import type { Activity } from '@/renderer/src/@types/game';
import { Menu, X, Pickaxe, Axe, Fish, Flame, Sword, Heart, ShoppingBag, Scroll, Settings, Backpack } from 'lucide-react';

interface SidebarProps {
    currentActivity: Activity;
    onActivityChange: (activity: Activity) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ currentActivity, onActivityChange, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
    const activities = [
        { id: 'mining' as Activity, name: 'Mineração', icon: Pickaxe },
        { id: 'woodcutting' as Activity, name: 'Lenhador', icon: Axe },
        { id: 'fishing' as Activity, name: 'Pesca', icon: Fish },
        { id: 'cooking' as Activity, name: 'Culinária', icon: Flame },
        { id: 'combat' as Activity, name: 'Combate', icon: Sword },
        { id: 'health' as Activity, name: 'Saúde', icon: Heart },
        { id: 'inventory' as Activity, name: 'Inventário', icon: Backpack },
        { id: 'shop' as Activity, name: 'Loja', icon: ShoppingBag },
        { id: 'quests' as Activity, name: 'Missões', icon: Scroll },
        { id: 'settings' as Activity, name: 'Configurações', icon: Settings },
    ];

    return (
        <>
            {/* Botão de menu mobile */}
            <button className='fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-md' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        transition-transform duration-300 ease-in-out
        w-64 bg-gray-800 flex-shrink-0 overflow-y-auto
        fixed md:static top-0 left-0 h-full z-40
      `}
            >
                <div className='p-4 border-b border-gray-700'>
                    <h1 className='text-xl font-bold text-center'>Gorst RPG</h1>
                </div>

                <nav className='p-2'>
                    <ul className='space-y-1'>
                        {activities.map((activity) => (
                            <li key={activity.id}>
                                <button
                                    onClick={() => {
                                        onActivityChange(activity.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`
                    w-full flex items-center p-3 rounded-md transition-colors
                    ${currentActivity === activity.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                                >
                                    <activity.icon className='mr-3 h-5 w-5' />
                                    <span>{activity.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}
