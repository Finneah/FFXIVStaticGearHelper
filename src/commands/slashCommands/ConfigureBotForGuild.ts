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
    ComponentType,
    EmbedBuilder,
    EmbedData,
    Message
} from 'discord.js';
import {setGuildConfig} from '../../database';
import {editGuildConfig} from '../../database/actions/guildConfig/editGuildConfig';

import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {GuildConfigType} from '../../database/types/DataType';

import {errorHandler} from '../../handler';
import {strings} from '../../locale/i18n';

import {
    ButtonCommandNames,
    CommandNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorType,
    OptionNames,
    SubCommandNames
} from '../../types';
import {checkPermission} from '../../utils/permissions/permissions';

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

            const permissions = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig?.moderator_role
            );
            if (!permissions) {
                return interaction.followUp(
                    strings('error.general', {
                        details: 'error.permissionDenied'
                    })
                );
            }

            switch (subCommand?.name) {
                case SubCommandNames.SET:
                    handleSetConfig(interaction, subCommand, guildConfig);
                    break;

                case SubCommandNames.GET:
                    if (guildConfig) {
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
            errorHandler('ConfigureBotForGuild', error, interaction);
        }
    }
};

const setConfig = async (
    interaction: CommandInteraction<CacheType>,
    moderator_roleOption: CommandInteractionOption<CacheType>,
    static_roleOption: CommandInteractionOption<CacheType>
) => {
    const newConfig: GuildConfigType = {
        guild_id: interaction.guildId ?? '',
        moderator_role: moderator_roleOption.value?.toString() || '',
        static_role: static_roleOption.value?.toString() || ''
    };

    editGuildConfig(newConfig);

    const embed = await getConfigEmbed(
        newConfig.moderator_role,
        newConfig.static_role,
        Colors.Red
    );
    return interaction.followUp({
        // allowed_mentions: {
        //     replied_user: false,
        //     parse: ['roles'],
        //     roles: ['@ROLENAME']
        // },
        ephemeral: false,
        embeds: embed ? [embed] : undefined
    });
};

const handleSetConfig = async (
    interaction: CommandInteraction<CacheType>,
    subCommand: CommandInteractionOption<CacheType>,
    guildConfig: GuildConfigType
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

        if (moderator_roleOption && static_roleOption) {
            if (
                guildConfig &&
                guildConfig.moderator_role &&
                guildConfig.static_role
            ) {
                await handleSetConfigAlreadyExist(
                    interaction,
                    guildConfig,
                    moderator_roleOption,
                    static_roleOption
                );
            } else {
                await setConfig(
                    interaction,
                    moderator_roleOption,
                    static_roleOption
                );
            }
        } else {
            return interaction.followUp({
                ephemeral: true,
                content: strings('error.rolesMissing')
            });
        }
    } catch (error: ErrorType) {
        errorHandler('handleSetConfig', error, interaction);
    }
};

const handleGetConfig = async (
    interaction: CommandInteraction<CacheType>,
    guildConfig: GuildConfigType
) => {
    const embed = await getConfigEmbed(
        guildConfig.moderator_role,
        guildConfig.static_role,
        Colors.Green
    );

    return interaction.followUp({
        // allowed_mentions: {
        //     replied_user: false,
        //     parse: ['roles'],
        //     roles: ['@ROLENAME']
        // },
        ephemeral: true,

        embeds: embed ? [embed] : undefined
    });
};

const handleSetConfigAlreadyExist = async (
    interaction: CommandInteraction<CacheType>,
    guildConfig: GuildConfigType,
    moderator_roleOption: CommandInteractionOption<CacheType>,
    static_roleOption: CommandInteractionOption<CacheType>
) => {
    const embed = await getConfigEmbed(
        guildConfig.moderator_role,
        guildConfig.static_role,
        Colors.Blue
    );

    const alreadyExistEmbed = await getConfigAlreadyExistEmbed(
        guildConfig.moderator_role,
        guildConfig.static_role
    );

    return interaction
        .followUp({
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
                            custom_id: ButtonCommandNames.CONFIG_CANCEL,
                            disabled: false,
                            type: 2
                        }
                    ]
                }
            ]
        })
        .then((message: Message<boolean>) => {
            handleButtonCollector(
                message,
                interaction,
                moderator_roleOption,
                static_roleOption
            );
        });
};

const getConfigEmbed = (
    moderator_role: string | undefined,
    static_role: string | undefined,
    color: number
) => {
    const embedData: EmbedData | APIEmbed = {
        title: `Static Gear Helper Config`,
        description: `Alle Mitglieder der Rolle <@&${moderator_role}> dürfen die Konfiguration anpassen.\n
        Alle Mitglieder der Rolle <@&${static_role}> dürfen nun ihr BiS Gear speichern. `,
        color: color,
        fields: [
            {
                name: OptionNames.MODERATOR_ROLE,
                value: `<@&${moderator_role}>`,
                inline: true
            },
            {
                name: OptionNames.STATIC_ROLE,
                value: `<@&${static_role}>`,
                inline: true
            },

            {
                name: '\u200B',
                value: '\u200B'
            },

            {
                name: `Verfügbare Befehle`,
                value: '\u200B'
            },
            {
                name: `/${CommandNames.BESTINSLOT} ${SubCommandNames.SET} :bis_name`,
                value: `speicher dieses Gearset`
            },
            {
                name: `/${CommandNames.BESTINSLOT} ${SubCommandNames.GET} :bis_name`,
                value: `zeigt das gespeicherte Gearset`
            },
            {
                name: `/${CommandNames.BESTINSLOT} ${SubCommandNames.DELETE} :bis_name`,
                value: `Lösche das gespeicherte Gearset`
            }
        ]
    };

    return new EmbedBuilder(embedData);
};

const getConfigAlreadyExistEmbed = (
    moderator_role: string | undefined,
    static_role: string | undefined
) => {
    const embedData: EmbedData | APIEmbed = {
        title: strings('configSetCommand.alreadyExistTitle'),
        description: strings('configSetCommand.alreadyExistDescription'),
        color: Colors.Red,
        fields: [
            {
                name: `moderator_role`,
                value: `<@&${moderator_role}>`,
                inline: true
            },
            {
                name: `static_role`,
                value: `<@&${static_role}>`,
                inline: true
            }
        ]
    };

    return new EmbedBuilder(embedData);
};

const handleButtonCollector = (
    message: Message<boolean>,
    interaction: CommandInteraction<CacheType>,
    moderator_roleOption: CommandInteractionOption<CacheType>,
    static_roleOption: CommandInteractionOption<CacheType>
) => {
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: undefined
    });

    collector.on('collect', (i: ButtonInteraction) => {
        if (i.user.id === interaction.user.id) {
            switch (i.customId) {
                case ButtonCommandNames.CONFIG_OVERRIDE:
                    if (moderator_roleOption && static_roleOption) {
                        setConfig(
                            interaction,
                            moderator_roleOption,
                            static_roleOption,
                            true
                        );
                        return interaction.deleteReply();
                    }

                    break;
                case ButtonCommandNames.CONFIG_CANCEL:
                    return interaction.deleteReply();

                default:
                    break;
            }
        } else {
            i.reply({
                content: `These buttons aren't for you!`,
                ephemeral: true
            });
        }
    });

    collector.on('end', (collected: {size: number}) => {
        console.info(`Collected ${collected.size} interactions.`);
    });
};
