const Sequelize = require('sequelize'); // sequelize 가져오기
const env = process.env.NODE_ENV || 'development'; // .env 파일의 NODE_ENV 가져오고 NODE_ENV가 없는 경우 development 로 설정
const config = require('../config/config')[env]; // config/config.json에서 env에 맞도록 설정
const User = require('./user'); // models/user.js 가져오기

const db = {}; // module.exports 변수 1개로 하기 위한 선언
const sequelize = new Sequelize( // sequelize config/config.json 의 내용 가져와서 선언
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User; 

User.init(sequelize);

User.associate(db);

module.exports = db; // db export 하여 다른곳에서 사용