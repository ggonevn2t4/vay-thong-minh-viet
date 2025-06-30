
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteDebugger = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('Route changed:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      fullUrl: window.location.href
    });
  }, [location]);

  return null;
};

export default RouteDebugger;
