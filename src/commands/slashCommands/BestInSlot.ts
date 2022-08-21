import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CacheType,
    Client,
    CommandInteraction,
    CommandInteractionOption,
    Message
} from 'discord.js';
import {
    getAllBisByUser,
    getBisByUserByName
} from '../../database/actions/bestInSlot/getBisFromUser';
import {setBisForUser} from '../../database/actions/bestInSlot/setBisForUser';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';

import {BisLinksType, GuildConfigType} from '../../database/types/DataType';

import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';
import Logger from '../../logger';

import {CommandNames, OptionNames, SubCommandNames} from '../../types';
import {checkPermission} from '../../utils/permissions';

import {Command} from '../Command';
import {getGearsetEmbedCommand} from '../handleGetGearsetEmbedCommand';

const logger = Logger.child({module: 'BestInSlot'});

/**
 * @description Slot Command BestInSlot,
 * get or set the users BiS in DB
 */
export const BestInSlot: Command = {
    name: CommandNames.BESTINSLOT,
    description: 'bisCommand.description',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: SubCommandNames.SET,
            type: ApplicationCommandOptionType.Subcommand,
            description: strings('setBisCommand.description'),
            options: [
                {
                    name: OptionNames.LINK,
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisCommand.link.description'),
                    required: true
                },
                {
                    name: OptionNames.NAME,
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisCommand.name.description'),
                    required: true
                }
            ]
        },
        {
            name: SubCommandNames.GET,
            type: ApplicationCommandOptionType.Subcommand,
            description: strings('getBisCommand.description'),
            options: [
                {
                    name: OptionNames.NAME,
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisCommand.name.description'),
                    required: true,
                    autocomplete: true
                }
            ]
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    'BestInSlot',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

            const subCommand = interaction.options.data.find(
                (option) =>
                    option.name === SubCommandNames.SET ||
                    option.name === SubCommandNames.GET
            );

            const guildConfig = await getGuildConfig(interaction.guildId);

            const hasPermissions = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig?.static_role
            );

            if (!hasPermissions) {
                handleInteractionError(
                    'BestInSlot',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }
            const allSavedBisFromUser = await getAllBisByUser(
                interaction.user.id
            );

            switch (subCommand?.name) {
                case SubCommandNames.SET:
                    if (allSavedBisFromUser?.length === 2) {
                        return interaction.followUp({
                            ephemeral: true,
                            content:
                                'Es tut mir leid, du kannst nur 2 BiS Links speichern.'
                        });
                    }
                    handleSetBis(interaction, subCommand, allSavedBisFromUser);

                    break;

                case SubCommandNames.GET:
                    handleGetBis(interaction, subCommand, hasPermissions);
                    break;

                default:
                    break;
            }
        } catch (error) {
            errorHandler('BestInSlot', error);
        }
    }
};

/**
 * @description handle the set bis Command
 * @param interaction CommandInteraction<CacheType>
 * @param subCommand  CommandInteractionOption<CacheType>
 * @param allSavedBisFromUser BisLinksType[] | null
 * @returns : Promise<Message<boolean>>
 */
const handleSetBis = async (
    interaction: CommandInteraction<CacheType>,
    subCommand: CommandInteractionOption<CacheType>,
    allSavedBisFromUser: BisLinksType[] | null
): Promise<Message<boolean>> => {
    try {
        const link = subCommand.options?.find(
            (opt) => opt.name === OptionNames.LINK
        )?.value;
        const name = subCommand.options?.find(
            (opt) => opt.name === OptionNames.NAME
        )?.value;

        if (!link || !name) {
            logger.warn('missingParameter', link, name);
            return interaction.followUp(
                strings('error.general', {
                    details: strings('error.missingParameter')
                })
            );
        }

        const exist =
            allSavedBisFromUser &&
            allSavedBisFromUser.find(
                (saved) =>
                    saved.bis_name === name &&
                    saved.user_id === interaction.user.id
            );
        if (exist) {
            logger.warn('bisNameExist', link, name);
            return interaction.followUp(
                strings('error.general', {
                    details: strings('error.bisNameExist')
                })
            );
        }

        const message = await setBisForUser({
            user_id: interaction.user.id,
            bis_link: link.toString(),
            bis_name: name.toString()
        });

        return interaction.followUp({
            ephemeral: true,
            content: message
        });
    } catch (error) {
        return interaction.followUp({
            ephemeral: true,
            content: errorHandler('handleSetBis', error)
        });
    }
};

/**
 *
 * @param interaction
 * @param subCommand
 * @param hasPermission
 * @returns  Promise<Message<boolean>>
 */
const handleGetBis = async (
    interaction: CommandInteraction<CacheType>,
    subCommand: CommandInteractionOption<CacheType>,
    hasPermission: boolean
): Promise<Message<boolean>> => {
    try {
        const name = subCommand.options?.find(
            (opt) => opt.name === OptionNames.NAME
        )?.value;
        if (!name) {
            return interaction.followUp({
                ephemeral: true,
                content: strings('error.general', {
                    details: strings('error.missingParameter')
                })
            });
        }

        const bis: BisLinksType | null = await getBisByUserByName(
            interaction.user.id,
            name.toString()
        );

        if (bis?.bis_link) {
            return getGearsetEmbedCommand(
                SubCommandNames.BY_LINK,
                bis.bis_link,
                interaction,
                bis,
                hasPermission
            );
        }

        return interaction.followUp({
            ephemeral: true,
            content: strings('error.general', {
                details: strings('error.noSavedBis')
            })
        });
    } catch (error) {
        return interaction.followUp({
            ephemeral: true,
            content: errorHandler('handleSetBis', error)
        });
    }
};
