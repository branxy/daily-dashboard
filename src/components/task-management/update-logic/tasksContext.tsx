import { useReducer, useEffect } from "react";
import { TaskItem } from "../types";
import tasksReducer from "./tasksReducer";
import { tasksContext, dispatchTasksContext } from "../constants";
import { supabase } from "../../../supabaseClient";

const exampleTask: TaskItem[] = [
  {
    id: 1,
    title: "Example task",
    description: "",
    due_date: new Date().toISOString(),
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
  const [tasks, dispatch] = useReducer(tasksReducer, exampleTask);

  useEffect(() => {
    async function loadTasksFromStorage() {
      const { data, error } = await supabase.from("todos").select();
      if (error) {
        console.log({ error });
        return false;
      }
      if (data) {
        dispatch({ type: "init", tasks: data });
        return data;
      }
      // const savedTasks: Tasks =
      //   JSON.parse(localStorage.getItem("tasks") as string) || null;
      // if (savedTasks && savedTasks.length !== 0) {
      //   const convertedTasks = savedTasks.map((task) => ({
      //     ...task,
      //     dueDate: new Date(task.dueDate),
      //   }));
      //   return convertedTasks;
      //   // dispatch({ type: "init", tasks: convertedTasks });
      // } else return false;
    }

    loadTasksFromStorage();
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
