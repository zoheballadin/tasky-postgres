import sendMail from "./mailer.js";
import { scheduleJob, scheduledJobs } from "node-schedule";
const scheduleReminders = (task_id, task_name, email, reminders,deadline ) =>{

  reminders.forEach((item,index) => {
    scheduleJob(`${task_id} ${index}`, item, () => {
      console.log(`Reminder ${index + 1} sent`)
    sendMail({
      text: `This is reminder ${index+1} for your  task: ` + task_name,
      subject: ` reminder ${index+1}`,
      receiver: email,
    });
  });
  })

    

    scheduleJob(`${task_id} 3`, deadline, () => {
        console.log("Reminder 4 sent")
      sendMail({
        text: "Your time is up for your task: " + task_name,
        subject: "Time up",
        receiver: email,
      });
    });
    console.log(scheduledJobs)
}

export default scheduleReminders