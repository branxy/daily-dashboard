import { useContext, useState } from "react";
import { dispatchTasksContext, tasksContext } from "./constants";
import Task from "./Task";
import { TaskAppType, TaskItem, Tasks } from "./types";

type TasksListProps = {
  source: TaskAppType["source"];
};

export default function TasksList({ source = "original" }: TasksListProps) {
  const tasks = useContext(tasksContext) as Tasks;
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  switch (source) {
    case "dashboard": {
      const todayTasks = tasks.filter((task) => {
        return task.dueDate.toDateString() === new Date().toDateString();
      });
      return (
        <div className="tasks-list">
          <div className={source}>
            {todayTasks.map((task: TaskItem) => {
              return (
                <Task
                  key={task.id}
                  task={task}
                  source={source}
                  onSelectTask={() => setSelectedTask(task)}
                />
              );
            })}
          </div>
        </div>
      );
    }
    default: {
      return (
        <>
          <div className="tasks-list">
            <div className={source}>
              {tasks.map((task) => {
                return (
                  <Task
                    key={task.id}
                    task={task}
                    source={source}
                    onSelectTask={() => setSelectedTask(task)}
                  />
                );
              })}
            </div>
            <Modal task={selectedTask} setSelectedTask={setSelectedTask} />
          </div>
        </>
      );
    }
  }
}

type ModalProps = {
  task: TaskItem | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskItem | null>>;
};

function Modal({ task, setSelectedTask }: ModalProps) {
  const dispatch = useContext(dispatchTasksContext);
  if (task !== null) {
    return (
      <div className="modal">
        <button
          className="close-modal-btn"
          onClick={() => setSelectedTask(null)}
        >
          X
        </button>
        <div
          className="title"
          contentEditable={true}
          onInput={(e: React.ChangeEvent<HTMLDivElement>) => {
            if (e.target.textContent) {
              dispatch({
                type: "changed",
                task: { ...task, title: e.target.textContent },
              });
            }
          }}
        >
          {task.title}
        </div>
        <div
          className="body"
          contentEditable="true"
          onInput={(e: React.ChangeEvent<HTMLDivElement>) => {
            if (e.target.textContent) {
              dispatch({
                type: "changed",
                task: { ...task, text: e.target.textContent },
              });
            }
          }}
        >
          {task.text === "" ? "" : task.text}
        </div>
      </div>
    );
  }
}
