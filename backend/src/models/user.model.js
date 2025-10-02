import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique:true,
    },
    name: {
        type:String,
        required:true,
    },
    image: {
        type:String,
        required:true,
    },
    clerkId:{
        type:String,
        required:true,
        unique:true,
    }
}, {timestamps: true});

export const UserModel = mongoose.model('User', userSchema);

