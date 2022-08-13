import {Command} from './Command';
import {ConfigureBotForGuild} from './slashCommands/ConfigureBotForGuild';
import {ShowEtroBis} from './slashCommands/ShowEtroBis';
import {Test} from './slashCommands/Test';

export const Commands: Command[] = [ShowEtroBis, ConfigureBotForGuild, Test];

// export const ButtonCommands: ButtonCommand[] = [
//     ButtonTest,
//     ButtonOverrideConfig
// ];
