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

                            content: 'Button, Configurieren?'
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
    console.log('HERE', 'settingsExist NOT');
    const newConfig: GuildConfig = {
        guild_id: interaction.guildId ?? '',
        moderator_role: moderator_roleOption.value?.toString() || '',
        static_role: static_roleOption.value?.toString() || ''
    };

    setGuildConfig(newConfig);
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
        ephemeral: true,

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
                            label: `Überschreiben`,
                            custom_id: `overrideConfig`,
                            disabled: false,
                            type: 2
                        },
                        {
                            style: 4,
                            label: `Abbrechen`,
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
        time: 15000
    });

    collector.on('collect', (i: ButtonInteraction) => {
        if (i.user.id === interaction.user.id) {
            switch (i.customId) {
                case 'overrideConfig':
                    setConfig(
                        interaction,
                        moderator_roleOption,
                        static_roleOption
                    );
                    i.deleteReply();
                    break;
                case 'cancelConfig':
                    interaction.deleteReply();
                    break;
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
        console.log(`Collected ${collected.size} interactions.`);
        if (collected.size === 0) {
            message.edit({
                components: []
            });
        }
    });
};
