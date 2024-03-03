import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();
  if (!isRouteErrorResponse(error)) {
      throw error;
  }

  return (
    // TODO padding / margins
    <>
      <h1 className="mt-0">{ error.status } - { error.statusText }</h1>
      <p>{ error.data }</p>
    </>
  );
}

export default Error;
