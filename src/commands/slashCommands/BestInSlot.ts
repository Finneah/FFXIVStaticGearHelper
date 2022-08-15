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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from '../../types';
import {checkPermission} from '../../utils/permissions/permissions';

import {Command} from '../Command';
import {handleGetGearsetEmbedCommand} from '../handleGetGearsetEmbedCommand';

/**
 * 1. set bis link name
 * - schon vorhanden? request umbenennen mit modal
 * - noch nicht vorhanden ? speichern, request anzeigen?
 * 2. get bis name=select
 * - button settings => löschen, umbenennen
 * - reaktionen icons für erhalten/nicht erhalten
 */

export const BestInSlot: Command = {
    name: 'my_bis',
    description: 'bisCommand.description',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'set',
            type: ApplicationCommandOptionType.Subcommand,
            description: strings('setConfigCommand.description'),
            options: [
                {
                    name: 'link',
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisCommand.link.description'),
                    required: true
                },
                {
                    name: 'name',
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisCommand.name.description'),
                    required: true
                }
            ]
        },
        {
            name: 'get',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    type: ApplicationCommandOptionType.String,
                    description: strings('bisCommand.name.description'),
                    required: true,
                    autocomplete: true
                }
            ],
            description: strings('getConfigCommand.description')
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
                (option) => option.name === 'set' || option.name === 'get'
            );

            const guildConfig: GuildConfigType = await getGuildConfig(
                interaction.guildId,
                interaction
            );

            const permissions = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig.static_role
            );

            if (!permissions) {
                return interaction.followUp(
                    strings('error.general', {
                        details: 'error.permissionDenied'
                    })
                );
            }
            const savedBis = await getBisByUser(interaction.user.id);
            switch (subCommand?.name) {
                case 'set':
                    console.log('SET');
                    handleSetBis(interaction, subCommand, savedBis);

                    break;

                case 'get':
                    console.log('GET');
                    handleGetBis(interaction, subCommand, savedBis);
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
        // TODO vor dem speichern prüfen oder der user bereits ein Bis mit dem gleichen namen gespeichert hat!!!
        const link = subCommand.options?.find(
            (opt) => opt.name === 'link'
        )?.value;
        const name = subCommand.options?.find(
            (opt) => opt.name === 'name'
        )?.value;
        console.log('handleSetBis', savedBis);

        if (!link || !name) {
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
        return interaction.followUp({
            ephemeral: true,
            content: 'Erfolgreich gespeichert'
        });
    } catch (error: ErrorType) {
        errorHandler('handleSetBis', error, interaction);
    }
};

const handleGetBis = async (
    interaction: CommandInteraction<CacheType>,
    subCommand: CommandInteractionOption<CacheType>,
    savedBis: BisLinksType[]
) => {
    try {
        console.log(savedBis);

        const name = subCommand.options?.find(
            (opt) => opt.name === 'name'
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

        handleGetGearsetEmbedCommand('by_link', bis.bis_link, interaction);
    } catch (error) {
        errorHandler('handleSetBis', error, interaction);
    }
};
