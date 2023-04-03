import Task from "./Task.js";
import User from "./User.js";


  Task.belongsTo(User, { foreignKey: "user",  onUpdate: "CASCADE" });
  // User.hasMany(Task, { foreignKey: "user",  onUpdate: "CASCADE" });

