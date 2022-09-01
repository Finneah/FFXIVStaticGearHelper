import {
    Client,
    CommandInteraction,
    CacheType,
    ButtonInteraction,
    EmbedBuilder,
    EmbedData,
    APIEmbed,
    Colors,
    EmbedField
} from 'discord.js';
import {getAllMainBis} from '../database/actions/bestInSlot/getBisFromUser';
import {BisLinksType, GearTypes, GuildConfig} from '../database/types/DataType';
import {
    errorHandler,
    getGearsetWithEquipment,
    handleInteractionError
} from '../handler';
import {strings} from '../locale/i18n';
import logger from '../logger';
import {Gearset, SubCommandNames} from '../types';

export const getEmbedStaticOverview = async (
    client: Client,
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>,
    guildConfig: GuildConfig
): Promise<EmbedBuilder> => {
    const avatar = await interaction.user.avatarURL();
    const userIds = await getUserIds(client, interaction, guildConfig);

    if (userIds) {
        const memberFields = await getMemberFields(userIds);
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
    guildConfig: GuildConfig
) => {
    if (!interaction.guild || !interaction.guildId) {
        handleInteractionError(
            'SetMainBis',
            interaction,
            strings('error.coruptInteraction')
        );
        return;
    }
    if (!guildConfig?.static_role) {
        handleInteractionError(
            'SetMainBis',
            interaction,
            strings('error.noConfig')
        );
        return;
    }

    const guild = await client.guilds.fetch(interaction.guildId);
    const role = await interaction.guild?.roles.fetch(guildConfig.static_role);
    const userIds = await guild.members.fetch().then((fetchedMembers) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user_ids: any[] | PromiseLike<any[]> = [];
        const staticRoleUser = fetchedMembers.filter((member) => {
            const res = member.roles.cache.find((r) => r.id === role?.id);
            return res ? true : false;
        });
        staticRoleUser.forEach((mem) => {
            user_ids.push(mem.user.id);
        });
        return user_ids;
    });

    return userIds;
};

const getMemberFields = async (userIds: string[]): Promise<EmbedField[]> => {
    const fields: EmbedField[] = [];
    try {
        const allMainBis = await getAllMainBis();
        if (allMainBis) {
            const allFilteredMainBis = await getAllFilteredMainBis(
                allMainBis,
                userIds
            );

            if (allFilteredMainBis) {
                allFilteredMainBis.forEach((filteredMainBis) => {
                    const withOffHand =
                        filteredMainBis.gearset.offHand !== null;

                    if (filteredMainBis.gearset) {
                        const keys = Object.values(GearTypes);
                        for (let i = 0; i < keys.length; i++) {
                            const key = keys[i];
                            const fieldDoesExist = fields.find(
                                (field) => field.name === strings(key)
                            );

                            if (!fieldDoesExist) {
                                logger.debug('HERE !fieldDoesExist');
                                if (key === GearTypes.OFFHAND && withOffHand) {
                                    fields.push({
                                        name: strings(key),
                                        value: '\u200b',
                                        inline: true
                                    });
                                } else {
                                    fields.push({
                                        name: strings(key),
                                        value: '\u200b',
                                        inline: true
                                    });
                                }
                            }

                            if (!filteredMainBis.filteredMainBis[key]) {
                                logger.debug('HERE');
                                // user doesnt have the weapon allready
                                switch (key) {
                                    case GearTypes.FINGER_L:
                                        addUserAndBisNameToFieldValue(
                                            fields,
                                            key,
                                            filteredMainBis.filteredMainBis
                                                .user_id,
                                            filteredMainBis.gearset.fingerL
                                                ?.name
                                        );
                                        break;
                                    case GearTypes.FINGER_R:
                                        addUserAndBisNameToFieldValue(
                                            fields,
                                            key,
                                            filteredMainBis.filteredMainBis
                                                .user_id,
                                            filteredMainBis.gearset.fingerR
                                                ?.name
                                        );
                                        break;
                                    case GearTypes.OFFHAND:
                                        if (withOffHand) {
                                            addUserAndBisNameToFieldValue(
                                                fields,
                                                key,
                                                filteredMainBis.filteredMainBis
                                                    .user_id,
                                                filteredMainBis.gearset.offHand
                                                    ?.name
                                            );
                                        }

                                        break;

                                    default:
                                        logger.debug('HERE');
                                        addUserAndBisNameToFieldValue(
                                            fields,
                                            key,
                                            filteredMainBis.filteredMainBis
                                                .user_id,
                                            filteredMainBis.gearset[key]?.name
                                        );
                                        break;
                                }
                            }
                        }
                    }
                });
            } else {
                logger.warn('no allFilteredMainBis');
            }
        } else {
            logger.warn('no allMainBis');
        }

        return fields;
    } catch (error) {
        errorHandler('getEquipmentFields', error);
        return [];
    }
};

const getAllFilteredMainBis = async (
    allMainBis: BisLinksType[],
    userIds: string[]
): Promise<{filteredMainBis: BisLinksType; gearset: Gearset}[]> => {
    const allFilteredMainBis = allMainBis.filter((mainBis) =>
        userIds.includes(mainBis.user_id)
    );
    const allFilteredMainBisWithGearSets: {
        filteredMainBis: BisLinksType;
        gearset: Gearset;
    }[] = [];

    for (const filteredMainBis of allFilteredMainBis) {
        if (filteredMainBis.bis_link) {
        }
        const gearset = await getGearsetWithEquipment(
            SubCommandNames.BY_LINK,
            filteredMainBis.bis_link
        );

        allFilteredMainBisWithGearSets.push({
            filteredMainBis,
            gearset
        });
    }

    return allFilteredMainBisWithGearSets;
};

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
