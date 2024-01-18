import { supabase } from "../../../supabaseClient";

import { useReducer, useEffect, Reducer } from "react";
import tasksReducer from "./tasksReducer";
import { tasksContext, dispatchTasksContext } from "../constants";
import { ReducerAction, TaskType } from "../types";

export function TasksProvider({ ...children }) {
  const [tasks, dispatch] = useReducer<Reducer<TaskType[], ReducerAction>>(
    tasksReducer,
    []
  );

  useEffect(() => {
    async function loadTasksFromStorage() {
      const { data, error } = await supabase.from("todos").select();
      if (error) {
        console.error({ error });
      }
      if (data && data.length === 0) {
        dispatch({ type: "added", title: "Example task" });
      }
      if (data && data.length > 0) {
        dispatch({ type: "init", tasks: data });
      }
    }

    loadTasksFromStorage();
  }, []);

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
