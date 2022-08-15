import {
    CommandInteraction,
    CacheType,
    EmbedData,
    APIEmbed,
    resolveColor,
    EmbedBuilder,
    EmbedField
} from 'discord.js';
import {errorHandler, getGearset} from '../handler';
import {strings} from '../locale/i18n';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Equipment, ErrorType, Gearset, MateriaType} from '../types';
import {getJobIconUrl, getRoleColorByJob} from '../utils';

export const handleGetGearsetEmbedCommand = async (
    by: 'by_id' | 'by_link',
    value: string,
    interaction: CommandInteraction<CacheType>
) => {
    try {
        const gearset = await getGearset(by, value);

        if (gearset) {
            const embed = await getEmbedBis(gearset, interaction);

            await interaction.followUp({
                ephemeral: false,
                // content: 'finished',
                // components: await getComponents(
                //     hasPermission,
                //     guildConfig
                // ),
                embeds: embed ? [embed] : undefined
            });
        }
    } catch (error: ErrorType) {
        errorHandler('handleGetGearsetEmbedCommand', error, interaction);
    }
};

const getEmbedBis = async (
    gearset: Gearset,
    interaction: CommandInteraction<CacheType>
) => {
    const avatar = await interaction.user.avatarURL();
    const jobIconPath = await getJobIconUrl(gearset.jobAbbrev);
    const equipmentFields = getEquipmentFields(gearset, interaction);
    const embedData: EmbedData | APIEmbed = {
        color: resolveColor(getRoleColorByJob(gearset.jobAbbrev)),
        title: gearset.name,
        url: 'https://etro.gg/gearset/' + gearset.id,
        author: {
            name: interaction.user.username,
            icon_url: avatar ?? ''
        },
        // description: 'Some description here',
        thumbnail: jobIconPath
            ? {
                  url: jobIconPath
              }
            : undefined,

        fields: [
            {
                name: '\u200b',
                value: '\u200b',
                inline: false
            },
            ...equipmentFields
        ],
        footer: {
            text: `${gearset.food.name}`,
            icon_url: 'https://etro.gg/s/icons' + gearset.food.iconPath
        }
    };
    return new EmbedBuilder(embedData);
};

const getEquipmentFields = (
    gearset: Gearset,
    interaction: CommandInteraction<CacheType> | undefined
) => {
    const fields: EmbedField[] = [];
    try {
        if (gearset.weapon) {
            if (gearset.offHand && typeof gearset.offHand === 'object') {
                fields.push(
                    getFieldForEquip(gearset.weapon, gearset.materia),
                    getFieldForEquip(gearset.offHand, gearset.materia),
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false
                    }
                );
            } else {
                fields.push(
                    getFieldForEquip(gearset.weapon, gearset.materia, false),
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false
                    }
                );
            }
        }
        if (
            gearset.head &&
            gearset.body &&
            gearset.hands &&
            gearset.legs &&
            gearset.feet &&
            gearset.ears &&
            gearset.neck &&
            gearset.wrists &&
            gearset.fingerL &&
            gearset.fingerR
        ) {
            fields.push(
                getFieldForEquip(gearset.head, gearset.materia),
                getFieldForEquip(gearset.body, gearset.materia),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                getFieldForEquip(gearset.hands, gearset.materia),
                getFieldForEquip(gearset.legs, gearset.materia),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                getFieldForEquip(gearset.feet, gearset.materia),
                getFieldForEquip(gearset.ears, gearset.materia),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                getFieldForEquip(gearset.neck, gearset.materia),
                getFieldForEquip(gearset.wrists, gearset.materia),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                getFieldForEquip(gearset.fingerL, gearset.materia, true, 'L'),
                getFieldForEquip(gearset.fingerR, gearset.materia, true, 'R'),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                }
            );
        }

        return fields;
    } catch (error: ErrorType) {
        errorHandler('getEquipmentFields', error, interaction);
        return [];
    }
};

const getFieldForEquip = (
    equip: Equipment,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materia: any,
    inline = true,
    ringPrefix?: 'L' | 'R'
): EmbedField => {
    const materiaString = getMateriaString(equip, materia, ringPrefix);
    const value = `${equip.name}`;
    /**
     *  \n*${strings('itemLevel')} ${
        equip.itemLevel
    }*
     */
    const field: EmbedField = {
        name: `${getIconBySlotName(equip.slotName)} ${strings(equip.slotName)}`,
        value:
            materiaString !== ''
                ? `${value} \n\n **Materia** \n${materiaString}`
                : `${value}`,
        inline: inline ?? false
    };
    return field;
};

const getMateriaString = (
    equip: Equipment,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materia: any,
    ringPrefix?: 'L' | 'R'
) => {
    const equipMateria: MateriaType =
        ringPrefix && materia[equip.id + ringPrefix]
            ? materia[equip.id + ringPrefix]
            : materia[equip.id];
    let materiaString = '';
    if (equipMateria) {
        Object.values(equipMateria).forEach((m) => {
            materiaString += m.type + '+' + m.value + '\n';
        });
    }

    return materiaString;
};

const getIconBySlotName = (slotName: string) => {
    switch (slotName) {
        case 'weapon':
            return ':dagger:';
        case 'offHand':
            return ':shield:';
        case 'head':
            return ':military_helmet:';
        case 'body':
            return ':lab_coat:';
        case 'hands':
            return ':gloves:';
        case 'legs':
            return ':jeans:';
        case 'feet':
            return ':athletic_shoe:';
        case 'ears':
            return ':ear_with_hearing_aid:';
        case 'neck':
            return ':scarf:';
        case 'wrists':
            return ':watch:';
        case 'finger':
            return ':ring:';

        default:
            return '';
    }
};
