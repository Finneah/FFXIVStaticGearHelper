import { ApplicationCommandOptionType, ApplicationCommandType, Client, CommandInteraction } from 'discord.js';

import { errorHandler, handleInteractionError } from '../../handler/errorHandler/errorHandler';
import { strings } from '../../locale/i18n';
import Logger from '../../logger';
import { CommandNames, OptionNames } from '../../types';
import { checkPermission } from '../../utils/permissions';
import { Command } from '../Command';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = Logger.child({module: 'SetMainBis'});

export const SetMainBis: Command = {
    name: CommandNames.SETSTATICGEAR,
    description: strings('setMainBis.description'),
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: OptionNames.NAME,
            type: ApplicationCommandOptionType.String,
            description: strings('bisCommand.name.description'),
            required: true,
            autocomplete: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            const idOption = interaction.options.data.find(
                (option) => option.name === OptionNames.NAME
            );

            if (!interaction.guildId || !idOption?.value) {
                handleInteractionError(
                    'SetMainBis',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

            // const guildConfig = await dbGetGuildById(interaction.guildId);

            // const hasPermissions = await checkPermission(
            //     interaction,
            //     interaction.guildId,
            //     guildConfig?.static_role
            // );

            // if (!hasPermissions) {
            //     handleInteractionError(
            //         'SetMainBis',
            //         interaction,
            //         strings('error.permissionDenied')
            //     );
            //     return;
            // }

            // const message = await setMainBis(
            //     idOption.value.toString(),
            //     interaction.user.id,
            //     interaction.guildId
            // );

            return interaction.followUp({
                ephemeral: false,
                content: 'message'
            });
        } catch (error) {
            errorHandler('Test', error);
        }
    }
};
