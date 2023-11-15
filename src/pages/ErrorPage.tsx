import { NavLink, useRouteError } from "react-router-dom";

interface RouteError {
  statusText: string;
  message: string;
}

export default function ErrorPage() {
  const err = useRouteError() as RouteError;

  return (
    <>
      <p>Error: {err.statusText || err.message}</p>
      <p>
        Back to <NavLink to="/">homepage</NavLink>
      </p>
    </>
  );
}
