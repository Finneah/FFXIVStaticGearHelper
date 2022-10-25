import { APIEmbed, ButtonInteraction, CacheType, Client, Colors, CommandInteraction, EmbedBuilder, EmbedData, EmbedField } from 'discord.js';

import { errorHandler, handleInteractionError } from '../handler';
import { strings } from '../locale/i18n';
import logger from '../logger';
import { EtroGearset } from '../types';
import { Guild } from '../types/guild';

export const getEmbedStaticOverview = async (
    client: Client,
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    guildConfig: Guild
): Promise<EmbedBuilder> => {
    const avatar = await interaction.user.avatarURL();
    const userIds = await getUserIds(client, interaction, guildConfig);
    if (!interaction.guildId) {
        const embedData: EmbedData | APIEmbed = {
            color: Colors.Gold,
            title: 'Übersicht',
            description: 'TBD GuildId not found',
            author: {
                name: interaction.user.username,
                icon_url: avatar ?? ''
            }
        };
        return new EmbedBuilder(embedData);
    }

    if (userIds) {
        const memberFields = await getMemberFields(
            userIds,
            interaction.guildId
        );

        const embedData: EmbedData | APIEmbed = {
            color: Colors.Gold,
            title: 'Übersicht',

            author: {
                name: interaction.user.username,
                icon_url: avatar ?? ''
            },
            fields: [
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                ...memberFields
            ]
        };
        return new EmbedBuilder(embedData);
    } else {
        const embedData: EmbedData | APIEmbed = {
            color: Colors.Gold,
            title: 'Übersicht',
            description: 'TBD',
            author: {
                name: interaction.user.username,
                icon_url: avatar ?? ''
            }
        };
        return new EmbedBuilder(embedData);
    }
};

const getUserIds = async (
    client: Client,
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    guildConfig: Guild
) => {
    if (!interaction.guild || !interaction.guildId) {
        handleInteractionError(
            'SetMainBis',
            interaction,
            strings('error.coruptInteraction')
        );
        return;
    }
    // if (!guildConfig?.static_role) {
    //     handleInteractionError(
    //         'SetMainBis',
    //         interaction,
    //         strings('error.noConfig')
    //     );
    //     return;
    // }

    const guild = await client.guilds.fetch(interaction.guildId);
    // const role = await interaction.guild?.roles.fetch(guildConfig.static_role);
    const userIds = await guild.members.fetch().then((fetchedMembers) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user_ids: any[] | PromiseLike<any[]> = [];
        // const staticRoleUser = fetchedMembers.filter((member) => {
        //     // const res = member.roles.cache.find((r) => r.id === role?.id);
        //     // return res ? true : false;
        // });
        // staticRoleUser.forEach((mem) => {
        //     user_ids.push(mem.user.id);
        // });
        return user_ids;
    });

    return userIds;
};

