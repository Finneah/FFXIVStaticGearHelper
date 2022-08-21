// eslint-disable-next-line @typescript-eslint/no-var-requires
const pino = require('pino');
import {createWriteStream} from 'fs';
import {NODE_ENV} from './config';
// TODO LOGIN BUILD!
const streams = [
    {level: 'error', stream: createWriteStream('./log.json', {flags: 'a'})},
    {level: 'debug', stream: process.stdout},
    {level: 'error', stream: process.stderr},
    {level: 'fatal', stream: process.stderr}
];

const Logger = pino(
    {
        name: 'FFXVIStaticGearHelper',
        level: NODE_ENV === 'production' ? 'error' : 'debug' // must be the lowest level of all streams
    },
    pino.multistream(streams)
);

export default Logger;
