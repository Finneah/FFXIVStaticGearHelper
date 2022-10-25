import { SlotNames } from '../types';

export const linkIsValid = (link: string | number | true): boolean => {
    if (typeof link === 'string') {
        const regex = /^https:\/\/etro.gg\/gearset\/.+$/gm;
        return regex.exec(link) !== null ?? false;
    }
    return false;
};

export const getEquipmentTypeByString = (
    enumValue: string
): SlotNames | undefined => {
    const value: SlotNames | undefined = Object.values(SlotNames).find(
        (value) => value === enumValue
    );
    return value;
};
