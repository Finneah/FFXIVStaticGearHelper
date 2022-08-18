import {ConfigCancel} from './ConfigCancel';
import {ConfigOverride} from './ConfigOverride';
import {DeleteBis} from './DeleteBis';
import {EditBis} from './EditBis';
import {ButtonCommand, Command} from './Command';
import {BestInSlot} from './slashCommands/BestInSlot';
import {ConfigureBotForGuild} from './slashCommands/ConfigureBotForGuild';

import {ShowEtroBis} from './slashCommands/ShowEtroBis';

export const Commands: Command[] = [
    ShowEtroBis,
    ConfigureBotForGuild,
    BestInSlot
];

export const ButtonCommands: ButtonCommand[] = [
    EditBis,
    DeleteBis,
    ConfigOverride,
    ConfigCancel
];
