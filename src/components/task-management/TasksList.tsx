import { useContext, useState } from "react";
import { dispatchTasksContext, tasksContext } from "./constants";
import Task from "./Task";
import { TaskAppType, TaskItem, Tasks } from "./types";
import { Database } from "../../../types_supabase";

type TasksListProps = {
  source: TaskAppType["source"];
};

const exampleTaskFromSpb = {
  id: 3,
  title: "test task 1 spb",
  description: null,
  due_date: "2024-01-16T07:25:33.656423+00:00",
  status: "not-started",
  date_created: "2024-01-16T07:25:33.656423+00:00",
  user_id: "23ddd7b6-0faf-4d3c-86ee-8ae64b221965",
};

export default function TasksList({ source = "original" }: TasksListProps) {
  const tasks = useContext(tasksContext);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  switch (source) {
    case "dashboard": {
      const todayTasks = tasks.filter((task) => {
        return (
          task.due_date.slice(0, 10) === new Date().toISOString().slice(0, 10)
        );
      });
      let tasksInformation;
      if (todayTasks.length !== 0) {
        tasksInformation = todayTasks.map((task: TaskItem) => {
          return (
            <Task
              key={task.id}
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
