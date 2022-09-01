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
    EmbedData
} from 'discord.js';
import {setGuildConfig} from '../../database';
import {editGuildConfig} from '../../database/actions/guildConfig/editGuildConfig';

import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {GuildConfig} from '../../database/types/DataType';

import {errorHandler, handleInteractionError} from '../../handler';
import {strings} from '../../locale/i18n';

import {
    ButtonCommandNames,
    CommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType,
    OptionNames,
    SubCommandNames
} from '../../types';
import {checkPermission} from '../../utils/permissions';

import {Command} from '../Command';

export const ConfigureBotForGuild: Command = {
    name: CommandNames.CONFIGUREBOTFORGUILD,
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
                },
                {
                    name: OptionNames.STATIC_ROLE,
                    type: ApplicationCommandOptionType.Role,
                    description: strings('staticRoleOption.description'),
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
                    'ConfigureBotForGuild',
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

            const permissions = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig?.moderator_role
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
                    handleSetConfig(interaction, subCommand, guildConfig);
                    break;

                case SubCommandNames.GET:
                    if (
                        guildConfig &&
                        guildConfig.moderator_role &&
                        guildConfig.static_role
                        // && guildConfig.bis_channle
                    ) {
                        handleGetConfig(interaction, guildConfig);
                    } else {
                        return interaction.followUp({
                            ephemeral: true,
                            content:
                                'Es wurde noch keine Konfiguration gespeichert. Wenn du eine Konfiguration speichern willst, gib `/config set` ein.'
                        });
                    }

                    break;

                default:
                    break;
            }
        } catch (error: ErrorType) {
            errorHandler('ConfigureBotForGuild', error);
        }
    }
};

export const setConfig = async (
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    moderator_role: string,
    static_role: string,
    guild_idExist: boolean
) => {
    try {
        const newConfig: GuildConfig = {
            guild_id: interaction.guildId ?? '',
            moderator_role: moderator_role,
            static_role: static_role
        };
        if (guild_idExist) {
            editGuildConfig(newConfig);
        } else {
            setGuildConfig(newConfig);
        }

        const embed = await getConfigEmbed(
            newConfig.moderator_role,
            newConfig.static_role,
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
    guildConfig: GuildConfig | null
) => {
    try {
        const moderator_roleOption =
            subCommand.options &&
            subCommand.options.find(
                (option) => option.name === OptionNames.MODERATOR_ROLE
            );
        const static_roleOption =
            subCommand.options &&
            subCommand.options.find(
                (option) => option.name === OptionNames.STATIC_ROLE
            );

        if (
            moderator_roleOption &&
            moderator_roleOption.value &&
            static_roleOption &&
            static_roleOption.value
        ) {
            if (guildConfig?.moderator_role && guildConfig?.static_role) {
                await handleSetConfigAlreadyExist(
                    interaction,
                    guildConfig,
                    moderator_roleOption.value.toString(),
                    static_roleOption.value.toString()
                );
            } else {
                await setConfig(
                    interaction,
                    moderator_roleOption.value.toString(),
                    static_roleOption.value.toString(),
                    guildConfig?.guild_id ? true : false
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
    } catch (error: ErrorType) {
        errorHandler('handleSetConfig', error);
    }
};

const handleGetConfig = async (
    interaction: CommandInteraction<CacheType>,
    guildConfig: GuildConfig
) => {
    const embed = await getConfigEmbed(
        guildConfig.moderator_role,
        guildConfig.static_role,
        Colors.Green
    );

    return interaction.followUp({
        ephemeral: true,
        embeds: embed ? [embed] : undefined
    });
};

const handleSetConfigAlreadyExist = async (
    interaction: CommandInteraction<CacheType>,
    guildConfig: GuildConfig,
    moderator_role: string,
    static_role: string
) => {
    const embed = await getConfigEmbed(
        guildConfig.moderator_role,
        guildConfig.static_role,
        Colors.Blue
    );

    const alreadyExistEmbed = await getConfigAlreadyExistEmbed(
        moderator_role,
        static_role
    );

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
    static_role: string | undefined,
    color: number
) => {
    moderator_role?.search('<@&') == -1 &&
        (moderator_role = '<@&' + moderator_role + '>');
    static_role?.search('<@&') == -1 &&
        (static_role = '<@&' + static_role + '>');

    const embedData: EmbedData | APIEmbed = {
        title: `Static Gear Helper Config`,
        description: `Alle Mitglieder der Rolle ${moderator_role} dürfen die Konfiguration anpassen.\n
        Alle Mitglieder der Rolle ${static_role} dürfen nun ihr BiS Gear speichern. `,
        color: color,
        fields: [
            {
                name: OptionNames.MODERATOR_ROLE,
                value: `${moderator_role}`,
                inline: true
            },
            {
                name: OptionNames.STATIC_ROLE,
                value: `${static_role}`,
                inline: true
            },
            {
                name: '\u200B',
                value: '\u200B'
            },
            {
                name: `Verfügbare Befehle für ${OptionNames.STATIC_ROLE}`,
                value: '\u200B'
            },
            {
                name: `/${CommandNames.BESTINSLOT} ${SubCommandNames.SET} :${OptionNames.LINK} :${OptionNames.NAME}`,
                value: `speicher dieses Gearset`
            },

            {
                name: `/${CommandNames.BESTINSLOT} ${SubCommandNames.GET} :${OptionNames.NAME}`,
                value: `zeigt das gespeicherte Gearset.\nFührst du diesen Befehl ein weiteres Mal aus, so wird die alte Nachricht gelöscht. `
            },
            {
                name: `/${CommandNames.BESTINSLOT} ${SubCommandNames.DELETE} :${OptionNames.NAME}`,
                value: `Lösche das gespeicherte Gearset`
            },
            {
                name: `/${CommandNames.SETMAINBIS} :${OptionNames.NAME}`,
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
                name: `/${CommandNames.CONFIGUREBOTFORGUILD} ${SubCommandNames.SET} :${OptionNames.MODERATOR_ROLE} :${OptionNames.STATIC_ROLE}`,
                value: `Setze eine Rolle für die ${OptionNames.MODERATOR_ROLE} und ${OptionNames.STATIC_ROLE}.`
            },
            {
                name: `/${CommandNames.CONFIGUREBOTFORGUILD} :${SubCommandNames.GET}`,
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

const getConfigAlreadyExistEmbed = (
    moderator_role: string | undefined,
    static_role: string | undefined
) => {
    moderator_role?.search('<@&') == -1 &&
        (moderator_role = '<@&' + moderator_role + '>');
    static_role?.search('<@&') == -1 &&
        (static_role = '<@&' + static_role + '>');

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
                value: `${moderator_role}`,
                inline: true
            },
            {
                name: `${OptionNames.STATIC_ROLE}`,
                value: `${static_role}`,
                inline: true
            }
        ]
    };

    return new EmbedBuilder(embedData);
};
