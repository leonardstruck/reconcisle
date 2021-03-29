import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./app.css";

//import Components
import Home from "./components/Home/Home";
import { Open } from "./components/Open/Open";


export function App() {
  return (
    <Router>
      <Switch>
        <Route path="/open">
          <Open />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default hot(module)(App);

ReactDOM.render(<App />, document.getElementById('App'));
