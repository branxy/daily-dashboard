import { useReducer, useEffect } from "react";
import { Tasks } from "../types";
import tasksReducer from "./tasksReducer";
import { tasksContext, dispatchTasksContext } from "../constants";

export function TasksProvider({ ...children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  useEffect(() => {
    const savedTasks: Tasks = JSON.parse(
      localStorage.getItem("tasks") as string
    );
    if (savedTasks && savedTasks.length > 0) {
      const convertedTasks = savedTasks.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
      dispatch({ type: "init", tasks: convertedTasks });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      <tasksContext.Provider value={tasks}>
        <dispatchTasksContext.Provider
          value={dispatch}
          {...children}
        ></dispatchTasksContext.Provider>
      </tasksContext.Provider>
    </>
  );
}
