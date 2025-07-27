import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();
  if (!isRouteErrorResponse(error)) {
      throw error;
  }

  return (
    <div className="root-content">
      <div className="app-content">
        <h1 className="mt-0">{ error.status } { error.statusText }</h1>
        <p>{ error.data }</p>
        <Link to={"/"}>
          <button className="btn btn-pill mt-3">Home</button>
        </Link>
      </div>
    </div>
  );
}

export default Error;
