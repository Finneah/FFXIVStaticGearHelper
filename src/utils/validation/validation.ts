export const linkIsValid = (link: string | number | true): boolean => {
    if (typeof link === 'string') {
        const regex = /^https:\/\/etro.gg\/gearset\/.+$/gm;
        return regex.exec(link) !== null ?? false;
    }
    return false;
};
