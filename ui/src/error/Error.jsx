import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import Titlebar from "..//Titlebar";

function Error() {
  const error = useRouteError();
  if (!isRouteErrorResponse(error)) {
      throw error;
  }

  console.log(error);

  return (
    <>
      <div className="app-body">
        <div className="app-content">
          <h1 className="mt-0">{ error.status } - { error.statusText }</h1>
          <p>{ error.data }</p>
        </div>
      </div>
    </>
  );
}

export default Error;
