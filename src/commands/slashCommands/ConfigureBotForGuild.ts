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
    Message,
    PermissionsBitField
} from 'discord.js';
import {setGuildConfig} from '../../database';
import {editGuildConfig} from '../../database/actions/editGuildConfig';

import {getGuildConfig} from '../../database/actions/getGuildConfig';
import {GuildConfig} from '../../database/types/GuildConfigType';

import {errorHandler} from '../../handler';
import {strings} from '../../locale/i18n';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from '../../types';

import {Command} from '../Command';

export const ConfigureBotForGuild: Command = {
    name: 'config',
    description: 'configCommand.description',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'set',
            type: ApplicationCommandOptionType.Subcommand,
            description: strings('setConfigCommand.description'),
            options: [
                {
                    name: 'moderator_role',
                    type: ApplicationCommandOptionType.Role,
                    description: strings('moderatorRoleOption.description'),
                    required: true
                },
                {
                    name: 'static_role',
                    type: ApplicationCommandOptionType.Role,
                    description: strings('staticRoleOption.description'),
                    required: true
                }
            ]
        },
        {
            name: 'get',
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
                (option) => option.name === 'set' || option.name === 'get'
            );

            const guildConfig: GuildConfig = await getGuildConfig(
                interaction.guildId
            );

            const permissions = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig
            );
            if (!permissions) {
                return interaction.followUp(
                    strings('error.general', {
                        details: 'error.permissionDenied'
                    })
                );
            }

            switch (subCommand?.name) {
                case 'set':
                    handleSetConfig(interaction, subCommand, guildConfig);
                    break;

                case 'get':
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
    static_roleOption: CommandInteractionOption<CacheType>,
    isUpdate = false
) => {
    const newConfig: GuildConfig = {
        guild_id: interaction.guildId ?? '',
        moderator_role: moderator_roleOption.value?.toString() || '',
        static_role: static_roleOption.value?.toString() || ''
    };

    if (isUpdate) {
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
    guildConfig: GuildConfig
) => {
    try {
        const moderator_roleOption =
            subCommand.options &&
            subCommand.options.find(
                (option) => option.name === 'moderator_role'
            );
        const static_roleOption =
            subCommand.options &&
            subCommand.options.find((option) => option.name === 'static_role');

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
        throw new Error(error);
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
    guildConfig: GuildConfig,
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
            ephemeral: true,
            content: strings('configset.alreadyExist'),
            embeds: embed ? [alreadyExistEmbed] : undefined,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            style: 2,
                            label: `${strings('override')}`,
                            custom_id: `overrideConfig`,
                            disabled: false,
                            type: 2
                        },
                        {
                            style: 4,
                            label: `${strings('cancel')}`,
                            custom_id: `cancelConfig`,
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
                name: `moderator_role`,
                value: `<@&${moderator_role}>`,
                inline: true
            },
            {
                name: `static_role`,
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
                name: `/addBis :bis_name`,
                value: `speicher dieses Gearset`
            },
            {
                name: `/getBis :bis_name`,
                value: `zeigt das gespeicherte Gearset`
            },
            {
                name: `/deleteBis :bis_name`,
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
                case 'overrideConfig':
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
                case 'cancelConfig':
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

const checkPermission = async (
    interaction: CommandInteraction<CacheType>,
    guildId: string,
    guildConfig: GuildConfig
) => {
    const guild = await interaction.client.guilds.fetch(guildId);
    const member = await guild.members.fetch(interaction.user.id);

    let hasPermisson = false;
    hasPermisson =
        member.permissions.has(PermissionsBitField.Flags.Administrator, true) ||
        member.permissions.has(PermissionsBitField.Flags.ManageGuild, true) ||
        guild.ownerId === member.id;

    if (guildConfig?.moderator_role) {
        if (!hasPermisson) {
            hasPermisson = member.roles.cache.has(guildConfig.moderator_role);
        }
    }
    return hasPermisson;
};
