const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        // minLength: 3,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
    },
    // password:{
    //     type:String,
    //     required:true,
        
    // },
    //Normal users → password required
    //Google users → password not required
    password:{
    type:String,
    required:function(){
        return !this.googleId;
    }
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    },
    authProvider:{
        type:String,
        enum:["local","google"],
        default:"local"
    },
    age: {
        type: Number,
        min: 10,
        max: 80,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    problemSolved: {
        type: [{
            type:Schema.Types.ObjectId,
            ref:'Problem'
        }],
        default: [],
        // unique:true
    },
    
}, { timestamps: true });

userSchema.post('findOneAndDelete',async function(userInfo){
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId:userInfo._id});
    }
} )

const User = mongoose.model("user", userSchema);

module.exports = User;