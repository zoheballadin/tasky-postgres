import axios from "axios";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
export const TaskRow = ({ task, setTasks }) => {
  let navigate = useNavigate();
  const deleteTask = async () => {
    try {
      let token = localStorage.getItem("token");
      token = JSON.parse(token);
      let { data } = await axios.delete(`/api/task/${task._id}`, {
        headers: {
          "auth-token": token.token,
        },
      });
      console.log(data);
      let newData = await axios.get("/api/user/tasks", {
        headers: {
          "auth-token": token.token,
        },
      });
      console.log(newData.data)
      setTasks(newData.data)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <tr className="taskrow">
      <td className="td">{task.task_name}</td>
      <td className="td">{task.deadline}</td>
      <td className="td">{task.isCompleted ? "Yes" : "No"}</td>
      <td>
        <AiOutlineEdit
          onClick={() => navigate(`/task/edit/${task._id}`)}
          style={{ fontSize: "2.9vh", cursor: "pointer" }}
        />
      </td>
      <td>
        <AiFillDelete onClick={()=>deleteTask()} style={{ fontSize: "2.9vh", cursor: "pointer" }} />
      </td>
    </tr>
  );
};
