import { ElectronAPI } from '@electron-toolkit/preload';
import { Play, Folder, Settings, LogOut } from 'lucide-react';
import { useGeneral } from '../../contexts/general';

interface ElectronWindow extends ElectronAPI {
    closeWindow?: () => void;
}

export default function Screen() {
    const _window: ElectronWindow = window.electron;
    const { setScreen } = useGeneral();

    return (
        <div
            className='min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center'
            style={{
                backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
            }}
        >
            <div className='absolute inset-0 bg-black bg-opacity-60'></div>

            <div className='relative z-10 text-center space-y-8'>
                <h1 className='text-6xl font-bold text-white mb-8 drop-shadow-lg select-none'>Gorst RPG</h1>

                <nav className='space-y-4'>
                    <button onClick={() => setScreen('Game')} className='w-64 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center'>
                        <Play className='mr-2' size={24} />
                        New Game
                    </button>
                    <button
                        onClick={() => setScreen('Saves')}
                        className='w-64 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center'
                    >
                        <Folder className='mr-2' size={24} />
                        Load Game
                    </button>
                    <button className='w-64 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center'>
                        <Settings className='mr-2' size={24} />
                        Settings
                    </button>
                    <button
                        onClick={() => _window.closeWindow && _window.closeWindow()}
                        className='w-64 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center'
                    >
                        <LogOut className='mr-2' size={24} />
                        Quit
                    </button>
                </nav>
            </div>

            <div className='absolute bottom-4 right-4 text-white text-sm opacity-60'>v1.0.0</div>
        </div>
    );
}
