import { useContext, useState } from "react";
import { dispatchTasksContext, tasksContext } from "./constants";
import Task from "./Task";
import { Source, TaskType } from "./types";

interface TasksListProps {
  source: Source;
}
export default function TasksList({ source = "original" }: TasksListProps) {
  const tasks = useContext<TaskType[] | null>(tasksContext);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  if (tasks) {
    switch (source) {
      case "dashboard": {
        const todayTasks = tasks.filter((task: TaskType) => {
          return (
            task.due_date.slice(0, 10) === new Date().toISOString().slice(0, 10)
          );
        });
        let tasksInformation;
        if (todayTasks.length !== 0) {
          tasksInformation = todayTasks.map((task: TaskType) => {
            return (
              <Task
                key={tasks.length + 1}
                task={task}
                source={source}
                onSelectTask={() => setSelectedTask(task)}
              />
            );
          });
        } else {
          tasksInformation = <p>No tasks are scheduled for today</p>;
        }
        return (
          <div className="tasks-list">
            <div className={source}>{tasksInformation}</div>
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
}

type ModalProps = {
  task: TaskType | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskType | null>>;
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
          <span className="material-symbols-outlined">close</span>
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
                task: { ...task, description: e.target.textContent },
              });
            }
          }}
        >
          {task.description === "" ? "" : task.description}
        </div>
      </div>
    );
  }
}
