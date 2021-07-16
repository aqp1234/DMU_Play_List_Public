const passport = require('passport'); //passport 모듈 가져오기
const local = require('./localStrategy'); // localStrategy.js 파일의 exports 내용 가져오기
const User = require('../models/user'); // User 테이블 가져오기

module.exports = () => {
    passport.serializeUser((user, done) => { // passport 에서 제공하는 serializeUser 함수 / 로그인시 인증 기능 
        done(null, user.id); // done 함수의 첫번째 인자로 null 이 들어오면 오류가 없으며, user.id로 로그인한다는 뜻
    });

    passport.deserializeUser((id, done) => { // passport 에서 제공하는 deseriallizeUser 함수 / 매번 페이지를 옮기거나 할때마다 실행
        User.findOne({ where: { id } }) // id값으로 유저가 있는지 확인
            .then(user => done(null, user)) // 있다면 user 반환하여 done(null, user) 로 정상 로그인 진행
            .catch(err => done(err)); // 에러(err) 가 있는 경우 done(err)로 에러가 있다고 안내
    });

    local(); // 위에 선언한 local 실행 -> localStrategy.js에서 exports 한 함수 실행됨
}