import "./Episode.css";

function Episode({ title, description }) {
  return (
    <div className="episode">
      <p>{ title }</p>
      <p>{ description }</p>
    </div>
  );
}

export default Episode;
