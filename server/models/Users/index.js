import mongoose from "mongoose";

// const taskSchema = {
//     task_name: {
//         type: String,
//         require: true
//     },
//     isCompleted: {
//         type: Boolean,
//         required: true,
//         default: false
//     },
//     deadline: {
//         type: Date,
//         requried: true
//     }
// }

let userSchema = new mongoose.Schema({
    firstname : {
        type: String, 
        required: true,
        maxLength: 30
    },
    lastname: {
        type: String,
        required: true,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        maxLength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true, 
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,

    },
    role: {
        type: String,
        default: "user"
    },
    userverifyToken: {
        email: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null
        }
    },
    isVerified: {
        email: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        }
    }
    // ,todos: [taskSchema]

})

let User = mongoose.model("User", userSchema, "users")

export default User