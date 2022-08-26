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
