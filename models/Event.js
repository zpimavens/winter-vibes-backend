const mongoose = require('mongoose')

// TODO
const EventSchema = new mongoose.Schema
({
    id:{type:Number,required:true},
    name:{type:String,required:true},
    owner:{type:String,required:true},
    skiArena:{type:String,required:true},
    description:{type:String,required:true},
    data:{type:String,require:true},
    image:{type:String,required:true}
});

module.exports = mongoose.model('event',Schema)