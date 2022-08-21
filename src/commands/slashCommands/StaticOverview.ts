import {
    APIEmbed,
    ApplicationCommandType,
    ButtonInteraction,
    CacheType,
    Client,
    Colors,
    CommandInteraction,
    EmbedBuilder,
    EmbedData,
    EmbedField,
    Role
} from 'discord.js';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {GearTypes} from '../../database/types/DataType';

import {
    errorHandler,
    handleInteractionError
} from '../../handler/errorHandler/errorHandler';
import {strings} from '../../locale/i18n';
import {CommandNames} from '../../types';
import {checkPermission} from '../../utils/permissions';

import {Command} from '../Command';

export const StaticOverview: Command = {
    name: CommandNames.STATICOVERVIEW,
    description: strings(CommandNames.STATICOVERVIEW + '.description'),
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.guild || !interaction.guildId) {
                handleInteractionError(
                    'SetMainBis',
                    interaction,
                    strings('error.coruptInteraction')
                );
                return;
            }

            const guildConfig = await getGuildConfig(interaction.guildId);
            if (!guildConfig?.static_role) {
                handleInteractionError(
                    'SetMainBis',
                    interaction,
                    strings('error.noConfig')
                );
                return;
            }
            const hasPermissions = await checkPermission(
                interaction,
                interaction.guildId,
                guildConfig?.static_role
            );

            if (!hasPermissions) {
                handleInteractionError(
                    'SetMainBis',
                    interaction,
                    strings('error.permissionDenied')
                );
                return;
            }
            const guild = await client.guilds.fetch(interaction.guildId);
            const role = await interaction.guild?.roles.fetch(
                guildConfig.static_role
            );
            const userIds = await guild.members
                .fetch()
                .then((fetchedMembers) => {
                    const user_ids: any[] | PromiseLike<any[]> = [];
                    const totalOnline = fetchedMembers.filter((member) => {
                        const res = member.roles.cache.find(
                            (r) => r.id === role?.id
                        );
                        return res ? true : false;
                    });
                    totalOnline.forEach((mem) => {
                        user_ids.push(mem.user.id);
                        console.log(mem.user.username);
                    });
                    return user_ids;
                });

            // interaction.guild.cache.roles.get('415665311828803584').members.map(m=>m.user.tag);
            const embed = await getEmbedStaticOverview(interaction, userIds);
            await interaction.followUp({
                ephemeral: true,
                content: 'Test',
                embeds: [embed]
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('Test', error);
        }
    }
};

export const getEmbedStaticOverview = async (
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    userIds: string[]
): Promise<EmbedBuilder> => {
    const avatar = await interaction.user.avatarURL();

    const memberFields = getMemberFields(userIds);
    const embedData: EmbedData | APIEmbed = {
        color: Colors.Gold,
        title: 'Übersicht',

        author: {
            name: interaction.user.username,
            icon_url: avatar ?? ''
        },
        // description: 'Some description here',
        // thumbnail: jobIconPath
        //     ? {
        //           url: jobIconPath
        //       }
        //     : undefined,

        fields: [
            {
                name: '\u200b',
                value: '\u200b',
                inline: false
            },
            ...memberFields
        ]
        // footer: {
        //     text: `${gearset.food.name}`,
        //     icon_url: 'https://etro.gg/s/icons' + gearset.food.iconPath
        // }
    };
    return new EmbedBuilder(embedData);
};

const getMemberFields = (userIds: string[]): EmbedField[] => {
    const fields: EmbedField[] = [];
    try {
        for (const value in GearTypes) {
            let userString = '';
            userIds.forEach((userId) => {
                // get mainBis name
                // get bis
                // check if value is true
                userString = userString += `<@${userId}>\n`;
            });
            fields.push({name: value, value: userString, inline: true});
        }

        return fields;
    } catch (error) {
        errorHandler('getEquipmentFields', error);
        return [];
    }
};
