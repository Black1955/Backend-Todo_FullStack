import {Schema, model} from "mongoose";

const user = new Schema({
    name: {
        type: String,
        required: true,
        default: '',
    },
    email: {
        type: String,
        required: true,
        default: '',
        unique: true
    },
    password: {
        type: String,
        required: true,
        default: '',
    },
    imageURL: {
        type: String,
        default:''
    }
}, {
    timestamps: true
})

export default model('Users', user)