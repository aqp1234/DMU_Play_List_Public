const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

const Album = require('../schemas/album');
const Song = require('../schemas/song');
const Playlist = require('../schemas/playlist');

router.get('/', async (req, res, next) => { // / url 로 get 방식으로 요청이 들어왔을때
    try{
        const song = await Song.find().sort({release_date: -1, song_name: 1}); // 발매일이 빠른 순, 발매일이 같은 경우 음원 명으로 오름 차순
        var album = [];
        for(i = 0; i < song.length; i++){
            album[i] = await Album.findOne({_id: song[i].album_id,});
        }
        res.render('all_song', { song, album });
    } catch(err){
        console.error(err);
        return next(err);
    }
});

module.exports = router;