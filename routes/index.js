const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

const Album = require('../schemas/album');
const Song = require('../schemas/song');
const Playlist = require('../schemas/playlist');

router.use(async (req, res, next) => { // 전역 변수 설정하기 위한 use 문
    res.locals.user = req.user; // req.user 을 전역변수로 설정
    res.locals.playlist = req.user ? await getPlaylist(req.user.id) : null;
    
    next();
});

router.use(async (req, res, next) => { // 전역 변수 설정하기 위한 use 문
    res.locals.searchText=req.query.searchText;
    next();
});


router.get('/', (req, res) => {
    res.render('layout');
});

router.get('/main', async (req, res, next) => { // / url 로 get 방식으로 요청이 들어왔을때
    try{
        const song = await Song.find().sort({release_date: -1, song_name: 1}).limit(5); // 최신 발매일 순으로 정렬해서 조회
        const album = await Album.find().sort({click: -1, album_name: 1}).limit(5); // 앨범 내 모든 음원의 클릭 수 순으로 정렬해서 조회
        res.render('main', { album, song }); // main.html 렌더링, DMU PLAY LIST의 메인 화면
    } catch(err){
        console.error(err);
        return next(err);
    }
});

module.exports = router;

const getPlaylist = async(user_id) => {
    const explaylist = await Playlist.find({
        user_id,
    }).sort({num: 1});
    return explaylist;
};