const mongoose = require('mongoose')
const Schema = mongoose.Schema


const SkiAreaSchema = new Schema
({
    //country:String,
    name:String,
    openHours:String,
    easyRoute:String,
    mediumRoute:String,
    hardRoute:String,
    freeRide:String

})



const SkiArea = mongoose.model('skiarea',SkiAreaSchema)

module.exports = SkiArea