import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { dispatchTasksContext } from "./constants";
import { Source, TaskType } from "./types";

type TaskProps = {
  readonly task: TaskType;
  source: Source;
  onSelectTask: () => void;
};

export default function Task({ task, source, onSelectTask }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const dispatch = useContext(dispatchTasksContext);
  function toggleEditing() {
    setIsEditing(!isEditing);
  }

  function handleUpdateDate(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const newDate = new Date(input.value).toISOString();

    function autoCloseDatePicker(e: MouseEvent) {
      if (e.target !== input) {
        setIsEditingDate(!isEditingDate);
      }
    }
    dispatch({
      type: "changed",
      task: { ...task, due_date: newDate },
    });
    document.addEventListener("click", autoCloseDatePicker, { once: true });
  }

  return (
    <div className="list-item">
      <div className="checkbox-and-title">
        <TaskCheckboxField task={task} />
        <TaskTitleField
          task={task}
          isEditing={isEditing}
          onSelectTask={onSelectTask}
        />
      </div>
      <div className="actions">
        <TaskDueDate
          dueDate={task.due_date}
          isEditingDate={isEditingDate}
          setIsEditingDate={setIsEditingDate}
          onInput={handleUpdateDate}
          source={source}
        />
        <StatusField task={task} />
        <DateCreatedField date={task.date_created} />
        <div className="edit-delete">
          <EditSaveBtn isEditing={isEditing} onIsEditing={toggleEditing} />
          <DeleteTaskBtn task={task} />
        </div>
      </div>
    </div>
  );
}

type TaskCheckboxFieldProps = {
  readonly task: TaskProps["task"];
};

function TaskCheckboxField({ task }: TaskCheckboxFieldProps) {
  const dispatch = useContext(dispatchTasksContext);
  const status = task.status === "Done" ? true : false;

  function handleCheckedTask(e: ChangeEvent<HTMLInputElement>) {
    const state = e.target.checked ? "Done" : "Not started";
    dispatch({
      type: "changed",
      task: { ...task, status: state },
    });
  }

  return (
    <input
      type="checkbox"
      checked={status}
      onChange={handleCheckedTask}
    ></input>
  );
}

type TaskDueDateProps = {
  readonly dueDate: string;
  readonly isEditingDate: boolean;
  setIsEditingDate: Dispatch<SetStateAction<boolean>>;
  onInput: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly source: Source;
};

function TaskDueDate({
  dueDate,
  isEditingDate,
  setIsEditingDate,
  onInput,
  source,
}: TaskDueDateProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  let dateContent;

  function getLocalDateTime(date: string, format: string) {
    const dateObj = new Date(date);

    const adjustedUTC = new Date(
      dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
    );
    const utcString = adjustedUTC.toISOString();

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = {
      timeZone: userTimeZone,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    } as const;
    const fullDate = new Date(date)
      .toLocaleString(undefined, options)
      .split(",")
      .join("");

    const minutes =
      Number(utcString.slice(14, 16)) < 10
        ? `0${utcString.slice(15, 15)}`
        : `${utcString.slice(14, 16)}`;
    const time = `${utcString.slice(11, 13)}:${minutes}`;
    switch (format) {
      case "fullDate":
        return fullDate;
        break;
      case "date":
        return utcString.slice(0, 16);
      case "time":
        return time;
        break;
      default:
        return date;
    }
  }

  if (isEditingDate) {
    dateContent = (
      <input
        ref={dateInputRef}
        type="datetime-local"
        name="due-date"
        value={getLocalDateTime(dueDate, "date")}
        onChange={onInput}
      />
    );
  } else {
    dateContent = (
      <button
        className="secondary"
        onClick={() => setIsEditingDate(!isEditingDate)}
      >
        {source === "original"
          ? getLocalDateTime(dueDate, "fullDate")
          : `Today ${getLocalDateTime(dueDate, "time")}`}
      </button>
    );
  }
  return <div className="due-date">{dateContent}</div>;
}

type TaskTitleFieldProps = {
  readonly task: TaskProps["task"];
  readonly isEditing: boolean;
  onSelectTask: () => void;
};

function TaskTitleField({
  task,
  isEditing,
  onSelectTask,
}: TaskTitleFieldProps) {
  const dispatch = useContext(dispatchTasksContext);

  let toDoContent;
  if (isEditing) {
    toDoContent = (
      <>
        <input
          type="text"
          value={task.title}
          style={{ flexGrow: 3, height: "100%" }}
          onChange={(e) => {
            dispatch({
              type: "changed",
              task: { ...task, title: e.target.value },
            });
          }}
          autoFocus
        ></input>
      </>
    );
  } else {
    toDoContent = (
      <>
        <div className="task-title" onClick={onSelectTask}>
          {task.status === "Done" ? <s>{task.title}</s> : task.title}
        </div>
      </>
    );
  }
  return <div className="list-item-title">{toDoContent}</div>;
}
type StatusFieldProps = {
  readonly task: TaskProps["task"];
};

function StatusField({ task }: StatusFieldProps) {
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const dispatch = useContext(dispatchTasksContext);
  const options = ["Not started", "In progress", "Done"] as const;

  function formatStatus(string: string) {
    return string.toLowerCase().split(" ").join("-");
  }

  function handleChangeStatus(
    task: TaskProps["task"],
    otherStatus: TaskProps["task"]["status"]
  ) {
    dispatch({
      type: "changed",
      task: { ...task, status: otherStatus },
    });
    setShowStatusOptions(false);
  }

  return (
    <>
      <div className="status">
        <button
          className={`current ${formatStatus(task.status)}`}
          onClick={() => setShowStatusOptions(true)}
        >
          {task.status}
        </button>
        {showStatusOptions && (
          <div className="options" onClick={() => setShowStatusOptions(false)}>
            {options.map((item) => (
              <button key={item} onClick={() => handleChangeStatus(task, item)}>
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

type DateCreatedFieldProps = {
  date: TaskProps["task"]["date_created"];
};

function DateCreatedField({ date }: DateCreatedFieldProps) {
  return <div className="date-created">{date}</div>;
}

type EditSaveBtnProps = {
  isEditing: boolean;
  onIsEditing: () => void;
};

function EditSaveBtn({ isEditing, onIsEditing }: EditSaveBtnProps) {
  return (
    <button className="secondary" onClick={onIsEditing}>
      <span className="material-symbols-outlined">
        {isEditing ? "save" : "edit"}
      </span>
    </button>
  );
}

type DeleteTaskBtnProps = {
  task: TaskProps["task"];
};

function DeleteTaskBtn({ task }: DeleteTaskBtnProps) {
  const dispatch = useContext(dispatchTasksContext);
  return (
    <button
      className="secondary"
      onClick={() =>
        dispatch({
          type: "deleted",
          id: task.id,
        })
      }
    >
      <span className="material-symbols-outlined">delete</span>
    </button>
  );
}
