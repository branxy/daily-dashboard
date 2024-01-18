import { Tables } from "../../../types_supabase";

export type TaskType = Tables<"todos">;
export type TaskInsert = Omit<TaskType, "id" | "user_id">;

export type ReducerAction =
  | {
      type: "init";
      tasks: TaskType[];
    }
  | {
      type: "added";
      title: TaskType["title"];
    }
  | {
      type: "changed";
      task: TaskType;
    }
  | {
      type: "deleted";
      id: TaskType["id"];
    };

export type Source = "dashboard" | "original";
export type ReducerDispatch = (action: ReducerAction) => void;
