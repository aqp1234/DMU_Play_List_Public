const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

const Artist = require('../schemas/artist');
const Album = require('../schemas/album');
const Song = require('../schemas/song');

const multer = require('multer'); // 파일 업로드와 관련된 모듈
const fs = require('fs'); // 파일처리와 관련된 모듈
const path = require('path'); // 경로 작업을 위한 모듈

try{ // artist 폴더가 있는 경우 해당 폴더를 읽어옴
    fs.readdirSync('public/img/artist');
}catch(err){ // artist 폴더가 없는 경우 해당 폴더를 새로 생성해줌
    fs.mkdirSync('public/img/artist');
}
try{
    fs.readdirSync('public/img/album');
}catch(err){
    fs.mkdirSync('public/img/album');
}
try{
    fs.readdirSync('public/song');
}catch(err){
    fs.mkdirSync('public/song');
}

const upload_artist = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'public/img/artist'); // 파일이 저장 될 위치
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname); // 파일 확장자 반환
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); 
            // path.basename(파일명, 확장자)함수는 파일명 추출해 확장자 제외 후 출력
        },
    }),
});
const upload_album = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'public/img/album'); // 파일이 저장 될 위치
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname); // 파일 확장자 반환
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); 
            // path.basename(파일명, 확장자)함수는 파일명 추출해 확장자 제외 후 출력
        },
    }),
});
const upload_song = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'public/song'); // 파일이 저장 될 위치
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname); // 파일 확장자 반환
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); 
            // path.basename(파일명, 확장자)함수는 파일명 추출해 확장자 제외 후 출력
        },
    }),
});


router.use((req, res, next) => { // 전역 변수 설정하기 위한 use 문
    res.locals.user = req.user; // req.user 을 전역변수로 설정
    next();
});

// add_info/index 화면 조회
router.get('/', async (req, res, next) => { // / url 로 get 방식으로 요청이 들어왔을때
    try{
        const artist = await Artist.find().sort({start_date: 1, name: 1}); // 데뷔일 순으로 정렬
        const album = await Album.find().sort({release_date: 1, album_name: 1}); // 오래된 순으로 정렬
        const song = await Song.find().sort({release_date: 1, song_name: 1}); // 오래된 순으로 정렬
        res.render('add_info/index', { artist, album, song });
    } catch(err){
        console.error(err);
        return next(err);
    }
});

