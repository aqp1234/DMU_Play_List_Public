const express = require("express");

const router = express.Router();

const Artist = require('../schemas/artist');
const Song = require('../schemas/song');
const Album = require('../schemas/album');

router.get('/', async(req, res, next) => {
    try{
        const query = req.query.searchText;
        if(!query.trim()){
            res.redirect('/main?error=검색어를입력해주세요');
        }
        const exalbum = await Album.find({
            album_name: {
                $regex: query,
                $options: 'ix', // regex 옵션중에 i 는 대소문자 구분 없이 조회, x는 공백 무시하고 조회
            },
        });
        const exartist = await Artist.find({
            name: {
                $regex: query,
                $options: 'ix',
            },
        });
        const exsong = await Song.find({
            song_name: {
                $regex: query,
                $options: 'ix',
            },
        });
        res.render('searchtest/index', {albums: exalbum, artists: exartist, songs: exsong});
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;