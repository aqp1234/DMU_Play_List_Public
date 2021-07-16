const passport = require('passport'); // passport 모듈 가져오기
const LocalStrategy = require('passport-local').Strategy; // passport-local 모듈에서 Strategy 가져오기
const bcrypt = require('bcrypt'); // 암호화를 위한 bcrypt 모듈 가져오기

const User = require('../models/user'); //user 테이블 가져오기

module.exports = () => { // 해당 함수 export
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async(email, password, done) => {
        try{
            const exUser = await User.findOne({ where: {email} }); // email로 유저가 있는지 확인
            if(exUser){ // 유저가 있다면
                const result = await bcrypt.compare(password, exUser.password); //입력받은 password와 암호화 되어 저장된 exUser.password 가 동일한지 compare 함수를 통해 확인
                if(result){ // 비밀번호가 동일하다면
                    done(null, exUser); // 정상 로그인
                }else{
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); // 틀릴시 로그인 불가
                }
            }else{ // email로 유저가 없다고 확인되면
                done(null, false, { message: '가입되지 않은 회원입니다.' }); // 유저가 없다고 안내
            }
        } catch(err){
            console.error(err);
            next(err);
        }
    }));
};