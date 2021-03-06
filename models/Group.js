const mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose);


const GroupSchema = new mongoose.Schema
({
    // _id:{type:Number},
    name:{type:String,required:true,unique:true},
    owner:{type:String,required:true},
    isPrivate:{type:Boolean, required:true},
    description:{type:String,required:false},
    otherMembers:{type:[String],required:true},
    currentEvents:{type:[String],default:[]},
    pastEvents:{type:[String],default:[]}
});
GroupSchema.plugin(autoIncrement, {id:'group_seq',inc_field: 'id'});

module.exports = mongoose.model('Group',GroupSchema)