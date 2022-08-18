import {
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonInteraction,
    CacheType,
    Client,
    CommandInteraction,
    Interaction
} from 'discord.js';
import {ButtonCommands, Commands} from '../commands/Commands';
import {getEmbedBis} from '../commands/handleGetGearsetEmbedCommand';
import {getBisByUser} from '../database/actions/bestInSlot/getBisFromUser';
import {getGearset} from '../handler';
import Logger from '../logger';
import {CommandNames, SubCommandNames} from '../types';
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
    const buttonCommand = ButtonCommands.find((c) => {
        if (
            interaction.customId.startsWith('editbis_') &&
            c.name === 'editbis'
        ) {
            return c;
        }
    });

    if (!buttonCommand) {
        logger.error(
            'ButtonCommand ' + interaction.customId + ' does not exist'
        );
        return;
    }

    await interaction.deferUpdate();

    buttonCommand.run(client, interaction);
};
