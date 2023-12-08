import { createContext } from "react";
import { Dispatch, Tasks } from "./types";

export const tasksContext = createContext<Tasks | null>(null);
export const dispatchTasksContext = createContext<Dispatch>(() => {
  throw new Error("dispatchTasksContext is used without a provider");
});
