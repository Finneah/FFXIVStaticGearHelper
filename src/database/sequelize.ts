// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sequelize = require('sequelize');

export const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite'
});

export const SeqGuilds = sequelize.define('guilds', {
    guild_id: {
        type: Sequelize.STRING,
        unique: true
    },
    static_role: {type: Sequelize.STRING, allowNull: true},
    moderator_role: {type: Sequelize.STRING, allowNull: true}
});

export const SeqBiSLinks = sequelize.define('bis', {
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    bis_name: {type: Sequelize.STRING, allowNull: false},
    bis_link: {type: Sequelize.STRING, allowNull: false},
    weapon: {type: Sequelize.BOOLEAN, allowNull: true},
    head: {type: Sequelize.BOOLEAN, allowNull: true},
    body: {type: Sequelize.BOOLEAN, allowNull: true},
    hands: {type: Sequelize.BOOLEAN, allowNull: true},
    legs: {type: Sequelize.BOOLEAN, allowNull: true},
    feet: {type: Sequelize.BOOLEAN, allowNull: true},
    offHand: {type: Sequelize.BOOLEAN, allowNull: true},
    ears: {type: Sequelize.BOOLEAN, allowNull: true},
    neck: {type: Sequelize.BOOLEAN, allowNull: true},
    wrists: {type: Sequelize.BOOLEAN, allowNull: true},
    fingerL: {type: Sequelize.BOOLEAN, allowNull: true},
    fingerR: {type: Sequelize.BOOLEAN, allowNull: true}
});
