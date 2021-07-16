//문의 몽고 DB
const mongoose = require('mongoose');

const { Schema } = mongoose;
const questionSchema = new Schema({
    user_id: { // 사용자 고유 id
        type: Number, // 타입 숫자
        required: true,
    },
    user_name: { // 사용자 이름
        type: String,
        required: true,
    },
    subject: { // 제목
        type: String,
    },
    content: { // 내용
        type: String,
    },
    is_answer: { //답변여부
        type: Boolean,
        default: false,
    },
    is_secret: {
        type: Boolean,
        default: false,
    },
    createdAt: { // 작성 날짜
        type: Date,
        default: Date.now, // 기본값 현재시간
    },
});

module.exports = mongoose.model('Question', questionSchema); // 문의  DB export