import sequelize from "../../database.js";
import { DataTypes } from "sequelize";

const Task = sequelize.define("Task", {
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    task_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reminders: {
        type: DataTypes.ARRAY(DataTypes.DATE)
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    user: {
        type: DataTypes.UUID,
        references: {
            model: "Users",
            key: "_id"
        }
    }
})

export default Task