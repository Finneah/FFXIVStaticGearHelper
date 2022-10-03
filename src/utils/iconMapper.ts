import {store} from '../redux/store';

export const getJobIconUrl = async (
    jobAbbrev: string
): Promise<string | null> => {
    const state = store.getState();
    const jobs = state.jobs.data;

    if (!jobs) {
        return null;
    }
    const url = 'https://xivapi.com/cj/1/';
    const job = jobs.find(
        (job: {abbrev: string; name: string}) => job.abbrev === jobAbbrev
    );

    if (job) {
        return (
            url + job.name.toString().replaceAll(' ', '').toLowerCase() + '.png'
        );
    }

    return null;
};

/**
 * @description tbd
 * @param slotName
 * @returns string
 */
export const getIconBySlotName = (slotName: string): string => {
    switch (slotName) {
        case 'weapon':
            return '🗡️';
        case 'offHand':
            return '🛡️';
        case 'head':
            return '🪖';
        case 'body':
            return '🥼';
        case 'hands':
            return '🧤';
        case 'legs':
            return '👖';
        case 'feet':
            return '👟';
        case 'ears':
            return '👂';
        case 'neck':
            return '🧣';
        case 'wrists':
            return '⌚';
        case 'finger':
        case 'finger_l':
        case 'finger_r':
            return '💍';

        default:
            return '❔';
    }
};
