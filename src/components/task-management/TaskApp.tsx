import AddTask from "./AddTask";
import TasksList from "./TasksList";
import { TaskAppType } from "./types";
import { TasksProvider } from "./update-logic/tasksContext";

type TaskAppProps = {
  source: TaskAppType["source"];
};

function TaskApp({ source }: TaskAppProps) {
  return (
    <TasksProvider>
      <TaskAppSwitcher source={source} />
    </TasksProvider>
  );
}

export default TaskApp;

function TaskAppSwitcher({ source }: TaskAppProps) {
  switch (source) {
    case "dashboard": {
      return (
        <div className="to-do-app">
            <TasksList source="dashboard" />
        </div>
      );
    }
    default: {
      return (
        <div className="to-do-app">
          <h2>To-do list</h2>
            <AddTask />
            <TasksList source="original" />
        </div>
      );
    }
  }
}
