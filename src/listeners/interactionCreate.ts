import {Client, CommandInteraction, Interaction} from 'discord.js';
import {Commands} from '../commands/Commands';

export default (client: Client): void => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
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
