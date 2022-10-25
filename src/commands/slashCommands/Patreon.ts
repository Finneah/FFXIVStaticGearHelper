import { APIEmbed, ApplicationCommandType, Client, Colors, CommandInteraction, EmbedBuilder, EmbedData } from 'discord.js';

import { errorHandler } from '../../handler/errorHandler/errorHandler';
import { CommandNames } from '../../types';
import { Command } from '../Command';

export const Patreon: Command = {
    name: CommandNames.PATREON,
    description: 'become a patreon and gain extra Features',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            const embedData: EmbedData | APIEmbed = {
                color: Colors.DarkGreen,
                title: 'Become a Patreon',
                url: 'https://www.patreon.com/user/membership?u=77936101'
            };
            const embed = new EmbedBuilder(embedData);
            await interaction.followUp({
                ephemeral: false,
                embeds: [embed]
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error);
        }
    }
};
