import { useReducer, useEffect } from "react";
import { TaskItem, Tasks } from "../types";
import tasksReducer from "./tasksReducer";
import { tasksContext, dispatchTasksContext } from "../constants";

const options = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
} as const;

const initialTasks: TaskItem[] = [
  {
    id: 1,
    title: "Example task",
    text: "",
    dueDate: new Date(),
    status: "Not started",
    dateCreated: new Date().toLocaleString(undefined, options),
  },
];

export function TasksProvider({ ...children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks, undefined);

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
