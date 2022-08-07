import { SpaceType } from '../types';

export enum wordNumberMapping {
    'one' = 1,
    'two' = 2,
    'three' = 3,
    'four' = 4,
    'five' = 5,
    'six' = 6,
    'seven' = 7,
    'eight' = 8,
    'nine' = 9,
    'ten' = 10,
}

export enum numberSharingTypeMapping {
    'single' = 1,
    'double' = 2,
    'triple' = 3,
}

export function getFormattedSpaceType(spaceType: SpaceType) {
    if (spaceType === 'room') return spaceType;
    const [digit, type] = spaceType.split('_');
    return `${wordNumberMapping[digit as unknown as number]} ${type}`;
}

export function getFormattedShareType(index: number) {
    if (index + 1 < 4) return numberSharingTypeMapping[index];
    return wordNumberMapping[index];
}
