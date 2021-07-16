const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // middlewares.js 에서 export 한 함수 가져오기
const User = require('../models/user');

const router = express.Router(); // router 선언

router.post('/join', isNotLoggedIn, async (req, res, next) => { // /join url로 post 방식으로 요청이 들어온 경우 / isNotLoggedIn 미들웨어로 로그인 안한 상태인지 확인
    const { email, firstname, secondname, password, phone } = req.body; //req.body로 들어온 데이터 선언
    try{
        const exUser = await User.findOne({ where: { email } }); // email로 가입된 사용자가 있는지 확인
        if(exUser){ // 이미 가입된 사용자가 있다면 추가적인 회원가입이 되면 안됨
            return res.redirect('/auth/join?error=exist'); // 오류 문구 포함해서 리다이렉션
        }
        const hash = await bcrypt.hash(password, 12); // 입력한 password를 hash값으로 12번 반복하여 변환
        await User.create({ // user테이블에 데이터 저장
            email, // email: email, 과 동일
            name: `${firstname}${secondname}`, // 이름은 성과 이름 합쳐서 저장
            password: hash, // password 는 hash값으로 변환한 값으로 저장
            phone,
        });
        return res.redirect('/main'); // 메인 화면으로 리다이렉션
    } catch(err){
        console.error(err);
        return next(err);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => { // /login url로 post 방식으로 요청이 들어온 경우 / isNotLoggedIn 으로 미로그인한 상태에만 접속 가능하도록 설정
    passport.authenticate('local', (authError, user, info) => { // passport 에서 제공하는 authenicate 함수로 로그인 진행
        if(authError){ // 로그인 시 인증 에러가 있다면
            console.error(authError);
            return next(authError);
        }
        if(!user){ // 유저가 없다고 나온다면
            return res.redirect(`/?error=${info.message}`);
        }
        return req.login(user, (loginError) => { // user로 로그인 진행
            if(loginError){ // 로그인 시 에러가 뜬다면
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/'); // 최종 정상 로그인 시메인화면으로 리다이렉션
        });
    })(req, res, next); // 미들웨어라는 표시
});

router.get('/logout', isLoggedIn, (req, res) => { // /logout url 로 get 방식으로 요청이 들어온 경우, 로그아웃은 로그인시에만 가능하기 때문에 isLoggedIn 미들웨어 사용
    req.logout(); // 로그아웃 진행
    req.session.destroy(); // 세션 내용 삭제
    res.redirect('/'); // 메인 화면으로 리다이렉션
});

router.get('/login', isNotLoggedIn, (req, res) => { // /login url 로 get 방식으로 요청이 들어온 경우, 로그인은 비로그인 시에만 가능하기 때문에 isNotLoggedIn 미들웨어 사용
    res.render('auth/login', { title: 'DMU PLAY LIST' }); // views/auth/login.html 랜더링 진행, 변수로 title 넘겨줌
});

router.get('/join', isNotLoggedIn, (req, res) => {// /join url 로 get 방식으로 요청이 들어온 경우, 회원가입은 비로그인 시에만 가능하기 때문에 isNotLoggedIn 미들웨어 사용
    res.render('auth/join', { title: 'DMU PLAY LIST' });// views/auth/join.html 렌더링 진행
});

module.exports = router; // router export 진행