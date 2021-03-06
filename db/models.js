const sequelize = require('sequelize');

let db;
if (process.env.DATABASE_URL) {
    db = new sequelize(process.env.DATABASE_URL,{
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                // Ref.: https://github.com/brianc/node-postgres/issues/2009
                rejectUnauthorized: false,
            },
            keepAlive: true,
        },
        ssl: true,
        protocol: "postgres",
        port: 5432,
        host: "ec2-54-87-112-29.compute-1.amazonaws.com",
        logging: false, //true
    });
} else {
    db = new sequelize({
        dialect: `mysql`,
        username: `firstuser`,
        password: `firstpass`,
        database: `chatfinal`,
        host: `localhost`
    });
};


const users = db.define('user', {
    username: {
        type: sequelize.DataTypes.STRING(30),
        unique: true,
        allowNull: false
    },
    email: {
        type: sequelize.DataTypes.STRING(100),
        allowNull: false
    },
    password: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    }
});

db.sync().then(() => {
    console.log('database synced')
}).catch((err) => {
    console.error(new Error('cannot sync database'));
    console.error(err);
});

module.exports = {
    db,
    users
};
