import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import IndexPage from "./pages/IndexPage";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import TaskApp from "./components/task-management/TaskApp";
import TestPage from "./pages/TestPage";

import { SpeedInsights } from "@vercel/speed-insights/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/tasks",
        element: <TaskApp source="original" />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <SpeedInsights />
    </div>
  );
}

export default App;
