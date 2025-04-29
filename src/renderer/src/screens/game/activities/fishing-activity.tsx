export default function FishingActivity() {
    const fishingSpots = [
        { id: 1, name: 'Lago de Água Doce', level: 1, fish: ['Truta', 'Carpa'], xp: [20, 30] },
        { id: 2, name: 'Rio', level: 20, fish: ['Salmão', 'Pique'], xp: [50, 60] },
        { id: 3, name: 'Costa', level: 40, fish: ['Atum', 'Espada'], xp: [80, 100] },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {fishingSpots.map((spot) => (
                <div key={spot.id} className='bg-gray-800 p-4 rounded-lg hover:bg-gray-750 cursor-pointer'>
                    <h3 className='font-medium mb-2'>{spot.name}</h3>
                    <p className='text-xs text-gray-400 mb-2'>Nível necessário: {spot.level}</p>
                    <div className='space-y-1'>
                        {spot.fish.map((fish, index) => (
                            <div key={fish} className='flex justify-between text-sm'>
                                <span>{fish}</span>
                                <span>{spot.xp[index]} XP</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
