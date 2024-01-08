import { Outlet } from 'react-router-dom';

import Titlebar from '../Titlebar';

function Root() {
  return (
    <div className='app'>
      <Titlebar />
      <div className='dashboard'>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
