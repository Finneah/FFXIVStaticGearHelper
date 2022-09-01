import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    Client,
    CommandInteraction
} from 'discord.js';
import {setGuildMessageId} from '../../database';
import {getGuildConfig} from '../../database/actions/guildConfig/getGuildConfig';
import {GearTypes} from '../../database/types/DataType';

import {
    errorHandler,
    handleInteractionError
} from '../../handler/errorHandler/errorHandler';
import {strings} from '../../locale/i18n';

import {ButtonCommandNames, CommandNames} from '../../types';
import {getIconBySlotName} from '../../utils';
import {checkPermission} from '../../utils/permissions';

import {Command} from '../Command';
import {getEmbedStaticOverview} from '../getEmbedStaticOverview';

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

            const embed = await getEmbedStaticOverview(
                client,
                interaction,
                guildConfig
            );
            const actionRows = getActionRows();
            const message = await interaction.followUp({
                ephemeral: false,
                components: actionRows,
                embeds: [embed]
            });

            setGuildMessageId(message.id, guildConfig.guild_id);
            return message;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error) {
            errorHandler('StaticOverview', error);
        }
    }
};

const getActionRows = (): ActionRowBuilder<ButtonBuilder>[] => {
    const gearArray: {slotName: string}[] = [];
    const geartypes = Object.values(GearTypes);

    for (let i = 0; i < geartypes.length; i++) {
        const gear = geartypes[i];

        gearArray.push({
            slotName: gear
        });
    }

    const actionRows = getActionRowWithButtons([], gearArray, 0);
    const button = new ButtonBuilder()
        .setCustomId(
            CommandNames.STATICOVERVIEW + '_' + ButtonCommandNames.REFRESH
        )
        .setLabel(strings(ButtonCommandNames.REFRESH))
        .setStyle(3);
    // .setEmoji('🔃');

    actionRows[actionRows.length - 1].addComponents(button);
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
    gearArray: {slotName: string}[],
    index: number
): ActionRowBuilder<ButtonBuilder>[] => {
    if (index > gearArray.length) {
        return rows;
    }

    // if initial or bottonCount %5 === 0 => createRow
    if (index === 0 || index % 5 === 0) {
        const row: ActionRowBuilder<ButtonBuilder> =
            new ActionRowBuilder<ButtonBuilder>();
        let buttonCount = row.components.length;
        let i = index;
        while (buttonCount < 5) {
            addButtonComponent(gearArray[i], row);
            i++;
            buttonCount++;
        }

        rows.push(row);
        index = i;
    }

    return getActionRowWithButtons(rows, gearArray, index++);
};

const addButtonComponent = (
    gear: {slotName: string},
    row: ActionRowBuilder<ButtonBuilder>
): void => {
    if (gear?.slotName) {
        const isLeftRing =
            gear.slotName.indexOf('_l') !== 0 &&
            gear.slotName.indexOf('_l') !== -1;
        const isRightRing =
            gear.slotName.indexOf('_r') !== 0 &&
            gear.slotName.indexOf('_r') !== -1;

        const ringPrefix = isLeftRing ? '_l' : isRightRing ? '_r' : undefined;
        const button = new ButtonBuilder()
            .setCustomId(
                CommandNames.STATICOVERVIEW +
                    '_' +
                    (ringPrefix ? gear.slotName + ringPrefix : gear.slotName)
            )
            .setLabel((ringPrefix && strings(ringPrefix)) ?? ' ')
            .setStyle(2)
            .setEmoji(getIconBySlotName(gear.slotName));

        row.addComponents(button);
    }
};
