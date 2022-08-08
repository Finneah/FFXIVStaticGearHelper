// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sequelize = require('sequelize');

export const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite'
});

export const GuildConfig = sequelize.define('guild_config', {
    guild_id: {
        type: Sequelize.STRING,
        unique: true
    },
    user_role: {type: Sequelize.STRING, allowNull: true},
    moderator_role: {type: Sequelize.STRING, allowNull: true}
});
