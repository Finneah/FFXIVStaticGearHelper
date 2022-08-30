import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Client,
    CommandInteraction,
    PermissionsBitField
} from 'discord.js';
import {deleteUser} from '../../database/actions/deleteUser/deleteAllFromUser';

import {
    errorHandler,
    handleInteractionError
} from '../../handler/errorHandler/errorHandler';
import {strings} from '../../locale/i18n';
import {CommandNames, OptionNames} from '../../types';

import {Command} from '../Command';

export const DeleteUser: Command = {
    name: CommandNames.DELETE_USER,
    description: 'test',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: OptionNames.ID,
            type: ApplicationCommandOptionType.String,
            description: strings('deleteUser.id.description'),
            required: true,
            autocomplete: false
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            const idOption = interaction.options.data.find(
                (option) => option.name === OptionNames.ID
            );
            if (!interaction.guildId || !idOption?.value) {
                handleInteractionError(
                    'SetMainBis',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

            const guild = await interaction.client.guilds.fetch(
                interaction.guildId
            );
            const member = await guild.members.fetch(interaction.user.id);

            let hasPermission = false;
            hasPermission =
                member.permissions.has(
                    PermissionsBitField.Flags.Administrator,
                    true
                ) ||
                member.permissions.has(
                    PermissionsBitField.Flags.ManageGuild,
                    true
                );

            if (hasPermission) {
                const deleted = await deleteUser(idOption.value.toString());
                if (deleted > 0) {
                    return await interaction.followUp({
                        ephemeral: true,
                        content: `User <${idOption.value}> gelöscht`
                    });
                } else {
                    return await interaction.followUp({
                        ephemeral: true,
                        content: `User <${idOption.value}> nicht vorhanden`
                    });
                }
            } else {
                handleInteractionError(
                    'DeleteUser',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error);
        }
    }
};
