import { Static } from './gearset';

export type BaseGuild = {
    guild_id: number;
    discord_guild_id: string;
    moderator_role: string;
    best_in_slot_role?: string;
    overview_message_id?: string;
};

export interface Guild extends BaseGuild {
    statics?: Static[];
}

export type GuildParams = {
    guild_id?: string;
    discord_guild_id?: string;
    moderator_role?: string;
    best_in_slot_role?: string;
    overview_message_id?: string;
};
