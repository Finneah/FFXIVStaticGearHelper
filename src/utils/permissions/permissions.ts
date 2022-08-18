import {
    CommandInteraction,
    CacheType,
    PermissionsBitField,
    ButtonInteraction
} from 'discord.js';

export const checkPermission = async (
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    guildId: string,
    guildConfigRole: string | undefined
) => {
    const guild = await interaction.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(interaction.user.id);

    let hasPermission = false;
    hasPermission =
        member.permissions.has(PermissionsBitField.Flags.Administrator, true) ||
        member.permissions.has(PermissionsBitField.Flags.ManageGuild, true) ||
        guild.ownerId === member.id;

    if (guildConfigRole) {
        if (!hasPermission) {
            hasPermission = member.roles.cache.has(guildConfigRole);
        }
    }
    return hasPermission;
};
