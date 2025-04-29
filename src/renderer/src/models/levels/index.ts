import { Level } from '@renderer/@types/game';
import levels from '@renderer/data/levels.json';
import { LevelRepository } from './repository';

export default class LevelModel {
    findAll(): Level[] {
        return levels.data.map((item: Level) => new LevelRepository(item));
    }

    findLevelById(id: string): Level | undefined {
        return levels.data.find((item: Level) => item.id === id);
    }

    findLevelByValue(level: number): Level {
        return levels.data.find((item: Level) => item.level === level) || levels.data[0];
    }

    findNextLevel(currentLevel: number): Level {
        return (
            levels.data.find((item: Level) => {
                if (item.level === currentLevel + 1) {
                    return item;
                }
                return undefined;
            }) || levels.data[0]
        );
    }
}
