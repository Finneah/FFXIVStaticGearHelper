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
import {DBBis} from '../api/database/types/DBTypes';
import {ApiHandler} from '../api/dataHandler';
import {errorHandler, handleInteractionError} from '../handler';
import {strings} from '../locale/i18n';
import {SGHEquipment, SGHGearset} from '../redux/guilds/guilds.types';

import {ButtonCommandNames} from '../types';
import {getIconBySlotName, getJobIconUrl, getRoleColorByJob} from '../utils';
const api = new ApiHandler();

export const getGearsetEmbedCommand = async (
    link: string,
    interaction: CommandInteraction<CacheType>,
    bis?: DBBis,
    hasPermission?: boolean
): Promise<Message<boolean>> => {
    try {
        const gearset = await api.getGearset(link);

        if (!gearset) {
            return handleInteractionError(
                'getGearsetEmbedCommand',
                interaction,
                'Ich habe das Gearset auf Etro nicht gefunden.'
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
    gearset: SGHGearset,
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
        ]
    };
    if (gearset.food) {
        embedData.footer = {
            text: `${gearset.food.name}`,
            icon_url: 'https://etro.gg/s/icons' + gearset.food.iconPath
        };
    }
    return new EmbedBuilder(embedData);
};

/**
 * @description tbd
 * @param gearset
 * @returns EmbedField[]
 */
const getEquipmentFields = (gearset: SGHGearset): EmbedField[] => {
    const fields: EmbedField[] = [];
    try {
        if (gearset.weapon) {
            if (gearset.offHand && typeof gearset.offHand === 'object') {
                fields.push(
                    getFieldForEquip(gearset.weapon),
                    getFieldForEquip(gearset.offHand),
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false
                    }
                );
            } else {
                fields.push(getFieldForEquip(gearset.weapon, false), {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                });
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
                getFieldForEquip(gearset.head),
                getFieldForEquip(gearset.body),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                getFieldForEquip(gearset.hands),
                getFieldForEquip(gearset.legs),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                getFieldForEquip(gearset.feet),
                getFieldForEquip(gearset.ears),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                getFieldForEquip(gearset.neck),
                getFieldForEquip(gearset.wrists),
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                },
                getFieldForEquip(gearset.fingerL, true),
                getFieldForEquip(gearset.fingerR, true),
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
    equip: SGHEquipment,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inline = true
): EmbedField => {
    const materiaString = getMateriaString(equip);
    const value = `${equip.equipment_name}`;

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

const getMateriaString = (equip: SGHEquipment): string => {
    let materiaString = '';
    if (equip.materia_1) {
        materiaString +=
            equip.materia_1.type + '+' + equip.materia_1.value + '\n';
        if (equip.materia_2) {
            materiaString +=
                equip.materia_2.type + '+' + equip.materia_2.value + '\n';

            if (equip.materia_3 && equip.materia_4 && equip.materia_5) {
                materiaString +=
                    equip.materia_3.type + '+' + equip.materia_3.value + '\n';

                materiaString +=
                    equip.materia_4.type + '+' + equip.materia_4.value + '\n';
                materiaString +=
                    equip.materia_5.type + '+' + equip.materia_5.value + '\n';
            }
        }
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
    gearset: SGHGearset,
    bis: DBBis
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
