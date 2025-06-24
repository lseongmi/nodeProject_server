const path = require('path');
require('dotenv').config({path : path.resolve(__dirname, 'config/.env')});

const {Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    host:process.env.DB_HOST,
    username: process.env.DB_USER,
    port : process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    dialect: 'mysql',
    logging: false,
});

//연결확인
sequelize.authenticate().then(() => {
    console.log('데이터베이스 연결성공');
}).catch((err) => {
    console.error('데이터베이스 연결실패 : ', err);
});

module.exports = sequelize; //다른파일에서 인스턴스를 사용할 수 있도록 내보내기