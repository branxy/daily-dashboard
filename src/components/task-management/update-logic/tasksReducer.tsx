import { Tables } from "../../../../types_supabase";
import { supabase } from "../../../supabaseClient";

type Task = Tables<"todos">;
type TaskInsert = Omit<Task, "id" | "user_id">;
type Action =
  | {
      type: "init";
      tasks: Task[];
    }
  | {
      type: "added";
      title: string;
    }
  | {
      type: "changed";
      task: Task;
    }
  | {
      type: "deleted";
      id: number;
    };

export function tasksReducer(tasks: Task[], action: Action) {
  async function uploadTask(task: TaskInsert) {
    const { error } = await supabase.from("todos").insert(task);
    if (error) console.log(error);
  }

  async function updateTask(task: Task) {
    const { error } = await supabase
      .from("todos")
      .update(task)
      .eq("id", task.id);

    if (error) {
      console.error(error);
    }
  }

  async function deleteTask(id: number) {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) console.error(error);
  }

  switch (action.type) {
    case "init": {
      if ("tasks" in action) return action.tasks;
      throw new Error("Unexpected type of action");
    }
    case "added": {
      if ("title" in action) {
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
            updateTask(action.task);
            return action.task;
          } else return t;
        });
      }
      throw new Error("Unexpected type of action");
    }
    case "deleted": {
      if ("id" in action) {
        deleteTask(action.id);
        return tasks.filter((task) => task.id !== action.id);
      }
      throw new Error("Unexpected type of action");
    }
    default: {
      throw new Error("Unknown action: " + action);
    }
  }
}

export default tasksReducer;
