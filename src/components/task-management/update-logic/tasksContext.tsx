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
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    return () => {
      if (loadedTasks !== undefined)
        localStorage.setItem("tasks", JSON.stringify(loadedTasks));
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function loadTasksFromStorage() {
    const savedTasks: Tasks =
      JSON.parse(localStorage.getItem("tasks") as string) || [];

    if (
      savedTasks.length === 0 ||
      savedTasks.every((task) => task.title === "Example task")
    ) {
      dispatch({ type: "init", tasks: exampleTask });
      return savedTasks;
    } else {
      const convertedTasks = savedTasks.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
      dispatch({ type: "init", tasks: convertedTasks });
      return convertedTasks;
    }
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
