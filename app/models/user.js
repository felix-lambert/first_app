// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var messageSchema = mongoose.Schema({
    _creator: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String
});

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        name         : String,
        city         : String,
        age          : String,
        job          : String,
        email        : String,
        description  : String,
        password     : String,
        image        : {data: Buffer, contentType: String},
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    console.log('generateHash');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    console.log('validPassword');
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports.User = mongoose.model('User', userSchema);

module.exports.Message = mongoose.model('Message', messageSchema);
