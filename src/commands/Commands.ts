import {Command} from './Command';
import {BestInSlot} from './slashCommands/BestInSlot';
import {ConfigureBotForGuild} from './slashCommands/ConfigureBotForGuild';

import {ShowEtroBis} from './slashCommands/ShowEtroBis';

export const Commands: Command[] = [
    ShowEtroBis,
    ConfigureBotForGuild,
    BestInSlot
];

// export const ButtonCommands: ButtonCommand[] = [
//     ButtonTest,
//     ButtonOverrideConfig
// ];
