import { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import DashboardPage from './page/dashBoardPage/DashBoardPage';
import GpsToSLAMConversionPage from './page/gpsToSLAMConversionPage/GpsToSLAMConversion';

export default function App() {

  useEffect(() => {

  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path={'/'} component={DashboardPage} />
        <Route path={"/convert"} component={GpsToSLAMConversionPage} />
      </Switch>
    </div>
  );
}