const getMemberFields = async (
    userIds: string[],
    guild_id: string
): Promise<EmbedField[]> => {
    const fields: EmbedField[] = [];
    try {
        // const allMainBis = await getMainBisAll(guild_id);
        // if (allMainBis) {
        //     const allFilteredMainBis = await getAllFilteredMainBis(
        //         allMainBis,
        //         userIds
        //     );

        //     if (allFilteredMainBis) {
        //         allFilteredMainBis.forEach((filteredMainBis) => {
        //             const withOffHand =
        //                 filteredMainBis.gearset.offHand !== null;

        //             if (filteredMainBis.gearset) {
        //                 const keys = Object.values(SlotNames);
        //                 for (let i = 0; i < keys.length; i++) {
        //                     const key = keys[i];
        //                     const fieldDoesExist = fields.find(
        //                         (field) => field.name === strings(key)
        //                     );

        //                     if (!fieldDoesExist) {
        //                         logger.debug('HERE !fieldDoesExist');
        //                         if (key === SlotNames.OFFHAND && withOffHand) {
        //                             fields.push({
        //                                 name: strings(key),
        //                                 value: '\u200b',
        //                                 inline: true
        //                             });
        //                         } else {
        //                             fields.push({
        //                                 name: strings(key),
        //                                 value: '\u200b',
        //                                 inline: true
        //                             });
        //                         }
        //                     }

        //                     // if (!filteredMainBis.filteredMainBis[key]) {
        //                     //     logger.debug('HERE');
        //                     //     // user doesnt have the weapon allready
        //                     //     switch (key) {
        //                     //         case SlotNames.FINGER_L:
        //                     //             // addUserAndBisNameToFieldValue(
        //                     //             //     fields,
        //                     //             //     key,
        //                     //             //     filteredMainBis.filteredMainBis
        //                     //             //         .user_id,
        //                     //             //     filteredMainBis.gearset.fingerL
        //                     //             //         ?.name
        //                     //             // );
        //                     //             break;
        //                     //         case SlotNames.FINGER_R:
        //                     //             // addUserAndBisNameToFieldValue(
        //                     //             //     fields,
        //                     //             //     key,
        //                     //             //     filteredMainBis.filteredMainBis
        //                     //             //         .user_id,
        //                     //             //     filteredMainBis.gearset.fingerR
        //                     //             //         ?.name
        //                     //             // );
        //                     //             break;
        //                     //         case SlotNames.OFFHAND:
        //                     //             if (withOffHand) {
        //                     //                 // addUserAndBisNameToFieldValue(
        //                     //                 //     fields,
        //                     //                 //     key,
        //                     //                 //     filteredMainBis.filteredMainBis
        //                     //                 //         .user_id,
        //                     //                 //     filteredMainBis.gearset.offHand
        //                     //                 //         ?.name
        //                     //                 // );
        //                     //             }

        //                     //             break;

        //                     //         default:

        //                     //             // addUserAndBisNameToFieldValue(
        //                     //             //     fields,
        //                     //             //     key,
        //                     //             //     filteredMainBis.filteredMainBis
        //                     //             //         .user_id,
        //                     //             //     filteredMainBis.gearset[key]?.name
        //                     //             // );
        //                     //             break;
        //                     //     }
        //                     // }
        //                 }
        //             }
        //         });
        //     } else {
        //         logger.warn('no allFilteredMainBis');
        //     }
        // } else {
        //     logger.warn('no allMainBis');
        // }

        return fields;
    } catch (error) {
        errorHandler('getEquipmentFields', error);
        return [];
    }
};

// const getAllFilteredMainBis = async (
//     allMainBis: DBBis[],
//     userIds: string[]
// ): Promise<{filteredMainBis: DBBis; gearset: EtroGearset}[]> => {
//     const allFilteredMainBis = allMainBis.filter((mainBis) =>
//         userIds.includes(mainBis.user_id)
//     );
//     const allFilteredMainBisWithGearSets: {
//         filteredMainBis: DBBis;
//         gearset: EtroGearset;
//     }[] = [];

//     // for (const filteredMainBis of allFilteredMainBis) {
//     //     const gearset = await getGearsetWithEquipment(
//     //         SubCommandNames.BY_LINK,
//     //         filteredMainBis.bis_link
//     //     );
//     //     if (gearset) {
//     //         allFilteredMainBisWithGearSets.push({
//     //             filteredMainBis,
//     //             gearset
//     //         });
//     //     }
//     // }

//     return allFilteredMainBisWithGearSets;
// };

const addUserAndBisNameToFieldValue = (
    fields: EmbedField[],
    key: string,
    user_id: string,
    gearsetName: string | undefined
) => {
    const field = fields.find((field) => field.name === strings(key));
    if (field) {
        if (gearsetName) {
            field.value = field.value.replace('\u200b', '');
            field.value += `\n<@${user_id}>\n_${gearsetName}_`;
        }
    }
};
