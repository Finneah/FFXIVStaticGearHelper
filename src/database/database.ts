import {Client as PGClient, QueryConfig} from 'pg';

import Logger from '../logger';

const logger = Logger.child({module: 'Databse'});

export const getClient = () => {
    if (process.env.NODE_ENV === 'production') {
        const client = new PGClient({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        client.connect();
        return client;
    }
    const client = new PGClient({
        connectionString: process.env.DATABASE_URL,
        ssl: false,
        user: process.env.LOCAL_DB_USER,
        password: process.env.LOCAL_DB_PW
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
    bis_channel varchar(256) DEFAULT NULL
);`;
    client.query(string, (err, res) => {
        if (err) logger.error(err);
        for (const row of res.rows) {
            logger.info(JSON.stringify(row));
        }
        client.end();
    });
};

const createDBBis = () => {
    const client = getClient();
    const string = `CREATE TABLE IF NOT EXISTS bis (
        bis_id SERIAL PRIMARY KEY,
        user_id varchar(256) NOT NULL,
        bis_name varchar(256) NOT NULL,
        bis_link varchar(256) NOT NULL, 
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
        fingerL BOOLEAN DEFAULT false,
        fingerR BOOLEAN DEFAULT false
    );`;
    client.query(string, (err, res) => {
        if (err) logger.error(err);
        for (const row of res.rows) {
            logger.info(JSON.stringify(row));
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
