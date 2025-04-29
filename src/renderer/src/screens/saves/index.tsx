import { Settings, Sword, Store, Trophy, Users, ArrowBigLeft } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { useGeneral } from '../../contexts/general';

export default function Screen() {
    const { setScreen } = useGeneral();

    return (
        <div className='min-h-screen w-full bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-4 flex flex-col items-center justify-center'>
            <div className='absolute left-0 top-0'>
                <button onClick={() => setScreen('Menu')}>
                    <ArrowBigLeft className='h-10 w-10 stroke-purple-600' />
                </button>
            </div>
            <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
                <div className='p-4 bg-gray-700'>
                    <h1 className='text-3xl font-bold text-center text-yellow-400'>Idle Hero Quest</h1>
                </div>

                <div className='p-4'>
                    <div className='mb-4 flex justify-center'>
                        <img src='/placeholder.svg?height=150&width=150' alt='Hero Character' className='rounded-full border-4 border-yellow-400' width={150} height={150} />
                    </div>

                    <div className='grid grid-cols-2 gap-2 mb-4'>
                        <div className='text-center'>
                            <p className='text-gray-400'>Level</p>
                            <p className='text-xl font-bold'>25</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-gray-400'>Gold</p>
                            <p className='text-xl font-bold'>1,234,567</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-gray-400'>Power</p>
                            <p className='text-xl font-bold'>9,876</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-gray-400'>Prestige</p>
                            <p className='text-xl font-bold'>3</p>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Button className='w-full bg-red-600 hover:bg-red-700' size='lg'>
                            <Sword className='mr-2 h-4 w-4' /> Battle
                        </Button>
                        <Button className='w-full bg-green-600 hover:bg-green-700' size='lg'>
                            <Store className='mr-2 h-4 w-4' /> Shop
                        </Button>
                        <Button className='w-full bg-blue-600 hover:bg-blue-700' size='lg'>
                            <Trophy className='mr-2 h-4 w-4' /> Achievements
                        </Button>
                        <Button className='w-full bg-yellow-600 hover:bg-yellow-700' size='lg'>
                            <Users className='mr-2 h-4 w-4' /> Multiplayer
                        </Button>
                    </div>
                </div>

                <div className='p-4 bg-gray-700 flex justify-end'>
                    <Button variant='ghost' size='icon'>
                        <Settings className='h-6 w-6' />
                        <span className='sr-only'>Settings</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
