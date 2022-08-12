import {CommandInteraction, CacheType} from 'discord.js';
import {t} from 'i18next';

export const errorHandler = (
    namespace: string,
    error: Error,
    interaction?: CommandInteraction<CacheType>
) => {
    console.warn('ERROR ' + error.name + ' ' + namespace, error.message);

    if (interaction) {
        showInteraction(interaction, error);
    }
};

const showInteraction = async (
    interaction: CommandInteraction<CacheType>,
    error: Error
) => {
    await interaction.followUp(t('error.general', {details: error.message}));
};
