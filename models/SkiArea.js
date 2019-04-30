const mongoose = require('mongoose')


const SkiAreaSchema = new mongoose.Schema
({
    name:String,
    description:String,
    country:String,
    openHours:String,
    easyRoute:String,
    mediumRoute:String,
    hardRoute:String,
    freeride:String,
    snowpark:{type:[String], default:[]}

});


module.exports = mongoose.model('skiarea',SkiAreaSchema)