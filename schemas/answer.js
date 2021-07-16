const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId }} = Schema;
const answerSchema = new Schema({
    question: { // 게시판 ObjectId
        type: ObjectId,
        required: true,
        ref: 'Question',
    },
    user_id: { // 댓글 사용자 id
        type: Number,
        required: true,
    },
    user_name: { // 댓글 사용자 이름
        type: String,
        required: true,
    },
    content: { // 댓글 내용
        type: String,
        required: true,
    },
    createdAt: { // 댓글 작성 시간
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Answer', answerSchema); // 댓글 DB export