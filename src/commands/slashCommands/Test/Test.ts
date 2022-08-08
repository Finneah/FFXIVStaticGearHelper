import {
    APIEmbed,
    ApplicationCommandType,
    AttachmentBuilder,
    Client,
    Colors,
    CommandInteraction,
    EmbedBuilder,
    EmbedData
} from 'discord.js';

import {errorHandler} from '../../../handler/error/errorHandler';

import {Command} from '../../Command';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeHtmlToImage = require('node-html-to-image');

// https://github.com/en3sis/discord-guides/blob/main/examples/htmlToPng.js
export const Test: Command = {
    name: 'test',
    description: 'test',
    type: ApplicationCommandType.ChatInput,

    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            const name = interaction.user.username;
            const avatar = await interaction.user.avatarURL();

            await interaction.followUp({
                ephemeral: true,
                content: 'Test'
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error, interaction);
        }
    }
};
