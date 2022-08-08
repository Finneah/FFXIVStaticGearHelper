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

import {errorHandler} from '../../../handler/error/errorHandler';
import {getEquipmentAll, getGearset} from '../../../handler/etro/etroHandler';

import {getJobIconUrl} from '../../../helper/iconMapper';
import {getRoleColorByJob} from '../../../helper/roleColorMapper/roleColorMapper';
import {EquipType} from '../../../types/equip';
import {GearsetType} from '../../../types/gearset';

import {Command} from '../../Command';
// https://github.com/en3sis/discord-guides/blob/main/examples/htmlToPng.js
export const ShowEtroBisById: Command = {
    name: 'show_bis_by_id',
    description: 'showBisById.description',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'id',
            type: ApplicationCommandOptionType.String,
            description: 'bisIdOption.description',
            required: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            const idOption = interaction.options.data.find(
                (option) => option.name === 'id'
            );
            if (idOption && idOption.value) {
                const gearset = await getGearset(idOption.value.toString());
                console.log('GEARSET', gearset);

                const equip = await getEquipmentAll(gearset);

                console.log('EQUIP', equip);

                const embed = await getEmbedBis(interaction, gearset, equip);
                await interaction.followUp({
                    ephemeral: true,
                    content: 'Test',
                    embeds: embed ? [embed] : undefined
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: Error | any) {
            errorHandler('ShowEtroBisById', error, interaction);
        }
    }
};

const getEmbedBis = async (
    interaction: CommandInteraction<CacheType>,
    gearset: GearsetType,
    equip: EquipType[]
) => {
    const avatar = await interaction.user.avatarURL();
    const jobIconPath = await getJobIconUrl(gearset.jobAbbrev);
    const equipmentFields = getEquipmentFields(equip);
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
            ...equipmentFields,

            {
                name: '\u200b',
                value: '\u200b',
                inline: false
            }
        ]

        // footer: {
        //     text: 'Some footer text here',
        //     icon_url: 'https://xivapi.com/cj/1/whitemage.png'
        // }
    };
    return new EmbedBuilder(embedData);
};

const getEquipmentFields = (equipAll: EquipType[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const fields: EmbedField[] = [
        // {
        //     name: 'Weapon',
        //     value: weapon.name,
        //     inline: true
        // },
    ];

    equipAll.forEach((data) => {
        if (data && data.name) {
            fields.push(
                {
                    name:
                        getIconBySlotName(data.slotName) + ' ' + data.slotName,
                    value: data.name,
                    //  + ' \n Materia blabla \n Materia blabla',
                    inline: false
                }
                // {
                //     name: 'Materia',
                //     value: 'materia',
                //     inline: true
                // },
                // {
                //     name: '\u200b',
                //     value: '\u200b',
                //     inline: false
                // }
            );
        }
    });

    return fields;
};

const getIconBySlotName = (slotName: string) => {
    switch (slotName) {
        case 'weapon':
            return ':dagger:';
        case 'head':
            return ':military_helmet:';
        case 'body':
            return ':military_helmet:';
        case 'hands':
            return ':open_hands:';
        case 'legs':
            return ':mechanical_leg:';
        case 'feet':
            return ':athletic_shoe:';
        case 'ears':
            return ':military_helmet:';
        case 'neck':
            return ':military_helmet:';
        case 'wrist':
            return ':military_helmet:';
        case 'finger':
            return ':military_helmet:';

        default:
            break;
    }
};
