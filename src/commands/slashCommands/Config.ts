import {
    APIEmbed,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonInteraction,
    CacheType,
    Client,
    Colors,
    CommandInteraction,
    CommandInteractionOption,
    EmbedBuilder,
    EmbedData,
} from 'discord.js';

import { errorHandler, handleInteractionError } from '../../handler';
import { strings } from '../../locale/i18n';
import { guildsSelectors } from '../../redux/guilds/guilds.adapter';
import { store } from '../../redux/store';
import { ButtonCommandNames, CommandNames, OptionNames, SubCommandNames } from '../../types';
import { Guild } from '../../types/guild';
import { transformedRole } from '../../utils';
import { checkPermission } from '../../utils/permissions';
import { Command } from '../Command';

export const Config: Command = {
    name: CommandNames.CONFIG,
    description: 'configCommand.description',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: SubCommandNames.SET,
            type: ApplicationCommandOptionType.Subcommand,
            description: strings('setConfigCommand.description'),
            options: [
                {
                    name: OptionNames.MODERATOR_ROLE,
                    type: ApplicationCommandOptionType.Role,
                    description: strings('moderatorRoleOption.description'),
                    required: true
                }
            ]
        },
        {
            name: SubCommandNames.GET,
            type: ApplicationCommandOptionType.Subcommand,
            description: strings('getConfigCommand.description')
        }
    ],

    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.guildId) {
                handleInteractionError(
                    CommandNames.CONFIG,
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

            const state = store.getState();
            const guild: Guild | undefined = guildsSelectors.selectById(
                state,
                interaction.guildId
            )?.data;

            const permissions = await checkPermission(
                interaction,
                interaction.guildId,
                guild?.moderator_role
            );
            if (!permissions) {
                handleInteractionError(
                    'ConfigureBotForGuild',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }

            switch (subCommand?.name) {
                case SubCommandNames.SET:
                    handleSetConfig(interaction, subCommand, guild);
                    break;

                // case SubCommandNames.GET:
                //     if (
                //         guild &&
                //         guild.moderator_role &&
                //         guild.static_role
                //         // && guild.bis_channle
                //     ) {
                //         handleGetConfig(interaction, guild);
                //     } else {
                //         return interaction.followUp({
                //             ephemeral: true,
                //             content:
                //                 'Es wurde noch keine Konfiguration gespeichert. Wenn du eine Konfiguration speichern willst, gib `/config set` ein.'
                //         });
                //     }

                //     break;

                default:
                    break;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            errorHandler('ConfigureBotForGuild', error);
        }
    }
};

export const setConfig = async (
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    moderator_role: string,
    guild_idExist: boolean
) => {
    try {
        const newConfig: Guild = {
            guild_id: 0,
            discord_guild_id: interaction.guildId ?? '',
            moderator_role: transformedRole(moderator_role)
        };
        // if (guild_idExist) {
        //     dbUpdateGuild(newConfig);
        // } else {
        //     dbAddGuild(newConfig);
        // }
        const embed = await getConfigEmbed(
            newConfig.moderator_role,
            Colors.Red
        );
        return interaction.followUp({
            ephemeral: false,
            embeds: embed ? [embed] : undefined
        });
    } catch (error) {
        errorHandler('setConfig', error);
    }
};

const handleSetConfig = async (
    interaction: CommandInteraction<CacheType>,
    subCommand: CommandInteractionOption<CacheType>,
    guild?: Guild
) => {
    try {
        const moderator_roleOption =
            subCommand.options &&
            subCommand.options.find(
                (option) => option.name === OptionNames.MODERATOR_ROLE
            );

        if (moderator_roleOption && moderator_roleOption.value) {
            if (guild?.moderator_role) {
                await handleSetConfigAlreadyExist(
                    interaction,
                    guild,
                    moderator_roleOption.value.toString()
                );
            } else {
                await setConfig(
                    interaction,
                    moderator_roleOption.value.toString(),
                    guild?.guild_id ? true : false
                );
            }
        } else {
            return interaction.followUp({
                ephemeral: true,
                content: strings('error.general', {
                    details: strings('error.rolesMissing')
                })
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        errorHandler('handleSetConfig', error);
    }
};

const handleGetConfig = async (
    interaction: CommandInteraction<CacheType>,
    guild: Guild
) => {
    // const embed = await getConfigEmbed(
    //     guild.moderator_role,
    //     guild.static_role,
    //     Colors.Green
    // );
    // return interaction.followUp({
    //     ephemeral: true,
    //     embeds: embed ? [embed] : undefined
    // });
};

const handleSetConfigAlreadyExist = async (
    interaction: CommandInteraction<CacheType>,
    guild: Guild,
    moderator_role: string
) => {
    const embed = await getConfigEmbed(
        guild.moderator_role,

        Colors.Blue
    );
    const alreadyExistEmbed = await getConfigAlreadyExistEmbed(moderator_role);
    return interaction.followUp({
        ephemeral: false,
        embeds: embed ? [alreadyExistEmbed] : undefined,
        components: [
            {
                type: 1,
                components: [
                    {
                        style: 2,
                        label: `${strings('override')}`,
                        custom_id: ButtonCommandNames.CONFIG_OVERRIDE,
                        disabled: false,
                        type: 2
                    },
                    {
                        style: 4,
                        label: `${strings('cancel')}`,
                        custom_id: ButtonCommandNames.CANCEL,
                        disabled: false,
                        type: 2
                    }
                ]
            }
        ]
    });
};

const getConfigEmbed = (
    moderator_role: string | undefined,

    color: number
) => {
    const moderatorRole =
        moderator_role?.search('<@&') == -1
            ? '<@&' + moderator_role + '>'
            : moderator_role;
    const guildStaticLevel = 1;
    const embedData: EmbedData | APIEmbed = {
        title: `FFXIV Gear Helper Config`,
        description: `Alle Mitglieder der Rolle ${moderatorRole} dürfen die Konfiguration anpassen.\n
        Sie dürfen außerdem ${guildStaticLevel} Static Gruppe(n) anlegen.`,
        color: color,
        fields: [
            {
                name: OptionNames.MODERATOR_ROLE,
                value: `${moderator_role}`,
                inline: true
            },
            {
                name: '\u200B',
                value: '\u200B'
            },
            {
                name: `Verfügbare Befehle für Static Mitglieder`,
                value: '\u200B'
            },
            {
                name: `/${CommandNames.MYBIS} ${SubCommandNames.SET} :${OptionNames.LINK} :${OptionNames.NAME} :${OptionNames.STATIC_NAME}`,
                value: `Speicher dieses Gearset um deinen Lott zu markieren und damit es in der Static Übersicht erscheint.`
            },

            {
                name: `/${CommandNames.MYBIS} ${SubCommandNames.GET} :${OptionNames.NAME}`,
                value: `Zeigt das gespeicherte Gearset.\nTipp: Dieser Befehl geht auch als DM.`
            },
            {
                name: `/${CommandNames.MYBIS} ${SubCommandNames.DELETE} :${OptionNames.NAME}`,
                value: `Lösche das gespeicherte Gearset`
            },
            {
                name: `/${CommandNames.SETSTATICGEAR} :${OptionNames.NAME}`,
                value: `setzt das gewählte Gearset als Main Set. Dadurch wird es in der Übersicht angezeigt!\nEs kann immer nur ein Gearset als Main markiert werden.\nHast du ein zweites Set gespeichert, musst du nichts weiter tun. Das macht der Bot automatisch.`
            },
            {
                name: `/${CommandNames.STATICOVERVIEW}`,
                value: `Zeigt die Gesamtübersicht der Static.\nWird dieser Befehl ein weiteres Mal ausgeführt, so wird die vorherige Übersicht überschrieben.`
            },
            {
                name: '\u200B',
                value: '\u200B'
            },
            {
                name: `Verfügbare Befehle für ${OptionNames.MODERATOR_ROLE}`,
                value: '\u200B'
            },
            {
                name: `/${CommandNames.CONFIG} ${SubCommandNames.SET} :${OptionNames.MODERATOR_ROLE}`,
                value: `Setze eine Rolle für die ${OptionNames.MODERATOR_ROLE}.`
            },
            {
                name: `/${CommandNames.CONFIG} :${SubCommandNames.GET}`,
                value: `Zeigt die Konfiguration an.`
            },
            {
                name: '\u200B',
                value: '\u200B'
            },
            {
                name: `Verfügbare Befehle für Serverinhaber`,
                value: '\u200B'
            },
            {
                name: `/${CommandNames.DELETE_USER} :${OptionNames.ID}`,
                value: `Löscht einen Benutzer anhand der ID.\n Du benotigst Modarator- oder Adminrechte für diesen Befehl!`
            }
        ]
    };

    return new EmbedBuilder(embedData);
};

const getConfigAlreadyExistEmbed = (moderator_role: string | undefined) => {
    const moderatorRole =
        moderator_role?.search('<@&') == -1
            ? '<@&' + moderator_role + '>'
            : moderator_role;
    const embedData: EmbedData | APIEmbed = {
        title: strings('configSetCommand.alreadyExistTitle'),
        description: strings('configSetCommand.alreadyExistDescription'),
        color: Colors.Red,
        fields: [
            {
                name: `${strings('configSetCommand.newRoles')}`,
                value: `\u200b`,
                inline: false
            },
            {
                name: `${OptionNames.MODERATOR_ROLE}`,
                value: `${moderatorRole}`,
                inline: true
            }
        ]
    };

    return new EmbedBuilder(embedData);
};
