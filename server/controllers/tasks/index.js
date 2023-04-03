import express from "express";
import Task from "../../models/postgres/Task.js";
import User from "../../models/postgres/User.js";
import { scheduleJob, scheduledJobs } from "node-schedule";
import { isAuthenticated } from "../../middleware/auth/index.js";
import scheduleReminders from "../../utils/scheduleReminders.js";
import setReminders from "../../utils/setReminders.js";
import { taskValidation, errorMiddleware } from "../../middleware/validations/index.js";
const router = express.Router();


router.post("/add", isAuthenticated,taskValidation(),errorMiddleware, async (req, res) => {
  try {
    let findEmail = await User.findOne({where: { _id: req.payload.id }});
    if (!findEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    let id = findEmail._id;
    console.log(id)
    let { task_name, deadline } = req.body;
    console.log(deadline)
    
    let current = Date.now();
    console.log(current)
    if (deadline < current) {
      return res.status(400).json({ error: "Invalid Date " });
    }
    let reminders = setReminders(deadline, current);
    console.log("id: ***", id)
    let saved = await Task.create({
      task_name,
      deadline,
      reminders,
      user: id,
    });
    

    scheduleReminders(
      saved._id,
      task_name,
      findEmail.email,
      reminders,
      deadline
    );

    return res.status(200).json({ message: "Successfully added the task" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:task_id", isAuthenticated, async (req, res) => {
  try {
    let task_id = req.params.task_id;
    let task = await Task.findOne({where: { _id: task_id }});
    if (!task) {
      return res.status(400).json({ error: "Task not found" });
    }
    let user = await User.findOne({where:{ _id: req.payload.id }});

    if (!user || task.user != user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    let { isCompleted, task_name, deadline } = req.body;

    if(!task_name){
      return res.status(400).json({error: "Task name cannot be empty"})
    }
    if (isCompleted) {
      //if task is completed

      for (let key in scheduledJobs) {
        if (key.split(" ")[0] == task_id) {
          scheduledJobs[key].cancel();
        }
      }
      console.log(scheduledJobs);
      // await Task.updateOne(
      //   { _id: task_id },
      //   { $set: { isCompleted: true, task_name: task_name } }
      // );
      await Task.update({isCompleted: true, task_name: task_name}, {where: {_id: task_id}})
      return res.status(200).json({ message: "Task completed" });
    }

    let reminders = [];

    let old = Date.parse(task.deadline);
    let current = Date.now();
    // console.log("old",old)
    // console.log("current",current)
    // console.log("deadline", deadline)
    if (deadline && deadline != old) {
      //if we have a new deadline
      if (deadline < current) {
        return res.status(400).json({ error: "Invalid date" });
      }

      for (let key in scheduledJobs) {
        if (key.split(" ")[0] == task_id) {
          scheduledJobs[key].cancel();
        }
      }
      console.log(scheduledJobs);

      reminders = setReminders(deadline, current);
      scheduleReminders(
        task_id,
        task_name,
        user.email,
        reminders,
        new Date(deadline)
      );
      console.log(reminders)
      // await Task.updateOne(
      //   { _id: task_id },
      //   {
      //     $set: {
      //       task_name: task_name,
      //       reminders: reminders,
      //       deadline: new Date(deadline),
      //     },
      //   }
      // );
      console.log(deadline)
      await Task.update({task_name: task_name, reminders: reminders, deadline: deadline}, {where: {_id: task_id}})
      return res.status(200).json({ message: "Task updated successfully" });
    }

    //if we only want to update task name
    // await Task.updateOne({ _id: task_id }, { $set: { task_name: task_name } });
    await Task.update({task_name: task_name}, {where: {_id: task_id}})
    return res.status(200).json({ message: "Task name updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Internal server error"})
  }
});
export default router;

router.delete("/:task_id", isAuthenticated, async (req, res) => {
  try {
    let id = req.params.task_id;
    let task = await Task.findOne({where:{ _id: id }});
    let user = await User.findOne({where:{ _id: req.payload.id }});
    if (!task) {
      return res.status(400).json({ error: "Task does not exist" });
    }

    if (!user || task.user != user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    for (let key in scheduledJobs) {
      // console.log(key.split(" "), id)
      if (key.split(" ")[0] == (id)) {
        
        scheduledJobs[key].cancel();
      }
    }
    console.log(scheduledJobs)
    await Task.destroy({where:{ _id: id }});
    return res.status(200).json({ message: "Deleted task successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:task_id", isAuthenticated, async (req, res) => {
  try {
    let task = await Task.findOne({where:{ _id: req.params.task_id }});
    let user = await User.findOne({where:{ _id: req.payload.id }});
    if (!task) {
      return res.status(400).json({ error: "Task not found" });
    }
    if (!user || task.user != user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
