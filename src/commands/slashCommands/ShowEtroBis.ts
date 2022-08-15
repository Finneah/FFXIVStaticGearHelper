import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Client,
    CommandInteraction
} from 'discord.js';
import {errorHandler} from '../../handler';
import {strings} from '../../locale/i18n';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from '../../types';

import {Command} from '../Command';
import {handleGetGearsetEmbedCommand} from '../handleGetGearsetEmbedCommand';

export const ShowEtroBis: Command = {
    name: 'show_bis',
    description: strings('showBis.description'),
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'by_link',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'test',
            options: [
                {
                    name: 'link',
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisLinkOption.description'),
                    required: true
                }
            ]
        },
        {
            name: 'by_id',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'test',
            options: [
                {
                    name: 'id',
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisIdOption.description'),
                    required: true
                }
            ]
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.guildId) {
                return interaction.followUp(
                    strings('error.general', {
                        details: 'error.coruptInteraction'
                    })
                );
            }
            const idOption = interaction.options.data.find(
                (option) => option.name === 'by_id' || option.name === 'by_link'
            );

            // const guildConfig: GuildConfigTypes = await getGuildConfig(
            //     interaction.guildId
            // );
            // const hasPermission = await checkPermission(
            //     interaction,
            //     interaction.guildId,
            //     guildConfig.static_role
            // );

            if (idOption && idOption.options?.[0].value) {
                handleGetGearsetEmbedCommand(
                    idOption.name === 'by_id' ? 'by_id' : 'by_link',
                    idOption.options?.[0].value.toString(),
                    interaction
                );
            }
        } catch (error: ErrorType) {
            errorHandler('ShowEtroBis', error, interaction);
        }
    }
};
