var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
    from_id: String,
    to_id: String,
    content: String,
    read_user_id1: String,
    read_user_id2: String,
    date: String,
    delete_user_id1: String,
    delete_user_id2: String,
});

const MessageModel = mongoose.model('users', UserSchema);

module.exports = MessageModel;