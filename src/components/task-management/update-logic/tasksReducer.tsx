import { Database } from "../../../../types_supabase";
import { supabase } from "../../../supabaseClient";
import { Action, Tasks } from "../types";

export function tasksReducer(tasks, action: Action) {
  async function uploadTask(task) {
    const { error } = await supabase.from("todos").insert(task);
    if (error) console.log(error);
  }

  function compareStatus(a: string, b: string): number {
    const statusOrder = ["Not started", "In progress", "Done"];
    return statusOrder.indexOf(a) - statusOrder.indexOf(b);
  }

  switch (action.type) {
    case "init": {
      if ("tasks" in action) return action.tasks;
      throw new Error("Unexpected type of action");
    }
    case "added": {
      if ("id" in action && "title" in action) {
        const newTask = {
          title: action.title,
          description: "",
          due_date: new Date().toISOString(),
          status: "Not started",
          date_created: new Date().toISOString(),
        };

        uploadTask(newTask);
        return [newTask, ...tasks];
      }
      throw new Error("Unexpected type of action");
    }
    case "changed": {
      if ("task" in action) {
        return tasks.map((t) => {
          if (t.id === action.task.id) {
            return action.task;
          } else return t;
        });
      }
      throw new Error("Unexpected type of action");
    }
    case "deleted": {
      if ("id" in action) return tasks.filter((task) => task.id !== action.id);
      throw new Error("Unexpected type of action");
    }
    case "sorted-reverse": {
      return [...tasks].reverse();
    }
    case "sort-by-date-ascending": {
      return [...tasks].sort(
        (a, b) =>
          new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
      );
    }
    case "sort-by-status": {
      return [...tasks].sort((a, b) => compareStatus(a.status, b.status));
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
}

export default tasksReducer;
