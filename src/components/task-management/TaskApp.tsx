import AddTask from "./AddTask";
import TasksList from "./TasksList";
import { TaskAppType } from "./types";
import { TasksProvider } from "./update-logic/tasksContext";

type TaskAppProps = {
  source: TaskAppType["source"];
};

function TaskApp({ source }: TaskAppProps) {
  switch (source) {
    case "dashboard": {
      return (
        <div className="to-do-app">
          <TasksProvider>
            <TasksList source="dashboard" />
          </TasksProvider>
        </div>
      );
    }
    default: {
      return (
        <div className="to-do-app">
          <h2>To-do list</h2>
          <TasksProvider>
            <AddTask />
            {/* <SortFilterPanel /> */}
            <TasksList source="original" />
          </TasksProvider>
        </div>
      );
    }
  }
}

export default TaskApp;
