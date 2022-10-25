import { ApplicationCommandOptionType, ApplicationCommandType, CacheType, Client, CommandInteraction } from 'discord.js';

import { errorHandler, handleInteractionError } from '../../handler';
import { getGearset } from '../../handler/etroHandler/etroGearset';
import { strings } from '../../locale/i18n';
import { CommandNames, OptionNames } from '../../types';
import { Command } from '../Command';
import { getEtroGearEmbedCommand } from '../getGearsetEmbedCommand';

export const EtroGear: Command = {
    name: CommandNames.ETRO,
    description: strings('showBis.description'),
    type: ApplicationCommandType.ChatInput,
    dmPermission: true,
    options: [
        {
            name: OptionNames.LINK,
            type: ApplicationCommandOptionType.String,
            description: strings('bisLinkOption.description'),
            required: true
        },

        {
            name: OptionNames.CHANNEL,
            type: ApplicationCommandOptionType.Channel,
            description: strings('bisChannelOption.description'),
            required: false
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        try {
            const link = getIdOptionValue(interaction);
            const channelId = getChannelOptionValue(interaction);

            if (link) {
                const {data: gearset} = await getGearset(link);

                if (gearset) {
                    const etroGearContent = await getEtroGearEmbedCommand(
                        interaction,
                        gearset
                    );

                    if (etroGearContent) {
                        if (channelId) {
                            const channel = client.channels.cache.find(
                                (ch) => ch.id === channelId
                            );
                            if (!channel || !channel.isTextBased()) {
                                interaction.followUp({
                                    content:
                                        'Ich kann den Channel nicht finden. Bist du sicher dass es ein Text-Channel ist?',
                                    ephemeral: true
                                });
                            } else {
                                channel.send({
                                    // components:
                                    //     etroGearContent.actionRows ?? undefined,
                                    embeds: etroGearContent.embed
                                        ? [etroGearContent.embed]
                                        : undefined
                                });
                                interaction.deleteReply();
                            }
                        } else {
                            // keine ch id angegeben => ursprüngliche Nachricht löschen
                            interaction.deleteReply();
                        }

                        return interaction.user.send({
                            components: etroGearContent.actionRows ?? undefined,
                            embeds: etroGearContent.embed
                                ? [etroGearContent.embed]
                                : undefined
                        });
                    }
                } else {
                    return handleInteractionError(
                        `${CommandNames.ETRO}`,
                        interaction,
                        'Ich habe das Gearset auf Etro nicht gefunden.'
                    );
                }
            }
            return;
        } catch (error) {
            errorHandler('EtroShow', error);
        }
    }
};

const getIdOptionValue = (
    interaction: CommandInteraction<CacheType>
): string | undefined => {
    const idOption = interaction.options.data.find(
        (option) => option.name === OptionNames.LINK
    );

    if (!idOption?.value) {
        handleInteractionError(
            'EtroShow',
            interaction,
            'Bitte gib einen link an.'
        );
        return undefined;
    }

    return idOption.value.toString();
};

const getChannelOptionValue = (
    interaction: CommandInteraction<CacheType>
): string | undefined => {
    const idOption = interaction.options.data.find(
        (option) => option.name === OptionNames.CHANNEL
    );

    if (!idOption?.value) {
        return undefined;
    }

    return idOption.value.toString();
};
