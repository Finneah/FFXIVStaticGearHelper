import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CacheType,
    Client,
    CommandInteraction
} from 'discord.js';

import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';

import {CommandNames, OptionNames} from '../../types';
import {Command} from '../Command';
import {getGearsetEmbedCommand} from '../getGearsetEmbedCommand';

export const EtroShow: Command = {
    name: CommandNames.ETRO,
    description: strings('showBis.description'),
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: OptionNames.LINK,
            type: ApplicationCommandOptionType.String,
            description: strings('bisLinkOption.description'),
            required: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    'EtroShow',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }
            const link = getIdOptionValue(interaction);

            if (link) {
                return getGearsetEmbedCommand(link, interaction);
            }
            return;
        } catch (error) {
            errorHandler('EtroShow', error);
        }
    }
};

const getIdOptionValue = (
    interaction: CommandInteraction<CacheType>
): string | undefined => {
    const idOption = interaction.options.data.find(
        (option) => option.name === OptionNames.LINK
    );

    if (!idOption?.value) {
        handleInteractionError(
            'EtroShow',
            interaction,
            'Bitte gib einen link an.'
        );
        return undefined;
    }

    return idOption.value.toString();
};
