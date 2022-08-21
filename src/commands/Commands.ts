import {NODE_ENV} from '../config';
import {ConfigCancel} from './buttonCommands/ConfigCancel';
import {ConfigOverride} from './buttonCommands/ConfigOverride';
import {DeleteBis} from './buttonCommands/DeleteBis';
import {EditBis} from './buttonCommands/EditBis';

import {ButtonCommand, Command} from './Command';
import {BestInSlot} from './slashCommands/BestInSlot';
import {ConfigureBotForGuild} from './slashCommands/ConfigureBotForGuild';
import {SetMainBis} from './slashCommands/SetMainBiS';

import {ShowEtroBis} from './slashCommands/ShowEtroBis';
import {StaticOverview} from './slashCommands/StaticOverview';
import {Test} from './slashCommands/Test';

export const Commands: Command[] = [
    ShowEtroBis,
    ConfigureBotForGuild,
    BestInSlot,
    SetMainBis,
    StaticOverview
];
if (NODE_ENV !== 'production') {
    Commands.push(Test);
}

export const ButtonCommands: ButtonCommand[] = [
    EditBis,
    DeleteBis,
    ConfigOverride,
    ConfigCancel
];
