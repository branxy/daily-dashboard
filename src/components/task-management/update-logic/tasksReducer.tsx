import { supabase } from "../../../supabaseClient";
import { ReducerAction, TaskType, TaskInsert } from "../types";

async function uploadTask(task: TaskInsert) {
  const { error } = await supabase.from("todos").insert(task);
  if (error) console.log(error);
}

async function updateTask(task: TaskType) {
  const { error } = await supabase.from("todos").update(task).eq("id", task.id);

  if (error) {
    console.error(error);
  }
}

async function deleteTask(id: number) {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) console.error(error);
}

export function tasksReducer(
  tasks: TaskType[],
  action: ReducerAction
): TaskType[] {
  switch (action.type) {
    case "init": {
      if ("tasks" in action) return action.tasks;
      break;
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
        return [newTask as TaskType, ...tasks];
      }
      break;
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
      break;
    }
    case "deleted": {
      if ("id" in action) {
        deleteTask(action.id);
        return tasks.filter((task) => task.id !== action.id);
      }
      break;
    }
  }
  throw new Error("Unknown type of reducer action:" + action);
}

export default tasksReducer;
