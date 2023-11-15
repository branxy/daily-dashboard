import { useContext } from "react";

import { dispatchTasksContext } from "./constants";

export default function SortFilterPanel() {
  const dispatch = useContext(dispatchTasksContext);

  return (
    <>
      <div className="sort-btns">
        <button
          className="primary"
          onClick={() => dispatch({ type: "sorted-reverse" })}
        >
          Sort reverse
        </button>
        {/* <button onClick={() => dispatch({ type: "sort-by-date-ascending" })}>
          Sort by date ascending
        </button> */}
        <button
          className="primary"
          onClick={() => dispatch({ type: "sort-by-status" })}
        >
          Sort by status
        </button>
      </div>
    </>
  );
}
