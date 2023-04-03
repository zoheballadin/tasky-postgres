import mongoose from "mongoose";

let taskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    reminders: [Date],
    isCompleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

let Task = mongoose.model("Task", taskSchema, "tasks")
export default Task