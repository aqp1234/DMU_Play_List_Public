const mongoose = require('mongoose');

const { Schema } = mongoose;
const playlistSchema = new Schema({
    user_id: {
        type: Number,
        required: true,
    },
    num: {
        type: Number,
        required: true,
    },
    song_name: {
        type: String,
        required: true,
    },
    src: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Playlist', playlistSchema);