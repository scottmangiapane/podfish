import "./Episode.css";

function Episode({ title, description, date }) {
  return (
    <div className="episode">
      <p>{ title }</p>
      <p>{ new Date(date).toDateString() }</p>
      <p>{ description }</p>
    </div>
  );
}

export default Episode;
