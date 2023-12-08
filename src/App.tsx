import { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import DashboardPage from './page/dashBoardPage/DashBoardPage';

export default function App() {

  useEffect(() => {

  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path={'/'} component={DashboardPage} />
      </Switch>
    </div>
  );
}
