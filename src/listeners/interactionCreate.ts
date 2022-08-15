import {
    AutocompleteInteraction,
    CacheType,
    Client,
    CommandInteraction,
    Interaction
} from 'discord.js';
import {Commands} from '../commands/Commands';
import {getBisByUser} from '../database/actions/bestInSlot/getBisFromUser';

export default (client: Client): void => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        }

        if (interaction.isAutocomplete()) {
            await handleAutocomplete(client, interaction);
        }
        // if (interaction.isButton()) {
        //     await handleButtonCommand(client, interaction);
        // }
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
        interaction.followUp({content: 'An error has occurred'});
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};

const handleAutocomplete = async (
    client: Client<boolean>,
    interaction: AutocompleteInteraction<CacheType>
) => {
    if (interaction.commandName === 'my_bis') {
        const focusedValue = interaction.options.getFocused();
        const savedBis = await getBisByUser(interaction.user.id);
        const choices: string[] = [];
        if (savedBis) {
            savedBis.forEach((sBis) => {
                console.log('HERE', sBis.bis_name);
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

// const handleButtonCommand = async (
//     client: Client,
//     interaction: ButtonInteraction<CacheType>
// ): Promise<void> => {
//     const buttonCommand = ButtonCommands.find(
//         (c) => c.name === interaction.customId
//     );

//     if (!buttonCommand) {
//         interaction.followUp({content: 'An error has occurred'});
//         return;
//     }

//     await interaction.deferUpdate();

//     buttonCommand.run(client, interaction);
// };
