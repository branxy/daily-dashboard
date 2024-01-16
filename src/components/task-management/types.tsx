// type Status = "Not started" | "In progress" | "Done";

export type TaskAppType = {
  readonly source?: string;
};

// export type TaskItem = {
//   id: number;
//   title: string;
//   text: string;
//   dueDate: Date;
//   readonly status: "Not started" | "In progress" | "Done";
//   dateCreated: string;
// };

// export type Tasks = TaskItem[] | [];

type EmptyAction = { type: string };

type ActionInit = {
  type: "init";
  tasks: TaskItem[];
};

type ActionAdded = {
  type: "added";
  id: number;
  title: string;
};

type ActionChanged = {
  type: "changed";
  task: TaskItem;
};

type ActionDeleted = {
  type: "deleted";
  id: number;
};

export type Action =
  | EmptyAction
  | ActionInit
  | ActionAdded
  | ActionChanged
  | ActionDeleted;

export type Dispatch = (obj: Action) => void;
