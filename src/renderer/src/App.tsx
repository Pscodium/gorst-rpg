import Menu from './screens/menu';
import Game from './screens/game';
import Saves from './screens/saves';
import { useGeneral } from './contexts/general';

export default function App() {
    const { screen } = useGeneral();

    return (
        <div className='flex w-full h-screen'>
            {screen === 'Menu' && <Menu />}
            {screen === 'Game' && <Game />}
            {screen === 'Saves' && <Saves />}
        </div>
    );
}
