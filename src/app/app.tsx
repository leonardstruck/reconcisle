import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//import Components
import Home from "./components/Home/Home";
import Open from "./components/Open/Open";


export default function App() {
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

ReactDOM.render(<App />, document.getElementById('App'));
