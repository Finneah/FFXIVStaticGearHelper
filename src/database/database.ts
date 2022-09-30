import {Client as PGClient, QueryConfig} from 'pg';
import {NODE_ENV, LOCAL_DB_USER, LOCAL_DB_PW, DATABASE_URL} from '../config';

import Logger from '../logger';

const logger = Logger.child({module: 'Databse'});

export const getClient = () => {
    if (NODE_ENV === 'production') {
        const client = new PGClient({
            connectionString: DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        client.connect();
        return client;
    }
    const client = new PGClient({
        connectionString: DATABASE_URL,
        ssl: false,
        user: LOCAL_DB_USER,
        password: LOCAL_DB_PW
    });
    client.connect();
    return client;
};

export const initDB = async () => {
    createDBGuild();
    createDBBis();
};

const createDBGuild = () => {
    const client = getClient();
    const string = `CREATE TABLE IF NOT EXISTS guilds (
    guild_id varchar(256) NOT NULL PRIMARY KEY,
    moderator_role varchar(256) DEFAULT NULL,
    static_role varchar(256) DEFAULT NULL,
    bis_channel varchar(256) DEFAULT NULL,
    bis_message_id varchar(256) DEFAULT NULL
);`;
    client.query(string, (err, res) => {
        if (err) logger.error(err);
        if (res) {
            for (const row of res?.rows) {
                logger.info(JSON.stringify(row));
            }
        }
        client.end();
    });
};

const createDBBis = () => {
    const client = getClient();
    const string = `CREATE TABLE IF NOT EXISTS bis (
        bis_id SERIAL PRIMARY KEY,
        user_id varchar(256) NOT NULL,
        guild_id varchar(256) NOT NULL,
        bis_name varchar(256) NOT NULL,
        bis_link varchar(256) NOT NULL, 
        is_main BOOLEAN DEFAULT false,
        weapon BOOLEAN DEFAULT false,
        head BOOLEAN DEFAULT false,
        body BOOLEAN DEFAULT false,
        hands BOOLEAN DEFAULT false,
        legs BOOLEAN DEFAULT false,
        feet BOOLEAN DEFAULT false,
        offHand BOOLEAN DEFAULT false,
        ears BOOLEAN DEFAULT false,
        neck BOOLEAN DEFAULT false,
        wrists BOOLEAN DEFAULT false,
        finger_l BOOLEAN DEFAULT false,
        finger_r BOOLEAN DEFAULT false,
        bis_message_id varchar(256) DEFAULT NULL
    );`;
    client.query(string, (err, res) => {
        if (err) logger.error(err);
        if (res) {
            for (const row of res?.rows) {
                logger.info(JSON.stringify(row));
            }
        }
        client.end();
    });
};

export const runQuery = async (query: QueryConfig) => {
    try {
        const client = getClient();
        const res = await client.query(query);
        client.end();

        return res;
    } catch (err) {
        return Promise.reject(err);
    }
};
