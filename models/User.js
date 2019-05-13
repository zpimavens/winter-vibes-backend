const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique:true},
    town: {type: String, required: false, default:"Unknown"},
    skis: {type: String, required: false,default:""},
    level: {type: Number, required: true,default:0},
    trophies:{type:[String],required:true, default:[]},
    activated:{type:Boolean,required:true,default:false},
    activation_hash: {type:String, required:true},
    created: {type:Date, required:true, default: new Date()},
    groups:{type:[String], default:[]},
    friends:{type:[String], default:[]}
    /*visited:[{  areaName:String,
                visitDate:Date
            }]*/
});

UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        try {
            const hashedPassword = await bcrypt.hash(this.password, saltRounds);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }

    }
});

UserSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same){
        if(err){
            callback(err);
        }
        else{
            callback(err, same);
        }
    })
}
module.exports = mongoose.model('User', UserSchema);