const express = require('express');
const router = express.Router();

const Song = require('../schemas/song');
const Playlist = require('../schemas/playlist');
const album = require('../schemas/album');
const { iscash } = require('./middlewares');

router.get('/nextAudio', async(req, res, next) => {
    try{
        var nextsong = await Playlist.findOne({ // 플레이리스트에서 다음노래 조회
            user_id: req.user.id,
            num: parseInt(req.query.num) + 1, // query에서 가져온 num보다 1이 큰 값
        });
        if(!nextsong){ // 만약 다음 노래가 없다면
            const explaylist = await Playlist.find({ // playlist에서 사용자의 모든 노래 조회
                user_id: req.user.id,
            }).sort({num: 1}); // num 값을 오름차순으로 정렬
            nextsong = explaylist[0]; // 가장 첫번째노래 가져오기
        }
        res.send(nextsong); // 찾은 노래 전달
        res.end();
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/addsong/:songid', iscash, async(req, res, next) => {
    try{
        if(req.user){
            // 인기 노래 정렬을 위해 song에 click 추가
            const exsong = await Song.findOneAndUpdate({ // 해당 노래의 click 횟수 1 증가
                _id: req.params.songid,
            }, {
                $inc: {
                    click: 1,
                }
            });
    
            // 인기 앨범 정렬을 위해 앨범에도 click 추가 - 승원
            const song = await Song.findOne({_id: req.params.songid,});
            await album.findOneAndUpdate({ // 해당 앨범의 click 횟수 1 증가
                _id: song.album_id,
            },{
                $inc: {
                    click: 1,
                }
            });
    
            const playlists = await Playlist.find({ // 플레이리스트에서 num 변수 내림차순으로 정렬
                user_id: req.user.id,
            }).sort({num: -1});
            var num = 0; // 플레이 리스트가 없을때 num 변수 0으로 설정
            if(playlists.length){ // 플레이 리스트가 있을때
                num = playlists[0].num + 1; // 제일 높은 num값보다 + 1 로 설정
            }
            const explaylist = await Playlist.create({ // 플레이리스트에 해당 노래 추가
                user_id: req.user.id,
                num,
                song_name: exsong.song_name,
                src: "http://localhost:8006"+exsong.src,
            });
            res.send(explaylist); // 생성된 플레이리스트 전달
            res.end();
        }else{
            res.end()
        }
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/getAudio', async(req, res, next) => {
    try{
        if(req.user){
            const explaylist = await Playlist.findOne({ // query로 받아온 num변수값으로 플레이리스트 조회
                user_id: req.user.id,
                num: req.query.num,
            });
            res.send(explaylist); // 조회된 플레이리스트 전달
            res.end();
        }else{
            res.end();
        }
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/upper', async(req, res, next) => { // 선택한 플레이리스트 노래의 순서를 위쪽으로 변경 (num값 축소)
    try{
        var num = parseInt(req.query.num); // url query의 num값 가져오기
        if(num == 0){ // 만약 num값이 0이면 실행하지 않고 종료
            res.end();
        }else{
            const explaylist = await Playlist.findOne({ // num값의 플레이리스트 조회
                user_id: req.user.id,
                num,
            });
            const explaylist2 = await Playlist.findOne({ // num값보다 1 적은 플레이리스트 조회
                user_id: req.user.id,
                num: num - 1,
            })
            await Playlist.updateOne({ // num값이 일치하는 플레이 리스트의 num값 -1 처리
                user_id: req.user.id,
                _id: explaylist._id,
            }, {
                $inc: {
                    num: -1,
                },
            });
            await Playlist.updateOne({ // num값이 하나 적은 플레이 리스트의 num값 +1 처리
                user_id: req.user.id,
                _id: explaylist2._id,
            }, {
                $inc: {
                    num: 1,
                },
            });
            res.end();
        }
    }catch(err){
        console.error(err);
    }
});

router.get('/lower', async(req, res, next) => { // 선택한 노래의 순서 아래로 변경 (num값 증가)
    try{
        var num = parseInt(req.query.num); // url query의 num값 조회
        const playlists = await Playlist.find({ // 사용자의 playlist 전체 조회
            user_id: req.user.id,
        });
        if(num == playlists.length){ // 선택한 노래의 순서가 제일 마지막이라면
            res.end(); // 실행하지 않고 바로 종료
        }else{
            const explaylist = await Playlist.findOne({ // num값과 일치하는 플레이리스트 조회
                user_id: req.user.id,
                num,
            });
            const explaylist2 = await Playlist.findOne({ // num + 1 과 일치하는 플레이리스트 조회
                user_id: req.user.id,
                num: num + 1,
            })
            await Playlist.updateOne({ // num값 일치하는 플레이리스트 num값 + 1
                user_id: req.user.id,
                _id: explaylist._id,
            }, {
                $inc: {
                    num: 1,
                },
            });
            await Playlist.updateOne({ // num + 1 과 일치하는 플레이리스트 num 값 - 1
                user_id: req.user.id,
                _id: explaylist2._id,
            }, {
                $inc: {
                    num: -1,
                },
            });
            res.end();
        }
    }catch(err){
        console.error(err);
    }
});

router.get('/delete', async(req, res, next) => {
    try{
        var num = parseInt(req.query.num); // url query에 있는 num값 조회
        await Playlist.deleteOne({ // playlist 에서 num값과 일치하는 정보삭제
            user_id: req.user.id,
            num,
        });
        await Playlist.updateMany({ // 해당 num값 보다 높은 num값들 전부 -1 처리
            user_id: req.user.id,
            num: {$gt: num},
        }, {
            $inc: {
                num: -1,
            },
        });
        res.end();
    }catch(err){
        console.error(err);
    }
});

module.exports = router;