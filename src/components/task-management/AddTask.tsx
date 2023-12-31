import { useState, useContext, ChangeEvent } from "react";

import { dispatchTasksContext, tasksContext } from "./constants";
import { Tasks } from "./types";

export default function AddTask() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const tasks = useContext(tasksContext) as Tasks;
  const dispatch = useContext(dispatchTasksContext);
  let nextId = tasks.length + 1;
  function handleNewTaskTitle(e: ChangeEvent<HTMLInputElement>) {
    setNewTaskTitle(e.target.value);
  }

  return (
    <div className="add-todo">
      <input
        type="text"
        placeholder="Add a task"
        value={newTaskTitle}
        onChange={handleNewTaskTitle}
        onKeyDown={(e) => {
          if (e.key === "Enter" && newTaskTitle.length > 0) {
            setNewTaskTitle("");
            dispatch({
              type: "added",
              id: nextId++,
              title: newTaskTitle,
            });
          }
        }}
      ></input>
      <button
        className="primary"
        disabled={newTaskTitle.length === 0}
        onClick={() => {
          setNewTaskTitle("");
          dispatch({
            type: "added",
            id: nextId++,
            title: newTaskTitle,
          });
        }}
      >
        Add task
      </button>
    </div>
  );
}
