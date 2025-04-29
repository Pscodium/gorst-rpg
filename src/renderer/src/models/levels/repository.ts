import { Level } from '@renderer/@types/game';

export class LevelRepository implements Level {
    id: string;
    level: number;
    experience_to_reach: number;
    name: string;

    constructor(level: Level) {
        this.id = level.id;
        this.level = level.level;
        this.name = level.name;
        this.experience_to_reach = level.experience_to_reach;
    }
}
