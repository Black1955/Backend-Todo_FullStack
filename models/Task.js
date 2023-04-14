import {Schema, model} from "mongoose";

const task = new Schema({
    content: {
        type: String,
        required: true,
        default: ''
    },
    color: {
        type: String,
        default: '#000000'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: String,
        required: false,
        default: Date()
    }
},
    {
        timestamps: true
    })

export default model('Tasks', task)