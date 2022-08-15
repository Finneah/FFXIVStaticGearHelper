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
    bis_name: {type: Sequelize.STRING, allowNull: false},
    bis_link: {type: Sequelize.STRING, allowNull: false},
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
