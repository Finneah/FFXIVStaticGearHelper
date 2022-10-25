import { GuildsSliceState } from '../guilds/guilds.types';
import { JobsSliceState } from '../jobs/jobs.types';

export type RootState = {
    guilds: GuildsSliceState;
    jobs: JobsSliceState;
};
