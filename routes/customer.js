const express = require('express');

const router = express.Router();

const Notice = require('../schemas/notice');
const Question = require('../schemas/question');
const Answer = require('../schemas/answer');
const { isLoggedIn, isAdmin, isMyQuestion } = require('./middlewares');

router.get('/', async (req, res, next) => {
    try{
        const notices = await Notice.find({}); // 모든 공지사항 조회
        res.render('customer/index', { notices }); // customer/index.ejs 파일 랜더링 및 공지사항 전달
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/notice/detail/:noticeid', async(req, res, next) => {
    try{
        const exnotice = await Notice.findOne({ // url에 noticeid 값으로 조회하여 공지사항 조회
            _id: req.params.noticeid,
        });
        res.render('customer/notice_detail', { notice: exnotice }); // 조회한 공지사항 변수로 전달하여 랜더링
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/notice/delete/:noticeid',isAdmin, async(req, res, next) => {
    try{
        await Notice.deleteOne({ // url에 noticeid값으로 조회하여 삭제
            _id: req.params.noticeid,
        });
        res.redirect('/customer'); // 고객센터 메인 화면으로 리다이렉션
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/add_notice',isAdmin, (req, res) => {
    res.render('customer/add_notice');
});

router.post('/add_notice',isAdmin, async(req, res, next) => {
    try{
        const { notice_type, subject, content } = req.body; // body문에 관리자가 작성한 내용 가져오기
        await Notice.create({ // 공지사항 DB에 추가
            notice_type,
            subject,
            content,
        });
        res.redirect('/customer');
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/questionboard', isLoggedIn, async(req, res, next) => {
    try{
        const questions = await Question.find({}); // 모든 문의사항 조회
        res.render('customer/questionboard', { questions }); // customer/questionboard.ejs 랜더링 및 questions변수 전달
    }catch(err){
        console.error(err);
        next(err);
    }
});


router.get('/myquestion', isLoggedIn, async(req, res, next) => {
    try{
        const myquestions = await Question.find({ // 현재 로그인된 사용자의 고유 아이디값으로 문의내역 조회
            user_id: req.user.id,
        });
        res.render('customer/myquestion', { myquestions }); // 내 문의내역만 조회하여 전달
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/question/add', isLoggedIn, (req, res) => {
    res.render('customer/add_question');
});

router.post('/question/add', isLoggedIn, async(req, res, next) => {
    try{
        const { subject, content, is_secret } = req.body; // body에 가지고 온 정보
        await Question.create({ // 문의내역 DB에 저장
            user_id: req.user.id,
            user_name: req.user.name,
            subject,
            content,
            is_secret: is_secret ? 1 : 0, // is_secret 설정했으면 1, 안했으면 0
        });
        res.redirect('/customer/questionboard');
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/question/delete/:questionid', isLoggedIn, async(req, res, next) => {
    try{
        await Question.deleteOne({ // url의 questionid 값으로 조회하여 삭제
            _id: req.params.questionid,
        });
        res.redirect('/customer/questionboard');
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/answer/:questionid', async(req, res, next) => {
    try{
        const exquestion = await Question.findOne({ // url의 questionid 값으로 문의내역 조회
            _id: req.params.questionid,
        });
        res.render('customer/answer', { question: exquestion, questionid: req.params.questionid });
    }catch(err){
        console.log(error);
        next(err);
    }
});

router.post('/answer/:questionid', isAdmin, async(req, res, next) => {
    try{
        const { content } = req.body; // 답변 내용 가져오기
        await Answer.create({ // 답변 DB에 저장
            question: req.params.questionid,
            user_id: req.user.id,
            user_name: req.user.name,
            content,
        });
        await Question.updateOne({ // 문의내용에 is_answer 컬럼 true 로 변경
            _id: req.params.questionid,
        }, {
            $set: {
                is_answer: true,
            },
        });
        res.redirect('/customer/questionboard');
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/answer/delete/:answerid', isAdmin, async(req, res, next) => {
    try{
        const exanswer = await Answer.findOneAndDelete({ // 답변 확인 후 삭제
            _id: req.params.answerid,
        });
        await Question.updateOne({ // 문의내역 is_answer 컬럼 true > false 변경
            _id: exanswer.question,
        }, {
            $set: {
                is_answer: false,
            },
        })
        res.redirect('/customer/questionboard');
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/detail/:questionid',isMyQuestion, async(req, res, next) => {
    try{
        const exquestion = await Question.findOne({ // 문의 내역 고유 id값인 questionid로 조회
            _id: req.params.questionid,
        });
        const exanswer = await Answer.findOne({ // questionid로 답글이 있는 지 조회
            question: req.params.questionid,
        });
        res.render('customer/question_detail', { question: exquestion, answer: exanswer });
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;