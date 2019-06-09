const mongoose = require('mongoose')

// TODO
const EventSchema = new mongoose.Schema
({
   // id:{type:String,required:true, unique:true},
    group:{type:String, required:true},
    name:{type:String,required:true},
    owner:{type:String,required:true},
    skiArena:{type:String,required:true},
    isPrivate:{type:Boolean, required:true},
    description:{type:String,required:true},
    startDate:{type:Date, required:true},
    endDate:{type:Date, required:true},
    isCurrent:{type:Boolean, required:true, default:true}
    // data:{type:String,require:true}, - nie wiem co to jest, ale według mnie jest niepotrzebne 
    // image:{type:String,required:true} - po co?
});

module.exports = mongoose.model('event', EventSchema)