import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { dispatchTasksContext } from "./constants";
import { TaskAppType, TaskItem } from "./types";

type TaskProps = {
  readonly task: TaskItem;
  source: TaskAppType["source"];
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
    const newDate = new Date(input.value);

    function autoCloseDatePicker(e: MouseEvent) {
      if (e.target !== input) {
        setIsEditingDate(!isEditingDate);
      }
    }
    dispatch({
      type: "changed",
      task: { ...task, dueDate: newDate },
    });
    document.addEventListener("click", autoCloseDatePicker, { once: true });
  }

  return (
    <div className="list-item">
      <TaskCheckboxField task={task} />
      <div className="title-and-date flex">
        <TaskTitleField
          task={task}
          isEditing={isEditing}
          onSelectTask={onSelectTask}
        />
        <TaskDueDate
          dueDate={task.dueDate}
          isEditingDate={isEditingDate}
          setIsEditingDate={setIsEditingDate}
          onInput={handleUpdateDate}
          source={source}
        />
      </div>
      <StatusField task={task} />
      <DateCreatedField date={task.dateCreated} />
      <EditSaveBtn isEditing={isEditing} onIsEditing={toggleEditing} />
      <DeleteTaskBtn task={task} />
    </div>
  );
}

type TaskCheckboxFieldProps = {
  readonly task: TaskItem;
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
  readonly dueDate: Date;
  readonly isEditingDate: boolean;
  setIsEditingDate: Dispatch<SetStateAction<boolean>>;
  onInput: (e: ChangeEvent<HTMLInputElement>) => void;
  source: TaskAppType["source"];
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

  if (isEditingDate) {
    const adjustedUTC = new Date(
      dueDate.getTime() - dueDate.getTimezoneOffset() * 60000
    );
    const utcString = adjustedUTC.toISOString().slice(0, 16);

    dateContent = (
      <input
        ref={dateInputRef}
        type="datetime-local"
        name="due-date"
        value={utcString}
        onChange={onInput}
      />
    );
  } else {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = {
      timeZone: userTimeZone,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    } as const;
    const fullDate = dueDate
      .toLocaleString(undefined, options)
      .split(",")
      .join("");
    const time = `${dueDate.getHours()}:${dueDate.getMinutes()}`;
    dateContent = (
      <button
        className="secondary"
        onClick={() => setIsEditingDate(!isEditingDate)}
      >
        {source === "original" ? fullDate : `Today ${time}`}
      </button>
    );
  }
  return <div className="due-date">{dateContent}</div>;
}

type TaskTitleFieldProps = {
  readonly task: TaskItem;
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
  readonly task: TaskItem;
};

function StatusField({ task }: StatusFieldProps) {
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const dispatch = useContext(dispatchTasksContext);
  const options = ["Not started", "In progress", "Done"] as const;

  function formatStatus(string: string) {
    return string.toLowerCase().split(" ").join("-");
  }

  function handleChangeStatus(task: TaskItem, otherStatus: TaskItem["status"]) {
    dispatch({
      type: "changed",
      task: { ...task, status: otherStatus },
    });
    setShowStatusOptions(false);
  }

  // if (showStatusOptions) {
  //   statusVariant = (
  //     <div className="options flex-col">
  //       {options.map((item) => (
  //         <button key={item} onClick={(e) => handleChangeStatus(task, item)}>
  //           {item}
  //         </button>
  //       ))}
  //     </div>
  //   );
  // } else {
  //   statusVariant = (
  //     <button
  //       className={`current ${formatStatus(task.status)}`}
  //       onClick={() => setShowStatusOptions(true)}
  //     >
  //       {task.status}
  //     </button>
  //   );
  // }

  return (
    <>
      <div className="status flex-col">
        <button
          className={`current ${formatStatus(task.status)}`}
          onClick={() => setShowStatusOptions(true)}
        >
          {task.status}
        </button>
        {showStatusOptions && (
          <div
            className="options flex-col"
            onClick={() => setShowStatusOptions(false)}
          >
            {options.map((item) => (
              <button key={item} onClick={() => handleChangeStatus(task, item)}>
                {item}
              </button>
            ))}
          </div>
        )}
        {/* {statusVariant} */}
        {/* <div className="current flex-col">
          <span
            className={formatStatus(task.status)}
            onClick={() => setShowStatusOptions(true)}
          >
            {task.status}
          </span>
        </div>
        {showStatusOptions && (
          <div
            className="options flex-col"
            onClick={() => setShowStatusOptions(false)}
          >
            {options.map((item) => (
              <button
                key={item}
                onClick={(e) => handleChangeStatus(task, item)}
              >
                {item}
              </button>
            ))}
          </div>
        )} */}
      </div>
    </>
  );
}

type DateCreatedFieldProps = {
  date: TaskItem["dateCreated"];
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
  task: TaskItem;
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
