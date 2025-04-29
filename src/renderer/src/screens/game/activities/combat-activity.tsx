export default function CombatActivity() {
    const monsters = [
        { id: 1, name: 'Goblin', level: 5, hp: 50, maxHit: 3, xp: 25 },
        { id: 2, name: 'Lobo', level: 10, hp: 80, maxHit: 5, xp: 45 },
        { id: 3, name: 'Esqueleto', level: 20, hp: 120, maxHit: 8, xp: 85 },
        { id: 4, name: 'Ogro', level: 35, hp: 200, maxHit: 12, xp: 150 },
    ];

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {monsters.map((monster) => (
                    <div key={monster.id} className='bg-gray-800 p-4 rounded-lg hover:bg-gray-750 cursor-pointer'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <h3 className='font-medium'>{monster.name}</h3>
                                <p className='text-xs text-gray-400'>Nível {monster.level}</p>
                            </div>
                            <div className='text-right'>
                                <div className='text-sm'>HP: {monster.hp}</div>
                                <div className='text-xs text-gray-400'>XP: {monster.xp}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='bg-gray-800 p-6 rounded-lg'>
                <div className='text-center mb-4'>
                    <p className='text-gray-400'>Selecione um monstro para começar o combate</p>
                </div>
            </div>
        </div>
    );
}
