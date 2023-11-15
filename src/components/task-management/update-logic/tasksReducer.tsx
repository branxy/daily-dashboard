import { Action, Tasks } from "../types";

export function tasksReducer(tasks: Tasks, action: Action): Tasks {
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
        const options: Record<string, string> = {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        return [
          {
            id: action.id,
            title: action.title,
            text: "",
            dueDate: new Date(),
            status: "Not started",
            dateCreated: new Date().toLocaleString(undefined, options),
          },
          ...tasks,
        ];
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
