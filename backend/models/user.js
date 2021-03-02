var mongoose = require('mongoose');

var ConversationSchema = mongoose.Schema({
    with_id : String,
    archived: Boolean,
    delete: Boolean,
    demand: Boolean,
    messages: { type: mongoose.Schema.Types.ObjectId, ref: 'message' },
   });

var UserSchema = mongoose.Schema({
    token: String,
    email : String,
    password : String,
    pseudo: String,
    birthDate : Date,
    is_adult: Boolean,
    problems_types: [String],
    problem_description: String,
    localisation: String,
    gender : String,
    avatar : String,
    statut: String,
    blocked_user_id: String,
    blocked_by_id: String,
    conversations: [ConversationSchema],
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;