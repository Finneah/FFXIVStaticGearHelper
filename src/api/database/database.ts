import {Client as PGClient, QueryConfig} from 'pg';
import {NODE_ENV, LOCAL_DB_USER, LOCAL_DB_PW, DATABASE_URL} from '../../config';

import Logger from '../../logger';

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

// export const initDB = async () => {
//     await createDBGuild();
//     await createDBBis();
//     await createDBGearsets();
// };

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
        gearset_id integer,
        user_id varchar(256) NOT NULL,
        guild_id varchar(256) NOT NULL,
        bis_name varchar(256) NOT NULL,
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
        bis_message_id varchar(256) DEFAULT NULL,
        CONSTRAINT gearset_id
        FOREIGN KEY(gearset_id) 
        REFERENCES gearsets(id)
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

const createDBGearsets = () => {
    const client = getClient();
    const string = `CREATE TABLE IF NOT EXISTS gearsets (
        id SERIAL PRIMARY KEY,
        last_update timestamp with time zone,
        bis_link varchar(256) NOT NULL, 
        jobAbbrev varchar(5),
        weapon varchar(256),
        head varchar(256),
        body varchar(256),
        hands varchar(256),
        legs varchar(256),
        feet varchar(256),
        offHand varchar(256),
        ears varchar(256),
        neck varchar(256),
        wrists varchar(256),
        finger_l varchar(256),
        finger_r varchar(256),
        food varchar(256),
        materia text
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

const alterTableBisRemoveBisLink = async () => {
    const client = getClient();
    const dropBisLinkString = `ALTER Table bis DROP COLUMN bis_link`;
    await client.query(dropBisLinkString, (err, res) => {
        if (err) logger.error(err);
        if (res) {
            for (const row of res?.rows) {
                logger.info(JSON.stringify(row));
            }
        }
        client.end();
    });
};

const alterTableBisAddGearsetId = async () => {
    const client = getClient();
    const string = `ALTER TABLE bis ADD COLUMN IF NOT EXISTS gearset_id integer;`;
    await client.query(string, (err, res) => {
        if (err) logger.error(err);
        if (res) {
            for (const row of res?.rows) {
                logger.info(JSON.stringify(row));
            }
        }
        client.end();
    });
};

const alterTableBisAddGearsetIdConstraint = async () => {
    const client = getClient();
    const string = `ALTER TABLE bis ADD CONSTRAINT gearset_id FOREIGN KEY (gearset_id) REFERENCES gearsets (id)`;
    await client.query(string, (err, res) => {
        if (err) logger.error(err);
        if (res) {
            for (const row of res?.rows) {
                logger.info(JSON.stringify(row));
            }
        }
        client.end();
    });
};
