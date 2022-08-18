import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Client,
    CommandInteraction
} from 'discord.js';

import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';
import Logger from '../../logger';

import {
    CommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType,
    OptionNames,
    SubCommandNames
} from '../../types';
import {Command} from '../Command';
import {handleGetGearsetEmbedCommand} from '../handleGetGearsetEmbedCommand';

export const ShowEtroBis: Command = {
    name: CommandNames.SHOWETROBIS,
    description: strings('showBis.description'),
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: SubCommandNames.BY_LINK,
            type: ApplicationCommandOptionType.Subcommand,
            description: strings('bisLinkCommand.description'),
            options: [
                {
                    name: OptionNames.LINK,
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisLinkOption.description'),
                    required: true
                }
            ]
        },
        {
            name: SubCommandNames.BY_ID,
            type: ApplicationCommandOptionType.Subcommand,
            description: strings('bisIdCommand.description'),
            options: [
                {
                    name: OptionNames.ID,
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
                Logger.warn('no interaction.guildId');
                handleInteractionError(
                    'ShowEtroBis',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }
            const idOption = interaction.options.data.find(
                (option) =>
                    option.name === SubCommandNames.BY_LINK ||
                    option.name === SubCommandNames.BY_ID
            );
            if (!idOption?.options?.[0].value) {
                handleInteractionError(
                    'ShowEtroBis',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

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
                    idOption.name === SubCommandNames.BY_ID
                        ? SubCommandNames.BY_ID
                        : SubCommandNames.BY_LINK,
                    idOption.options?.[0].value.toString(),
                    interaction
                );
            }
        } catch (error: ErrorType) {
            errorHandler('ShowEtroBis', error, interaction);
        }
    }
};
