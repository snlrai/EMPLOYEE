import { Sequelize } from 'sequelize';

const db = new Sequelize('workease', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;