const mongoose = require('mongoose')


const GroupSchema = new mongoose.Schema
({
    id:{type:Number,required:true,unique:true},
    name:{type:String,required:true},
    owner:{type:String,required:true},
    private:{type:Boolean, required:true},
    description:{type:String,required:false},
    members:{type:[String],default:[owner]},
    currentEvents:{type:[String],default:[]},
    pastEvents:{type:[String],default:[]}
});
module.exports = mongoose.model('group',GroupSchema)