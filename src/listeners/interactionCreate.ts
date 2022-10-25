import { AutocompleteInteraction, ButtonInteraction, CacheType, Client, CommandInteraction, Interaction } from 'discord.js';

import { ButtonCommand } from '../commands/Command';
import { ButtonCommands, SlashCommands } from '../commands/Commands';
import Logger from '../logger';
import { ButtonCommandNames, CommandNames } from '../types';

const logger = Logger.child({module: 'interactionCreate'});

export default (client: Client): void => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        }

        if (interaction.isAutocomplete()) {
            await handleAutocomplete(client, interaction);
        }
        if (interaction.isButton()) {
            await handleButtonCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (
    client: Client,
    interaction: CommandInteraction
): Promise<void> => {
    const slashCommand = SlashCommands.find(
        (c) => c.name === interaction.commandName
    );

    if (!slashCommand) {
        logger.error(
            'SlashCommand ' + interaction.commandName + ' does not exist'
        );
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};

/**
 * @description set Values for Autocomplete on slash command /mybis get
 * @param client
 * @param interaction
 */
const handleAutocomplete = async (
    client: Client<boolean>,
    interaction: AutocompleteInteraction<CacheType>
) => {
    if (
        interaction.commandName === CommandNames.MYBIS ||
        interaction.commandName === CommandNames.SETSTATICGEAR
    ) {
        const focusedValue = interaction.options.getFocused();
        // const allSavedBis = await getAllBisByUserByGuild(
        //     interaction.user.id,
        //     interaction.guildId ?? ''
        // );

        // if (allSavedBis && allSavedBis.length > 0) {
        //     const filtered = allSavedBis.filter((savedBis) =>
        //         savedBis.bis_name.startsWith(focusedValue)
        //     );
        //     await interaction.respond(
        //         filtered.map((savedBis) => ({
        //             name: savedBis.bis_name,
        //             value: savedBis.bis_name
        //         }))
        //     );
        // }
    }
};

const handleButtonCommand = async (
    client: Client,
    interaction: ButtonInteraction<CacheType>
): Promise<void> => {
    let buttonCommand: ButtonCommand | undefined = undefined;
    console.log(interaction.customId + ' implemented?');
    if (interaction.customId.startsWith('static_overview_')) {
        buttonCommand = ButtonCommands.find(
            (c) => c.name === ButtonCommandNames.EDITBISOVERVIEW
        );
    } else if (
        interaction.customId.startsWith(ButtonCommandNames.EDITBIS + '_')
    ) {
        buttonCommand = ButtonCommands.find(
            (c) => c.name === ButtonCommandNames.EDITBIS
        );
    } else if (
        interaction.customId.startsWith(ButtonCommandNames.DELETE_BIS + '_')
    ) {
        buttonCommand = ButtonCommands.find(
            (c) => c.name === ButtonCommandNames.DELETE_BIS
        );
    } else {
        switch (interaction.customId) {
            case ButtonCommandNames.CONFIG_OVERRIDE:
                buttonCommand = ButtonCommands.find(
                    (c) => c.name === ButtonCommandNames.CONFIG_OVERRIDE
                );
                break;
            case ButtonCommandNames.CANCEL:
                buttonCommand = ButtonCommands.find(
                    (c) => c.name === ButtonCommandNames.CANCEL
                );
                break;
            case ButtonCommandNames.MATERIALIST:
                buttonCommand = ButtonCommands.find(
                    (c) => c.name === ButtonCommandNames.MATERIALIST
                );
                break;
            default:
                console.log(interaction.customId + ' not implemented');
                break;
        }
    }

    if (!buttonCommand) {
        logger.error(
            'ButtonCommand ' + interaction.customId + ' does not exist'
        );
        return;
    }

    await interaction.deferUpdate();

    buttonCommand.run(client, interaction);
};
