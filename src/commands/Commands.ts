import {EditBis} from './buttonCommands/editBis';
import {ButtonCommand, Command} from './Command';
import {BestInSlot} from './slashCommands/BestInSlot';
import {ConfigureBotForGuild} from './slashCommands/ConfigureBotForGuild';

import {ShowEtroBis} from './slashCommands/ShowEtroBis';
import {Test} from './slashCommands/Test';

export const Commands: Command[] = [
    ShowEtroBis,
    ConfigureBotForGuild,
    BestInSlot,
    Test
];

export const ButtonCommands: ButtonCommand[] = [
    EditBis
    // ButtonOverrideConfig
];
