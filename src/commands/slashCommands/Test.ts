import {ApplicationCommandType, Client, CommandInteraction} from 'discord.js';

import {errorHandler} from '../../handler/errorHandler/errorHandler';

import {Command} from '../Command';

export const Test: Command = {
    name: 'test',
    description: 'test',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.followUp({
                ephemeral: true,
                content: 'Test'
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error);
        }
    }
};
