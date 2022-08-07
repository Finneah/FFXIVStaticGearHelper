import {
    APIEmbed,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Client,
    CommandInteraction,
    EmbedBuilder,
    EmbedData,
    EmbedField,
    resolveColor
} from 'discord.js';
import {t} from 'i18next';
import {
    getEquipmentAll,
    GetEquipment,
    getGearset
} from '../../../helper/etroHandler';
import {getJobIconUrl} from '../../../helper/iconMapper';
import {getRoleColorByJob} from '../../../helper/roleColorMapper/roleColorMapper';

import {Command} from '../../Command';
// https://github.com/en3sis/discord-guides/blob/main/examples/htmlToPng.js
export const ShowEtroBisById: Command = {
    name: 'show_bis',
    description: t('showBisById.description'),
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'id',
            type: ApplicationCommandOptionType.String,
            description: t('bisIdOption.description'),
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
                const jobIconPath = await getJobIconUrl(gearset.jobAbbrev);
                const avatar = await interaction.user.avatarURL();

                const equipAll = await getEquipmentAll([
                    gearset.weapon,
                    gearset.offHand,
                    gearset.head,
                    gearset.body,
                    gearset.hands,
                    gearset.legs,
                    gearset.feet,
                    gearset.ears,
                    gearset.neck,
                    gearset.wrists,
                    gearset.fingerL,
                    gearset.fingerR
                ]);
                if (equipAll) {
                    const equipmentFields = getEquipmentFields(
                        equipAll as unknown as GetEquipment[]
                    );
                    const embedData: EmbedData | APIEmbed = {
                        color: resolveColor(
                            getRoleColorByJob(gearset.jobAbbrev)
                        ),
                        title: gearset.name,
                        url: 'https://etro.gg/gearset/' + gearset.id,
                        author: {
                            name: interaction.user.username,
                            icon_url: avatar ?? ''
                        },
                        // description: 'Some description here',
                        thumbnail: {
                            url: jobIconPath
                        },

                        fields: [
                            ...equipmentFields

                            // {
                            //     name: '\u200b',
                            //     value: '\u200b',
                            //     inline: false
                            // },
                        ]

                        // footer: {
                        //     text: 'Some footer text here',
                        //     icon_url: 'https://xivapi.com/cj/1/whitemage.png'
                        // }
                    };
                    const exampleEmbed = new EmbedBuilder(embedData);

                    await interaction.followUp({
                        ephemeral: true,

                        embeds: [exampleEmbed]
                    });
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log('ERROR', error);

            return interaction.followUp(
                t('error.general', {details: error.message})
            );
        }
    }
};

const getEquipmentFields = (equipAll: GetEquipment[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const fields: EmbedField[] = [
        // {
        //     name: 'Weapon',
        //     value: weapon.name,
        //     inline: true
        // },
    ];

    equipAll.forEach((e) => {
        if (e.value && e.value.name) {
            fields.push(
                {
                    name:
                        getIconBySlotName(e.value.slotName) +
                        ' ' +
                        e.value.slotName,
                    value: e.value.name,
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
