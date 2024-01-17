import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { supabase } from "./supabaseClient.ts";

import "./App.css";
import IndexPage from "./pages/IndexPage";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import TaskApp from "./components/task-management/TaskApp";
import TestPage from "./pages/TestPage";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, useState } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";
import { Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="auth">
        <h1>✅ Daily Dashboard</h1>
        <p>Welcome! Please register or sign in to continue.</p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    );
  } else {
    return (
      <div className="App">
        <RouterProvider router={router} />
        <SpeedInsights />
      </div>
    );
  }
}

export default App;
