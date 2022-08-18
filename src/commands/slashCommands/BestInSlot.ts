import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CacheType,
    Client,
    CommandInteraction,
    CommandInteractionOption
} from 'discord.js';
import {
    getBisByUser,
    getBisByUserByName
} from '../../database/actions/bestInSlot/getBisFromUser';
import {setBisForUser} from '../../database/actions/bestInSlot/setBisForUser';

import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {BisLinksType, GuildConfigType} from '../../database/types/DataType';

import {errorHandler} from '../../handler';
import {strings} from '../../locale/i18n';
import Logger from '../../logger';

import {
    CommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType,
    OptionNames,
    SubCommandNames
} from '../../types';
import {checkPermission} from '../../utils/permissions';

import {Command} from '../Command';
import {handleGetGearsetEmbedCommand} from '../handleGetGearsetEmbedCommand';

const logger = Logger.child({module: 'BestInSlot'});
/**
 * 1. set bis link name
 * - schon vorhanden? request umbenennen mit modal
 * - noch nicht vorhanden ? speichern, request anzeigen?
 * 2. get bis name=select
 * - button settings => löschen, umbenennen
 * - reaktionen icons für erhalten/nicht erhalten
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
                return interaction.followUp(
                    strings('error.general', {
                        details: 'error.coruptInteraction'
                    })
                );
            }

            const subCommand = interaction.options.data.find(
                (option) =>
                    option.name === SubCommandNames.SET ||
                    option.name === SubCommandNames.GET
            );

            const guildConfig: GuildConfigType = await getGuildConfig(
                interaction.guildId,
                interaction
            );

            const hasPermissions = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig?.static_role
            );

            if (!hasPermissions) {
                return interaction.followUp(
                    strings('error.general', {
                        details: 'error.permissionDenied'
                    })
                );
            }
            const savedBis = await getBisByUser(interaction.user.id);
            switch (subCommand?.name) {
                case SubCommandNames.SET:
                    handleSetBis(interaction, subCommand, savedBis);

                    break;

                case SubCommandNames.GET:
                    handleGetBis(interaction, subCommand, hasPermissions);
                    break;

                default:
                    break;
            }
        } catch (error: ErrorType) {
            errorHandler('BestInSlot', error, interaction);
        }
    }
};

const handleSetBis = async (
    interaction: CommandInteraction<CacheType>,
    subCommand: CommandInteractionOption<CacheType>,
    savedBis: BisLinksType[]
) => {
    try {
        const link = subCommand.options?.find(
            (opt) => opt.name === OptionNames.LINK
        )?.value;
        const name = subCommand.options?.find(
            (opt) => opt.name === OptionNames.NAME
        )?.value;

        const exist = savedBis.find(
            (saved) =>
                saved.bis_name === name && saved.user_id === interaction.user.id
        );
        if (exist) {
            logger.warn('bisNameExist', link, name);
            return interaction.followUp(
                strings('error.general', {
                    details: 'error.bisNameExist'
                })
            );
        }
        if (!link || !name) {
            logger.warn('missingParameter', link, name);
            return interaction.followUp(
                strings('error.general', {
                    details: 'error.missingParameter'
                })
            );
        }
        setBisForUser({
            user_id: interaction.user.id,
            bis_link: link.toString(),
            bis_name: name.toString()
        });

        logger.info('Erfolgreich gespeichert');
        return interaction.followUp({
            ephemeral: true,
            content: `BiS ${name} Gespeichert. Schau es dir mit \`/${CommandNames.BESTINSLOT} ${SubCommandNames.GET} :${OptionNames.NAME}\` gleich an`
        });
    } catch (error: ErrorType) {
        errorHandler('handleSetBis', error, interaction);
    }
};

const handleGetBis = async (
    interaction: CommandInteraction<CacheType>,
    subCommand: CommandInteractionOption<CacheType>,
    hasPermission: boolean
) => {
    try {
        const name = subCommand.options?.find(
            (opt) => opt.name === OptionNames.NAME
        )?.value;
        if (!name) {
            return interaction.followUp(
                strings('error.general', {
                    details: 'error.missingParameter'
                })
            );
        }

        const bis: BisLinksType = await getBisByUserByName(
            interaction.user.id,
            name.toString(),
            interaction
        );

        handleGetGearsetEmbedCommand(
            SubCommandNames.BY_LINK,
            bis.bis_link,
            interaction,
            bis,
            hasPermission
        );
    } catch (error) {
        errorHandler('handleSetBis', error, interaction);
    }
};
