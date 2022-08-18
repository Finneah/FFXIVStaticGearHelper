import {
    AutocompleteInteraction,
    ButtonInteraction,
    CacheType,
    Client,
    CommandInteraction,
    Interaction
} from 'discord.js';
import {ConfigCancel} from '../commands/buttonCommands/ConfigCancel';
import {ConfigOverride} from '../commands/buttonCommands/ConfigOverride';
import {DeleteBis} from '../commands/buttonCommands/DeleteBis';
import {EditBis} from '../commands/buttonCommands/EditBis';

import {ButtonCommand} from '../commands/Command';
import {Commands} from '../commands/Commands';
import {getBisByUser} from '../database/actions/bestInSlot/getBisFromUser';
import Logger from '../logger';
import {ButtonCommandNames, CommandNames} from '../types';
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
    const slashCommand = Commands.find(
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

const handleAutocomplete = async (
    client: Client<boolean>,
    interaction: AutocompleteInteraction<CacheType>
) => {
    if (interaction.commandName === CommandNames.BESTINSLOT) {
        const focusedValue = interaction.options.getFocused();
        const savedBis = await getBisByUser(interaction.user.id);
        const choices: string[] = [];

        if (savedBis) {
            savedBis.forEach((sBis) => {
                choices.push(sBis.bis_name);
            });

            if (choices.length > 0) {
                const filtered = choices.filter((choice) =>
                    choice.startsWith(focusedValue)
                );
                await interaction.respond(
                    filtered.map((choice) => ({name: choice, value: choice}))
                );
            }
        }
    }
};

const handleButtonCommand = async (
    client: Client,
    interaction: ButtonInteraction<CacheType>
): Promise<void> => {
    let buttonCommand: ButtonCommand | undefined = undefined;
    if (interaction.customId.startsWith('editbis_')) {
        buttonCommand = EditBis;
    } else if (
        interaction.customId.startsWith(ButtonCommandNames.DELETE_BIS + '_')
    ) {
        buttonCommand = DeleteBis;
    } else {
        switch (interaction.customId) {
            case ButtonCommandNames.CONFIG_OVERRIDE:
                buttonCommand = ConfigOverride;
                break;
            case ButtonCommandNames.CONFIG_CANCEL:
                buttonCommand = ConfigCancel;
                break;

            default:
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
