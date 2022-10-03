import {createAsyncThunk} from '@reduxjs/toolkit';
import {dbAddGuild} from '../../api/database';
import {dbUpdateGuild} from '../../api/database/actions/guildConfig/updateGuildConfig';
import {dbGetAllGuilds} from '../../api/database/actions/guildConfig/getGuildConfig';
import {DBGuild} from '../../api/database/types/DBTypes';
import {SGHGuild} from './guilds.types';

// export const fetchGuild = createAsyncThunk(
//     'projectTasks/fetch/singleAction',
//     async (guild_id: string, thunkAPI): Promise<Guild | null> => {
//         // return http
//         // 	.get<GetTasksResponse>(buildUrl('Tasks/get-tasks', { buildingProjectId: projectId }))
//         // 	.then((response) => {
//         // 		return { projectId, tasks: response.data.tasks };
//         // 	});

//         return getGuildConfig(guild_id).then((response) => {
//             return {config: response ?? null};
//         });
//     }
// );

export const fetchGuilds = createAsyncThunk(
    'guilds/fetch',
    async (): Promise<DBGuild[] | null> => {
        const guilds = await dbGetAllGuilds();

        return guilds;
    }
);

export const addGuild = createAsyncThunk(
    'guild/add',
    async (guild: SGHGuild): Promise<SGHGuild> => {
        await dbAddGuild(guild);
        return guild;
    }
);

export const updateGuild = createAsyncThunk(
    'guild/update',
    async (guild: SGHGuild): Promise<SGHGuild> => {
        await dbUpdateGuild(guild);
        return guild;
    }
);
