import {ConfigCancel} from './buttonCommands/ConfigCancel';
import {ConfigOverride} from './buttonCommands/ConfigOverride';
import {DeleteBis} from './buttonCommands/DeleteBis';
import {EditBis} from './buttonCommands/EditBis';

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
