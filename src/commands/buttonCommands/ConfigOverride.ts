import {ApplicationCommandType, ButtonInteraction, Client} from 'discord.js';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {GuildConfigType} from '../../database/types/DataType';
import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ButtonCommandNames, OptionNames, ErrorType} from '../../types';
import {checkPermission} from '../../utils/permissions';
import {ButtonCommand} from '../Command';
import {setConfig} from '../slashCommands/ConfigureBotForGuild';

export const ConfigOverride: ButtonCommand = {
    name: ButtonCommandNames.CONFIG_OVERRIDE,
    type: ApplicationCommandType.Message,
    run: async (client: Client, interaction: ButtonInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    'ConfigOverride',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }
            const guildConfig: GuildConfigType = await getGuildConfig(
                interaction.guildId,
                interaction
            );
            const hasPermission = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig.static_role
            );

            if (!guildConfig.guild_id) {
                handleInteractionError(
                    'ConfigOverride',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

            if (
                interaction.user.id ===
                    interaction.message.interaction?.user.id &&
                hasPermission
            ) {
                if (interaction.message.embeds[0].fields) {
                    const moderator_role =
                        interaction.message.embeds[0].fields.find(
                            (field) => field.name === OptionNames.MODERATOR_ROLE
                        )?.value;

                    const static_role =
                        interaction.message.embeds[0].fields.find(
                            (field) => field.name === OptionNames.STATIC_ROLE
                        )?.value;

                    if (moderator_role && static_role) {
                        setConfig(
                            interaction,
                            moderator_role,
                            static_role,
                            guildConfig.guild_id ? true : false
                        );
                        return interaction.deleteReply();
                    }
                }
            } else {
                handleInteractionError(
                    'ConfigOverride',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }
        } catch (error: ErrorType) {
            errorHandler('EditBis', error, interaction);
        }
    }
};
