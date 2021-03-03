var mongoose = require('mongoose');

var MessagesSchema = mongoose.Schema({
    from_id: Object,
    to_id: Object,
    content: String,
    read_user_id1: Boolean,
    read_user_id2: Boolean,
    date: Date,
    delete_user_id1: Boolean,
    delete_user_id2: Boolean,
});

const MessagesModel = mongoose.model('messages', MessagesSchema);

module.exports = MessagesModel;