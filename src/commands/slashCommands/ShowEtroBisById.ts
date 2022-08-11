import {
    APIEmbed,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CacheType,
    Client,
    CommandInteraction,
    EmbedBuilder,
    EmbedData,
    EmbedField,
    resolveColor
} from 'discord.js';
import {errorHandler, getGearset} from '../../handler';
import {strings} from '../../locale/i18n';
import {Equipment} from '../../types';
import {Gearset, Materia, MateriaType} from '../../types/gearset/gearset';
import {getJobIconUrl, getRoleColorByJob} from '../../utils';

import {Command} from '../Command';
// https://github.com/en3sis/discord-guides/blob/main/examples/htmlToPng.js
export const ShowEtroBisById: Command = {
    name: 'show_bis_by_id',
    description: strings('showBisById.description'),
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'id',
            type: ApplicationCommandOptionType.String,
            description: strings('bisIdOption.description'),
            required: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            const idOption = interaction.options.data.find(
                (option) => option.name === 'id'
            );

            if (idOption && idOption.value) {
                const gearset = await getGearset(
                    idOption.value.toString(),
                    interaction
                );

                if (gearset) {
                    const embed = await getEmbedBis(interaction, gearset);

                    await interaction.followUp({
                        ephemeral: true,
                        // content: 'finished'
                        embeds: embed ? [embed] : undefined
                    });
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('ShowEtroBisById', error, interaction);
        }
    }
};

const getEmbedBis = async (
    interaction: CommandInteraction<CacheType>,
    gearset: Gearset
) => {
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

        // footer: {
        //     text: 'Some footer text here',
        //     icon_url: 'https://xivapi.com/cj/1/whitemage.png'
        // }
    };
    return new EmbedBuilder(embedData);
};

const getEquipmentFields = (gearset: Gearset) => {
    const fields: EmbedField[] = [];
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (gearset.weapon) {
            if (gearset.offHand) {
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

        fields.push(getFieldForFood());

        return fields;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        errorHandler('getEquipmentFields', error);
        return fields;
    }
};

const getFieldForEquip = (
    equip: Equipment,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    materia: any,
    inline = true,
    ringPrefix?: 'L' | 'R'
): EmbedField => {
    // console.log(materia);
    const equipMateria: MateriaType =
        ringPrefix && materia[equip.id + ringPrefix]
            ? materia[equip.id + ringPrefix]
            : materia[equip.id];
    console.log(equip.name, 'EQUIPID', equip.id, 'MATERIA', equipMateria);
    console.log();
    let materiaString = '';
    Object.values(equipMateria).forEach((m) => {
        materiaString += m.type + '+' + m.value + '\n';
    });
    const field: EmbedField = {
        name: getIconBySlotName(equip.slotName) + ' ' + strings(equip.slotName),
        value:
            materiaString !== ''
                ? `${equip.name} \n\n **Materia** \n ${materiaString}`
                : `${equip.name}`,
        inline: inline ?? false
    };
    return field;
};

const getFieldForFood = () => {
    return {
        // getIconBySlotName(data.slotName) + ' ' +
        name: ':hamburger:' + ' ' + strings('Food'),
        value: `irgend ein food`,
        inline: false
    };
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
