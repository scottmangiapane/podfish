import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { RootProvider, useRootContext } from "@/contexts/RootContext";
import TitleBar from "@/components/TitleBar";

function RootWithContext() {
  const { dispatch } = useRootContext();

  useEffect(() => {
    const handleResize = () => {
      dispatch({ type: 'SET_IS_MOBILE', data: window.innerWidth < 576 })
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="root-content">
      <TitleBar />
      <Outlet />
    </div>
  );
}

function Root() {
  return (
    <RootProvider>
      <RootWithContext />
    </RootProvider>
  );
}

export default Root;
