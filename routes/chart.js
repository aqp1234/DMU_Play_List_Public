const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

const Album = require('../schemas/album');
const Song = require('../schemas/song');
const Playlist = require('../schemas/playlist');

router.get('/', async (req, res, next) => { // / url 로 get 방식으로 요청이 들어왔을때
    try{
        const song = await Song.find().sort({click: -1, song_name: 1}).limit(10); // click이 많은 순으로 정렬해서 조회
        res.render('chart', { song });
    } catch(err){
        console.error(err);
        return next(err);
    }
});

module.exports = router;