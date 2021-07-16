const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId }} = Schema;
const songSchema = new Schema({
    album_id: { // 앨범 고유 번호
        type: ObjectId,
        required: true, // 필수값
        ref: 'Album'
    },
    song_name: { // 노래 제목
        type: String,
        required: true,
    },
    artist_id: { // 아티스트 고유 ObjectId 값
        type: ObjectId,
        required: true,
        ref: 'Artist'
    },
    artist_name: { // 아티스트 이름
        type: String,
        required: true,
    },
    src: { // 파일 저장 경로 , 추후 playlist에서 가져다 쓸 예정
        type: String,
        required: true,
    },
    release_date: { // 출시일
        type: Date,
        required: true,
    },
    photo: { // 음원 사진
        type: String,
    },
    click: { // 음원이 플레이 리스트에 담긴 횟수
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Song', songSchema); // Song 테이블 export