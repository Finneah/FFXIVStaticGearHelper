import {EmbedBuilder} from '@discordjs/builders';
import {ApplicationCommandType, Client, CommandInteraction} from 'discord.js';

import {errorHandler} from '../../handler/errorHandler/errorHandler';

import {Command} from '../Command';

// https://github.com/en3sis/discord-guides/blob/main/examples/htmlToPng.js
export const Test: Command = {
    name: 'test',
    description: 'test',
    type: ApplicationCommandType.ChatInput,

    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            const name = interaction.user.username;
            const avatar = await interaction.user.avatarURL();

            // interaction.guild?.emojis.create({
            //     attachment: 'https://etro.gg/s/icons/i/041000/041910.png',
            //     name: '041910'
            // });
            const icons = await interaction.guild?.emojis.fetch();

            const ayy = client.emojis.cache.find(
                (emoji) => emoji.name === '032795'
            );

            const embed = new EmbedBuilder({
                title: `${ayy} LMAO`,
                fields: [
                    {
                        name: 'Test',
                        value: `${ayy} Test`,
                        inline: false
                    }
                ]
            });
            await interaction.followUp({
                ephemeral: true,
                embeds: [embed]
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error, interaction);
        }
    }
};