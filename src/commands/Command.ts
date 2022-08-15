import {
    ButtonInteraction,
    ChatInputApplicationCommandData,
    Client,
    CommandInteraction,
    MessageApplicationCommandData
} from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void;
}

export interface ButtonCommand extends MessageApplicationCommandData {
    run: (client: Client, interaction: ButtonInteraction) => void;
}
