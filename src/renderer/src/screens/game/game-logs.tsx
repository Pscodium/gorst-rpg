export default function GameLogs() {
    const logs = [
        { id: 1, message: 'Você encontrou um minério de cobre!', timestamp: '14:32' },
        { id: 2, message: 'Você ganhou 25 XP em Mineração!', timestamp: '14:31' },
        { id: 3, message: 'Você encontrou um minério de ferro!', timestamp: '14:30' },
        { id: 4, message: 'Você subiu para o nível 15 em Mineração!', timestamp: '14:28' },
    ];

    return (
        <div className='h-32 bg-gray-800 p-2 overflow-y-auto border-t border-gray-700'>
            <h3 className='font-bold text-sm mb-2'>Logs</h3>
            <div className='space-y-1'>
                {logs.map((log) => (
                    <div key={log.id} className='text-xs flex'>
                        <span className='text-gray-400 mr-2'>[{log.timestamp}]</span>
                        <span>{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
