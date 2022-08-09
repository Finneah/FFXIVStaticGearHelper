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
import {strings} from '../../../locale/i18n';
import {EquipType} from '../../../types/equip';
import {GearsetType} from '../../../types/gearset';

import {Command} from '../../Command';
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
                console.log(gearset);

                if (gearset) {
                    const equip = await getEquipmentAll(gearset);

                    const embed = await getEmbedBis(
                        interaction,
                        gearset,
                        equip
                    );

                    await interaction.followUp({
                        ephemeral: true,

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

const getEquipmentFields = (equipAll: EquipType[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const fields: EmbedField[] = [];

    equipAll.forEach((data) => {
        if (data && data.name) {
            fields.push(
                {
                    // getIconBySlotName(data.slotName) + ' ' +
                    name:
                        getIconBySlotName(data.slotName) +
                        ' ' +
                        data.slotName.toUpperCase(),
                    value: `${data.name} \n\n **Materia** \n CRT+36 CRT+36`,
                    inline: false
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false
                }
            );
        }
    });

    return fields;
};

const getIconBySlotName = (slotName: string) => {
    switch (slotName) {
        case 'weapon':
            return ':dagger:';
        case 'offhand':
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

const linkIsValid = (link: string | number | true): boolean => {
    if (typeof link === 'string') {
        const regex = /^https:\/\/etro.gg\/gearset\/.+$/gm;
        return regex.exec(link) !== null ?? false;
    }
    return false;
};
