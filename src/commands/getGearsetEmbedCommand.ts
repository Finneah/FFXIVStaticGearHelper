import {
    CommandInteraction,
    CacheType,
    EmbedData,
    APIEmbed,
    resolveColor,
    EmbedBuilder,
    EmbedField,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonInteraction,
    Message
} from 'discord.js';
import {BisLinksType} from '../database/types/DataType';
import {errorHandler, getGearset, handleInteractionError} from '../handler';
import {strings} from '../locale/i18n';

import {
    ButtonCommandNames,
    Equipment,
    Gearset,
    MateriaType,
    SubCommandNames
} from '../types';
import {getIconBySlotName, getJobIconUrl, getRoleColorByJob} from '../utils';

/**
 * @description get the gearset embed content
 * @param by
 * @param value
 * @param interaction
 * @param bis
 * @param hasPermission
 * @returns Promise<Message<boolean>>
 */
export const getGearsetEmbedCommand = async (
    by: SubCommandNames.BY_LINK | SubCommandNames.BY_ID,
    value: string,
    interaction: CommandInteraction<CacheType>,
    bis?: BisLinksType,
    hasPermission?: boolean
): Promise<Message<boolean>> => {
    try {
        const gearset = await getGearset(by, value);

        if (!gearset) {
            return handleInteractionError(
                'getGearsetEmbedCommand',
                interaction,
                strings('error.coruptInteraction')
            );
        }

        const embed = await getEmbedBis(gearset, interaction);

        if (bis && hasPermission && gearset) {
            const actionRows = getActionRowsForEditBis(gearset, bis);
            return interaction.followUp({
                ephemeral: false,
                components: actionRows,
                embeds: embed ? [embed] : undefined
            });
        } else {
            return interaction.followUp({
                ephemeral: false,
                embeds: embed ? [embed] : undefined
            });
        }
    } catch (error) {
        return interaction.followUp({
            ephemeral: true,
            content: errorHandler('handleGetGearsetEmbedCommand', error)
        });
    }
};

/**
 * @description tbd
 * @param gearset
 * @param interaction
 * @returns  Promise<EmbedBuilder>
 */
export const getEmbedBis = async (
    gearset: Gearset,
    interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>
): Promise<EmbedBuilder> => {
    const avatar = await interaction.user.avatarURL();
    const jobIconPath = await getJobIconUrl(gearset.jobAbbrev);
    const equipmentFields = getEquipmentFields(gearset);
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

/**
 * @description tbd
 * @param gearset
 * @returns EmbedField[]
 */
const getEquipmentFields = (gearset: Gearset): EmbedField[] => {
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
                getFieldForEquip(gearset.fingerL, gearset.materia, true, '_l'),
                getFieldForEquip(gearset.fingerR, gearset.materia, true, '_r'),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                }
            );
        }

        return fields;
    } catch (error) {
        errorHandler('getEquipmentFields', error);
        return [];
    }
};

/**
 * @description tbd
 * @param equip
 * @param materia
 * @param inline
 * @param ringPrefix
 * @returns EmbedField
 */
