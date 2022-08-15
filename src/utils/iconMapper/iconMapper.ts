import {getEtroJobList} from '../../handler/etroHandler/etroHandler';

export const getJobIconUrl = async (
    jobAbbrev: string
): Promise<string | null> => {
    const jobs = await getEtroJobList();
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
