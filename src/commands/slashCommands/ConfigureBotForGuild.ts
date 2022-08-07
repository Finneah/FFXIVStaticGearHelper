import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Client,
    CommandInteraction
} from 'discord.js';

import {GuildConfig} from '../../database/sequelize';
import t from '../../locale/i18n';

import {Command} from '../Command';

export const ConfigureBotForGuild: Command = {
    name: 'config',
    description: t('configCommand.description'),
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user_role',
            type: ApplicationCommandOptionType.String,
            description: t('userRoleOption.description'),
            required: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            /**
             * 1. check if guild is already saved
             * 2. if saved => show messages already saved
             * 3. else save guild Settings
             */

            if (!interaction.guildId) {
                return interaction.followUp(
                    t('error.general', {details: 'error.coruptInteraction'})
                );
            }
            const settingsExist = await checkIfSettingsExists(
                interaction.guildId
            );
            if (settingsExist) {
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.followUp('That tag already exists.');
            }
            console.log(error);

            return interaction.followUp(
                'Something went wrong with adding a tag.'
            );
        }
    }
};

const checkIfSettingsExists = async (guildId: string) => {
    const guildConfig = await GuildConfig.findOne({
        where: {guild_id: guildId}
    });

    return guildConfig ? true : false;
};
