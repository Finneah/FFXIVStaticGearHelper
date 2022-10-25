import { NODE_ENV } from '../config';
import { ConfigCancel } from './buttonCommands/ConfigCancel';
import { ConfigOverride } from './buttonCommands/ConfigOverride';
import { DeleteBis } from './buttonCommands/DeleteBis';
import { EditBis } from './buttonCommands/EditBis';
import { EditBisOverview } from './buttonCommands/EditBisOverview';
import { MateriaList } from './buttonCommands/MateriaList';
import { ButtonCommand, Command } from './Command';
import { Config } from './slashCommands/Config';
import { DeleteUser } from './slashCommands/DeleteUser';
import { EtroGear } from './slashCommands/EtroGear';
import { MyBis } from './slashCommands/MyBis';
import { Patreon } from './slashCommands/Patreon';
import { SetMainBis } from './slashCommands/SetMainBiS';
import { StaticOverview } from './slashCommands/StaticOverview';
import { Test } from './slashCommands/Test';

export const GlobalCommands: Command[] = [EtroGear, Patreon, Test];
export const GuildCommands: Command[] = [
    Config,
    MyBis,
    SetMainBis,
    StaticOverview,
    DeleteUser
];
export const SlashCommands: Command[] = GuildCommands.concat(GlobalCommands);

// if (NODE_ENV !== 'production') {
//     GlobalCommands.push(Test);
// }

export const ButtonCommands: ButtonCommand[] = [
    EditBis,
    DeleteBis,
    ConfigOverride,
    ConfigCancel,
    EditBisOverview,
    MateriaList
];
