import { useLocation } from "react-router-dom";

function Search() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get("q");

  return (
    <>
      <h1 className="mt-0">Search</h1>
      <p>Not yet implemented.</p>
      <p>Search text: { query }</p>
    </>
  );
}

export default Search;
