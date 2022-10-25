import { createSlice } from '@reduxjs/toolkit';

import Logger from '../../logger';
import { baseSliceErrorReducer, baseSliceFulfilledSplice, baseSliceLoadingReducer } from '../base.reducers';
import { addGuild, fetchGuilds, updateGuild } from './guilds.actions';
import { guildsEntityAdapter } from './guilds.adapter';
import { GuildsEntity, GuildsSliceState } from './guilds.types';

const logger = Logger.child({module: 'guildsSlice'});

const initialState: GuildsSliceState = {
    ids: [],
    entities: {},
    loading: false,
    error: null
};

export const guildsSlice = createSlice({
    name: 'guilds',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // fetchGuilds
        builder.addCase(fetchGuilds.fulfilled, (state, action) => {
            const guilds = action.payload.data;
            const guildEntities: GuildsEntity[] = [];
            if (guilds) {
                guilds?.forEach((guild) => {
                    const guildEntity: GuildsEntity = {
                        id: guild.discord_guild_id,
                        data: guild
                    };
                    guildEntities.push(guildEntity);
                });
                guildsEntityAdapter.addMany(state, guildEntities);

                baseSliceFulfilledSplice(state);
            }
        });
        builder.addCase(fetchGuilds.pending, baseSliceLoadingReducer);
        builder.addCase(fetchGuilds.rejected, baseSliceErrorReducer);
        // addGuilds
        builder.addCase(addGuild.fulfilled, (state, action) => {
            const guild = action.payload.data;
            if (guild) {
                // TODO check if already added before add
                const guildEntity: GuildsEntity = {
                    id: guild.discord_guild_id,
                    data: guild
                };

                guildsEntityAdapter.addOne(state, guildEntity);

                baseSliceFulfilledSplice(state);
            }
        });
        builder.addCase(addGuild.pending, baseSliceLoadingReducer);
        builder.addCase(addGuild.rejected, baseSliceErrorReducer);
        // updateGuilds
        builder.addCase(updateGuild.fulfilled, (state, action) => {
            const guild = action.payload.data;
            if (guild) {
                const guildEntity = state.entities[guild.discord_guild_id];
                // TODO check if already added before add
                if (!guildEntity || !guildEntity.data) {
                    logger.error(
                        `Missing guild to update with id ${guild.discord_guild_id}`
                    );
                    return;
                }

                const {data} = guildEntity;

                guildsEntityAdapter.updateOne(state, {
                    id: guild.discord_guild_id,
                    changes: {
                        data
                    }
                });

                baseSliceFulfilledSplice(state);
            }
        });
        builder.addCase(updateGuild.pending, baseSliceLoadingReducer);
        builder.addCase(updateGuild.rejected, baseSliceErrorReducer);
    }
});
