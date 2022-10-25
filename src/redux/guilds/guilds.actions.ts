import axios from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { Guild } from '../../types/guild';
import { buildUrl } from '../../utils/buildUrl';
import { GetGuildResponse, GetGuildsResponse } from './guilds.types';

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
    async (): Promise<GetGuildsResponse> => {
        return axios.get<Guild[]>(buildUrl('guilds')).then((response) => {
            if (response.status !== 200) {
                return {success: false, data: response.data};
            } else {
                return {success: false};
            }
        });
    }
);

export const addGuild = createAsyncThunk(
    'guild/add',
    async (discord_guild_id, moderator_role): Promise<GetGuildResponse> => {
        return axios
            .get<Guild>(
                buildUrl('addguild', {discord_guild_id, moderator_role})
            )
            .then((response) => {
                if (response.status !== 200) {
                    return {success: false, data: response.data};
                } else {
                    return {success: false};
                }
            });
    }
);

export const updateGuild = createAsyncThunk(
    'guild/update',
    async (guild_id, params): Promise<GetGuildResponse> => {
        return axios
            .get<Guild>(buildUrl('editguild', {guild_id, ...params}))
            .then((response) => {
                if (response.status !== 200) {
                    return {success: false, data: response.data};
                } else {
                    return {success: false};
                }
            });
    }
);