// add_info/index 아티스트 정보 삭제
router.get('/delete/artist/:artistid', async(req, res, next) => {
    try{
        await Artist.deleteOne({
            _id: req.params.artistid,
        });
        await Album.deleteMany({
            artist_id: req.params.artistid,
        });
        await Song.deleteMany({
            artist_id: req.params.artistid,
        });
        res.redirect('/add_info/');
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/index 앨범 정보 삭제
router.get('/delete/album/:albumid', async(req, res, next) => {
    try{
        await Album.deleteOne({
            _id: req.params.albumid,
        });
        await Song.deleteMany({
            album_id: req.params.albumid,
        });
        res.redirect('/add_info/');
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/index 음원 정보 삭제
router.get('/delete/song/:songid', async(req, res, next) => {
    try{
        await Song.deleteOne({
            _id: req.params.songid,
        });
        res.redirect('/add_info/');
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/add_artist 화면 반환 (아티스트 정보 추가)
router.get('/add_artist', async (req, res, next) => {
    res.render('add_info/add_artist');
});

// add_info/add_artist 화면에 입력된 값 데이터베이스에 저장 (아티스트 정보 추가)
router.post('/add_artist', upload_artist.array('file'), async (req, res, next) => { 
    try{
        const { artist_name, member_name_string, start_date, artist_detail } = req.body;
        // 멤버명 저장 처리 member_name
        var member_name = [];
        if(member_name_string){
            member_name = member_name_string.split(',');
        }
        // 아티스트 사진 저장 처리 file_path, file_name
        const file_path = [];
        const file_name = [];
        if(req.files){
            for(i = 0; i < req.files.length; i++){
                file_path.push({path: "/img/artist/" + req.files[i].filename});
                file_name.push({name: req.files[i].originalname});
            }
        }
        
        if(member_name){
            await Artist.create({
                name: artist_name, //front name과 back에서 설정된 이름이 다르면 다음과 같이 표기
                member: member_name,
                start_date,
                file_path,
                file_name,
                artist_detail,
            });
        } else {
            await Artist.create({
                name: artist_name, //front name과 back에서 설정된 이름이 다르면 다음과 같이 표기
                start_date,
                file_path,
                file_name,
                artist_detail,
            });
        }
        res.redirect('/add_info/'); // 저장 후 add_info 메인 화면으로 화면 이동
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/add_album 화면 반환 (앨범 정보 추가)
router.get('/add_album', async (req, res, next) => {
    try{
        const artist = await Artist.find().sort({start_date: 1}); // 데뷔일 순으로 정렬
        res.render('add_info/add_album', { artist });
    } catch(err){
        console.error(err);
        return next(err);
    }
});

// add_info/add_album 화면에 입력된 값 데이터베이스에 저장 (앨범 정보 추가)
router.post('/add_album', upload_album.array('file'), async (req, res, next) => { 
    try{
        const { album_name, artist_name, release_date } = req.body;
        // artist name 조회를 위해 artist_name으로 넘어온 아티스트의 id 값으로 컬럼 조회
        const artist_id = await Artist.findOne({
            _id: artist_name,
        });
        // 앨범 사진 저장 처리 file_path, file_name
        const file_path = [];
        const file_name = [];
        if(req.files){
            for(i = 0; i < req.files.length; i++){
                file_path.push({path: "/img/album/" + req.files[i].filename});
                file_name.push({name: req.files[i].originalname});
            }
        }

        await Album.create({
            album_name,
            artist_id,
            artist_name: artist_id.name,
            file_path,
            file_name,
            release_date,
        });
        res.redirect('/add_info/'); // 저장 후 add_info 메인 화면으로 화면 이동
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/add_song 화면 반환 (음원 정보 추가)
router.get('/add_song', async (req, res, next) => {
    try{
        const artist = await Artist.find().sort({start_date: 1}); // 데뷔일 순으로 정렬
        const album = await Album.find().sort({release_date: 1}); // 오래된 순으로 정렬
        res.render('add_info/add_song', { artist, album });
    } catch(err){
        console.error(err);
        return next(err);
    }
});

// add_info/add_song 화면에 입력된 값 데이터베이스에 저장 (음원 정보 추가)
router.post('/add_song', upload_song.array('file'), async (req, res, next) => { 
    try{
        const { song_name, artist_name, album_name } = req.body;
        const artist_id = await Artist.findOne({
            _id: artist_name,
        });
        const album_id = await Album.findOne({
            _id: album_name,
        });
        // 음원 저장 처리 file_path, file_name
        const file_path = [];
        if(req.files){
            for(i = 0; i < req.files.length; i++){
                file_path.push({path: "/song/" + req.files[i].filename});
            }
        }
        
        if(album_id.file_path.length) {
            await Song.create({
                album_id,
                song_name,
                artist_id,
                artist_name: artist_id.name,
                src: file_path[0].path,
                release_date: album_id.release_date,
                photo: album_id.file_path[album_id.file_path.length-1].path,
            });
        } else {
            await Song.create({
                album_id,
                song_name,
                artist_id,
                artist_name: artist_id.name,
                src: file_path[0].path,
                release_date: album_id.release_date,
            });
        }
        
        res.redirect('/add_info'); // 저장 후 add_info 메인 화면으로 화면 이동
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/change_artist 화면 반환 (아티스트 정보 수정)
router.get('/change/artist/:artistid', async(req, res, next) => {
    try{
        const artist = await Artist.findOne({_id: req.params.artistid,});
        res.render('add_info/change_artist', { artist });
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/change_artist 화면에 입력된 값 데이터베이스에 수정 (아티스트 정보 수정)
router.post('/change/artist/:artistid', upload_artist.array('file'), async(req, res, next) => {
    try{
        const { artist_name, member_name_string, start_date, artist_detail, deletefile } = req.body;
        // 멤버명 저장 처리 member_name
        var member_name = [];
        if(member_name_string){
            member_name = member_name_string.split(',');
        }

        const ch_artist = await Artist.findOne({
            _id: req.params.artistid,
        });
        var file_path = ch_artist.file_path;
        var file_name = ch_artist.file_name;
        var delete_count  = 0;
        if(deletefile){ // 원래 저장된 파일 삭제
            for(i = 0; i < deletefile.length; i++){
                // deletefile에는 splice를 실행 하기 전, 삭제를 진행할 값들의 index가 담겨 있음
                // 파일을 여러 개 삭제 할 때, splice가 진행되며 계속해서 인덱스 값이 변화하기 때문에 deletefile에서 가져오게 될 인덱스의 값을 그에 맞게 수정 
                deletefile_num = deletefile[i] - delete_count;
                file_path.splice(deletefile_num, 1);
                file_name.splice(deletefile_num, 1);
                delete_count++; // 몇 개의 인덱스 값이 삭제 되었는지를 저장하는 변수
            }
        }
        if(req.files){
            for(i = 0; i < req.files.length; i++){
                file_path.push({path: "/img/artist/" + req.files[i].filename});
                file_name.push({name: req.files[i].originalname});
            }
        }

        if(member_name){
            await Artist.updateOne({_id: req.params.artistid,}, {
                $set : {
                    name: artist_name, //front name과 back에서 설정된 이름이 다르면 다음과 같이 표기
                    member: member_name,
                    start_date,
                    file_path,
                    file_name,
                    artist_detail, 
                }
            });
        } else {
            await Artist.updateOne({_id: req.params.artistid,}, {
                $set : {
                    name: artist_name, //front name과 back에서 설정된 이름이 다르면 다음과 같이 표기
                    start_date,
                    file_path,
                    file_name,
                    artist_detail, 
                }
            });
        }
        // album, song 정보 중 aritst 정보가 변화함에 따라 영향을 받을 수 있는 artist_name 자동 수정
        await Album.updateMany({artist_id:req.params.artistid,}, {
            $set : {
                artist_name
            }
        });
        await Song.updateMany({artist_id:req.params.artistid,}, {
            $set : {
                artist_name
            }
        });
        res.redirect('/add_info');
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/change_album 화면 반환 (앨범 정보 수정)
router.get('/change/album/:albumid', async(req, res, next) => {
    try{
        const album = await Album.findOne({_id: req.params.albumid,});
        const artist_all = await Artist.find().sort({start_date: 1});
        res.render('add_info/change_album', { album, artist_all });
    } catch(err){
        console.error(err);
        return next(err);
    }
});

// add_info/change_album 화면에 입력된 값 데이터베이스에 수정 (앨범 정보 수정)
router.post('/change/album/:albumid', upload_album.array('file'), async(req, res, next) => {
    try{
        const { album_name, artist_name, release_date, deletefile } = req.body;
        // artist name 조회를 위해 artist_name으로 넘어온 아티스트의 id 값으로 컬럼 조회
        const artist_id = await Artist.findOne({
            _id: artist_name,
        });

        const ch_album = await Album.findOne({
            _id: req.params.albumid,
        });
        var file_path = ch_album.file_path;
        var file_name = ch_album.file_name;
        var delete_count  = 0;
        if(deletefile){ // 원래 저장된 파일 삭제
            for(i = 0; i < deletefile.length; i++){
                deletefile_num = deletefile[i] - delete_count;
                file_path.splice(deletefile_num, 1);
                file_name.splice(deletefile_num, 1);
                delete_count++;
            }
        }
        if(req.files){
            for(i = 0; i < req.files.length; i++){
                file_path.push({path: "/img/album/" + req.files[i].filename});
                file_name.push({name: req.files[i].originalname});
            }
        }

        await Album.updateOne({_id: req.params.albumid,}, {
            $set : { 
                album_name,
                artist_id,
                artist_name: artist_id.name,
                file_path,
                file_name,
                release_date,
            }
        });
        // song에서 받아가는 album 관련 정보 동시 수정
        const album = await Album.findOne({_id: req.params.albumid,});
        if(file_name.length){
            await Song.updateMany({album_id:req.params.albumid,}, {
                $set : {
                    artist_id,
                    artist_name: artist_id.name,
                    release_date,
                    photo: album.file_path[file_name.length-1].path,
                }
            });
        } else {
            await Song.updateMany({album_id:req.params.albumid,}, {
                $set : {
                    artist_id,
                    artist_name: artist_id.name,
                    release_date,
                    photo: null,
                }
            });
        }
        res.redirect('/add_info');
    }catch(err){
        console.error(err);
        next(err);
    }
});

// add_info/change_song 화면 반환 (음원 정보 수정)
router.get('/change/song/:songid', async(req, res, next) => {
    try{
        const song = await Song.findOne({_id: req.params.songid,});
        const album = await Album.findOne({_id: song.album_id,});
        const artist_all = await Artist.find().sort({start_date: 1});
        const album_all = await Album.find().sort({release_date: 1,});
        res.render('add_info/change_song', { song, album, artist_all, album_all });
    } catch(err){
        console.error(err);
        return next(err);
    }
});

// add_info/change_song 화면에 입력된 값 데이터베이스에 수정 (음원 정보 수정)
router.post('/change/song/:songid', upload_album.array('file'), async(req, res, next) => {
    try{
        const { song_name, artist_name, album_name, deletefile } = req.body;
        // artist name 조회를 위해 artist_name으로 넘어온 아티스트의 id 값으로 컬럼 조회
        const artist = await Artist.findOne({
            _id: artist_name,
        });

        const album = await Album.findOne({
            _id: album_name,
        })

        const ch_song = await Song.findOne({ // 원래 있던 음원 정보를 받아오기 위함
            _id: req.params.songid,
        });
        var src = ch_song.src; // 원래 있떤 음원 정보 
        if(deletefile){ // 원래 저장된 파일 삭제
            for(i = 0; i < deletefile.length; i++){
                src = null;
            }
        }
        if(req.files){ // 새로운 파일 저장
            for(i = 0; i < req.files.length; i++){
                src =  "/song/" + req.files[i].filename;
            }
        }

        var len = album.file_path.length-1;
        if(len==-1){ // 앨범 포토가 없는 경우
            var photo_src = null;
        } else { // 저장된 앨범 포토 중 가장 최근 사진
            var photo_src = album.file_path[len].path;
        }

        await Song.updateOne({_id:req.params.songid,}, {
            $set : {
                song_name,
                artist_id: artist._id,
                artist_name: artist.name,
                album_id: album_name,
                src,
                release_date:album.release_date,
                photo: photo_src, 
            }
        });
        res.redirect('/add_info');
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;