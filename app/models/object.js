// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var objectSchema = mongoose.Schema({
    name:String,
    type:String,
    description: String,
    prix:String,
    adresse:String,
    longitude:String,
    latitude:String,
    dateDebut:String,
    dateFin:String,
    typeTransac:String,
    image: {data: Buffer, contentType: String}
});

module.exports = mongoose.model('Object', objectSchema);