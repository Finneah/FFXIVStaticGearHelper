import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Client,
    CommandInteraction
} from 'discord.js';

import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';
import Logger from '../../logger';

import {CommandNames, OptionNames, SubCommandNames} from '../../types';
import {Command} from '../Command';
import {getGearsetEmbedCommand} from '../getGearsetEmbedCommand';

const logger = Logger.child({module: 'ShowEtroBis'});

export const EtroShow: Command = {
    name: CommandNames.ETRO,
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
                logger.warn('no interaction.guildId');
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

            if (idOption && idOption.options?.[0].value) {
                getGearsetEmbedCommand(
                    idOption.name === SubCommandNames.BY_ID
                        ? SubCommandNames.BY_ID
                        : SubCommandNames.BY_LINK,
                    idOption.options?.[0].value.toString(),
                    interaction
                );
            }
        } catch (error) {
            errorHandler('ShowEtroBis', error);
        }
    }
};
