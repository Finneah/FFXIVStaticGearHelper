import {Command} from './Command';
import {ConfigureBotForGuild} from './slashCommands/ConfigureBotForGuild';
import {Poll} from './slashCommands/Poll';
import {ShowEtroBis} from './slashCommands/ShowEtroBis';

export const Commands: Command[] = [ShowEtroBis, ConfigureBotForGuild, Poll];

// export const ButtonCommands: ButtonCommand[] = [
//     ButtonTest,
//     ButtonOverrideConfig
// ];
