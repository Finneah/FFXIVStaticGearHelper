import {NODE_ENV} from '../config';
import {ConfigCancel} from './buttonCommands/ConfigCancel';
import {ConfigOverride} from './buttonCommands/ConfigOverride';
import {DeleteBis} from './buttonCommands/DeleteBis';
import {EditBis} from './buttonCommands/EditBis';
import {EditBisOverview} from './buttonCommands/EditBisOverview';

import {ButtonCommand, Command} from './Command';
import {MyBis} from './slashCommands/MyBis';
import {Config} from './slashCommands/Config';
import {DeleteUser} from './slashCommands/DeleteUser';
import {SetMainBis} from './slashCommands/SetMainBiS';

import {EtroShow} from './slashCommands/EtroShow';
import {StaticOverview} from './slashCommands/StaticOverview';
import {Test} from './slashCommands/Test';

export const Commands: Command[] = [
    EtroShow,
    Config,
    MyBis,
    SetMainBis,
    StaticOverview,
    DeleteUser
];
if (NODE_ENV !== 'production') {
    Commands.push(Test);
}

export const ButtonCommands: ButtonCommand[] = [
    EditBis,
    DeleteBis,
    ConfigOverride,
    ConfigCancel,
    EditBisOverview
];
