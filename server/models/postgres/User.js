import { DataTypes } from "sequelize";
import sequelize from "../../database.js";

const User = sequelize.define("User", {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "user"
    },
    emailToken: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    phoneToken: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    emailStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    phoneStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

})

export default User
