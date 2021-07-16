const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId }} = Schema;
const albumSchema = new Schema({
    album_name: { // 앨범 제목
        type: String,
        required: true,
    },
    artist_id: { // 아티스트 고유 ObjectId 값
        type: ObjectId,
        required: true,
        ref: 'Artist'
    },
    artist_name: { // 아티스트 이름 (그룹이라면 그룹명, 솔로라면 아티스트 이름)
        type: String,
        required: true,
    },
    release_date: { // 출시일
        type: Date,
        required: true,
    },
    file_path: { // (앨범 사진)파일이 저장될 경로
        type: Schema.Types.Mixed,
    },
    file_name: { // (앨범 사진)파일명
        type: Schema.Types.Mixed,
    }, 
    click: {
        type: Number,
    },
});

module.exports = mongoose.model('Album', albumSchema); // Album 테이블 export