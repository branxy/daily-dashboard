import { useReducer, useEffect } from "react";
import { TaskItem, Tasks } from "../types";
import tasksReducer from "./tasksReducer";
import { tasksContext, dispatchTasksContext } from "../constants";

const exampleTask: TaskItem[] = [
  {
    id: 1,
    title: "Example task",
    text: "",
    dueDate: new Date(),
    status: "Not started",
    dateCreated: new Date().toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

export function TasksProvider({ ...children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    loadTasksFromStorage() || exampleTask
  );

  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function loadTasksFromStorage() {
    const savedTasks: Tasks =
      JSON.parse(localStorage.getItem("tasks") as string) || null;
    if (savedTasks && savedTasks.length !== 0) {
      const convertedTasks = savedTasks.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
      return convertedTasks;
      // dispatch({ type: "init", tasks: convertedTasks });
    } else return false;
  }

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
