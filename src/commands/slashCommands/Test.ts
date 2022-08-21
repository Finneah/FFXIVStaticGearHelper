import {ApplicationCommandType, Client, CommandInteraction} from 'discord.js';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';

import {
    errorHandler,
    handleInteractionError
} from '../../handler/errorHandler/errorHandler';
import {strings} from '../../locale/i18n';

import {Command} from '../Command';

export const Test: Command = {
    name: 'test',
    description: 'test',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.guild || !interaction.guildId) {
                handleInteractionError(
                    'SetMainBis',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

            const guildConfig = await getGuildConfig(interaction.guildId);
            if (!guildConfig?.static_role) {
                handleInteractionError(
                    'SetMainBis',
                    interaction,
                    strings('error.noConfig')
                );
                return;
            }
            const guild = await client.guilds.fetch(interaction.guildId);
            const role = await interaction.guild?.roles.fetch(
                guildConfig.static_role
            );
            const userIds = await guild.members
                .fetch()
                .then((fetchedMembers) => {
                    const user_ids: any[] | PromiseLike<any[]> = [];
                    const totalOnline = fetchedMembers.filter((member) => {
                        const res = member.roles.cache.find(
                            (r) => r.id === role?.id
                        );
                        return res ? true : false;
                    });
                    totalOnline.forEach((mem) => {
                        user_ids.push(mem.user.id);
                        console.log(mem.user.username);
                    });
                    return user_ids;
                });

            await interaction.followUp({
                ephemeral: true,
                content: 'TEST'
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error);
        }
    }
};
