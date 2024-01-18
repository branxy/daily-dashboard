import { createContext } from "react";
import { ReducerDispatch, TaskType } from "./types";

export const tasksContext = createContext<TaskType[] | null>(null);
export const dispatchTasksContext = createContext<ReducerDispatch>(() => {
  throw new Error("dispatchTasksContext is used without a provider");
});
