const mongoose = require('mongoose'); // mongoose 모듈 가져오기

const { Schema } = mongoose; // mongoose 에서 제공하는 Schema 가져오기
const { Types: { ObjectId }} = Schema; // ObjectId 타입 선언
const artistSchema = new Schema({ // 새로운 Schema 선언
    name: { // 아티스트 이름 (그룹이라면 그룹명, 솔로라면 아티스트 이름)
        type: String, // 타입은 String
        required: true, // 필수 값
    },
    member: { // 멤버 (그룹이라면 멤버이름 저장, 솔로면 저장 X)
        type: Schema.Types.Mixed,
    },
    start_date: { // 데뷔 날짜
        type: Date, // 타입은 Date
        required: true, // 필수 값
    },
    file_path: { // (아티스트 사진)파일이 저장될 경로
        type: Schema.Types.Mixed,
    },
    file_name: { // (아티스트 사진)파일명
        type: Schema.Types.Mixed,
    },
    artist_detail: { // 아티스트 설명
        type: String, 
    },
    
});

module.exports = mongoose.model('Artist', artistSchema); // Artist 라는 이름으로 artistSchema export