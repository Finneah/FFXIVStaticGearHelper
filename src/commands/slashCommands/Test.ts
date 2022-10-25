import { ApplicationCommandType, Client, CommandInteraction } from 'discord.js';

import { errorHandler, handleInteractionError } from '../../handler/errorHandler/errorHandler';
import { strings } from '../../locale/i18n';
import { Command } from '../Command';

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
            const guilds = await client.guilds.fetch();
            console.log('guilds', guilds);
            const homeGuild = await guilds
                .find((g) => g.id === '1004408026922487838')
                ?.fetch();
            console.log('homeGuild', homeGuild?.id);
            if (!homeGuild)
                return console.error("Couldn't find the bots guild!");

            const members = await homeGuild.members.fetch();
            console.log('members', members);
            const member = members.find((m) => m.id === interaction.user.id);
            console.log('member', member?.id);

            // if (!member) return false;

            await interaction.followUp({
                ephemeral: true,
                content: 'TEST ' + member?.user.username
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error);
        }
    }
};