const getFieldForEquip = (
    equip: Equipment,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materia: any,
    inline = true,
    ringPrefix?: '_l' | '_r'
): EmbedField => {
    const materiaString = getMateriaString(equip, materia, ringPrefix);
    const value = `${equip.name}`;

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

/**
 * @description tbd
 * @param equip
 * @param materia
 * @param ringPrefix
 * @returns string
 */
const getMateriaString = (
    equip: Equipment,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materia: any,
    ringPrefix?: '_l' | '_r'
): string => {
    const prefix =
        ringPrefix === '_l' ? 'L' : ringPrefix === '_r' ? 'R' : undefined;
    const equipMateria: MateriaType =
        prefix && materia[equip.id + prefix]
            ? materia[equip.id + prefix]
            : materia[equip.id];
    let materiaString = '';
    if (equipMateria) {
        Object.values(equipMateria).forEach((m) => {
            materiaString += m.type + '+' + m.value + '\n';
        });
    }

    return materiaString;
};

/**
 * @description tbd
 * @param gear
 * @param bis_name
 * @param row
 * @param ringPrefix
 */
const addButtonComponent = (
    gear: {slotName: string; looted: boolean},
    bis_name: string,
    row: ActionRowBuilder<ButtonBuilder>,
    ringPrefix?: '_l' | '_r'
): void => {
    const label = gear?.looted ? '✔️' : '❌';

    if (gear?.slotName) {
        const button = new ButtonBuilder()
            .setCustomId(
                ButtonCommandNames.EDITBIS +
                    '_' +
                    (ringPrefix ? gear.slotName + ringPrefix : gear.slotName) +
                    '_' +
                    bis_name
            )
            .setLabel(((ringPrefix && strings(ringPrefix)) ?? ' ') + label)
            .setStyle(gear?.looted ? 3 : 2)
            .setEmoji(getIconBySlotName(gear.slotName));

        row.addComponents(button);
    }
};

/**
 * @description tbd
 * @param gearset
 * @param bis
 * @returns ActionRowBuilder<ButtonBuilder>[]
 */
export const getActionRowsForEditBis = (
    gearset: Gearset,
    bis: BisLinksType
): ActionRowBuilder<ButtonBuilder>[] => {
    const gearArray: {slotName: string; looted: boolean}[] = [];

    gearset.weapon &&
        gearArray.push({
            slotName: gearset.weapon.slotName,
            looted: bis.weapon === true ? true : false
        });

    if (gearset.offHand) {
        gearArray.push({
            slotName: gearset.offHand.slotName,
            looted: bis.offHand === true ? true : false
        });
    }
    gearset.head &&
        gearArray.push({
            slotName: gearset.head.slotName,
            looted: bis.head === true ? true : false
        });
    gearset.body &&
        gearArray.push({
            slotName: gearset.body.slotName,
            looted: bis.body === true ? true : false
        });
    gearset.hands &&
        gearArray.push({
            slotName: gearset.hands.slotName,
            looted: bis.hands === true ? true : false
        });
    gearset.legs &&
        gearArray.push({
            slotName: gearset.legs.slotName,
            looted: bis.legs === true ? true : false
        });
    gearset.feet &&
        gearArray.push({
            slotName: gearset.feet.slotName,
            looted: bis.feet === true ? true : false
        });
    gearset.ears &&
        gearArray.push({
            slotName: gearset.ears.slotName,
            looted: bis.ears === true ? true : false
        });
    gearset.neck &&
        gearArray.push({
            slotName: gearset.neck.slotName,
            looted: bis.neck === true ? true : false
        });
    gearset.wrists &&
        gearArray.push({
            slotName: gearset.wrists.slotName,
            looted: bis.wrists === true ? true : false
        });

    gearset.fingerL &&
        gearArray.push({
            slotName: gearset.fingerL.slotName,
            looted: bis.finger_l === true ? true : false
        });
    gearset.fingerR &&
        gearArray.push({
            slotName: gearset.fingerR.slotName,
            looted: bis.finger_r === true ? true : false
        });

    const actionRows = getActionRowWithButtons([], gearArray, bis.bis_name, 0);

    return actionRows;
};

/**
 * @description tbd
 * @param rows
 * @param gearArray
 * @param bis_name
 * @param index
 * @returns ActionRowBuilder<ButtonBuilder>[]
 */
const getActionRowWithButtons = (
    rows: ActionRowBuilder<ButtonBuilder>[],
    gearArray: {slotName: string; looted: boolean}[],
    bis_name: string,
    index: number
): ActionRowBuilder<ButtonBuilder>[] => {
    if (index > gearArray.length) {
        const lastRow = rows[rows.length - 1].components;
        if (lastRow.length < 5) {
            // push settings
            const settingsButton = new ButtonBuilder()
                .setCustomId(ButtonCommandNames.DELETE_BIS + '_' + bis_name)
                .setLabel(strings('delete'))
                .setStyle(4);
            // .setEmoji('⚙️');
            lastRow.push(settingsButton);
        } else {
            // create new row push settings
        }
        return rows;
    }

    // if initial or bottonCount %5 === 0 => createRow
    if (index === 0 || index % 5 === 0) {
        const row: ActionRowBuilder<ButtonBuilder> =
            new ActionRowBuilder<ButtonBuilder>();
        let buttonCount = row.components.length;
        let i = index;
        while (buttonCount < 5) {
            addButtonComponent(
                gearArray[i],
                bis_name,
                row,
                i == gearArray.length - 2
                    ? '_l'
                    : i == gearArray.length - 1
                    ? '_r'
                    : undefined
            );
            i++;
            buttonCount++;
        }

        rows.push(row);
        index = i;
    }

    return getActionRowWithButtons(rows, gearArray, bis_name, index++);
};
