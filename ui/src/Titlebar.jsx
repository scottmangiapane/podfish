import { Link } from 'react-router-dom';
import './Titlebar.css';

function Titlebar() {
  return (
    <p className='titlebar'>
      <span className='titlebar-item titlebar-item-left'>
        <Link to={`/`}>Home</Link>
      </span>
      <span className='titlebar-item'>
        <span>Podfish</span>
      </span>
      <span className='titlebar-item titlebar-item-right'>
      <Link to={`/sign-in`}>Sign In</Link>
      </span>
    </p>
  )
}

export default Titlebar;
