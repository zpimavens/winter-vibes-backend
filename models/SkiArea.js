const mongoose = require('mongoose')

// Scraped anyway so there is no need to be precised about this model

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
    nightRide:Boolean,
    dragLift:Number,
    chairLift:Number,
    gondolas:Number,
    imgsUrl:{type:[String], default:[]},
    snowpark:{type:[String], default:[]},
    events:{type:[String], default: []},
    skiRental:String,
    skiSchool:String,
});
module.exports = mongoose.model('skiarea',SkiAreaSchema)